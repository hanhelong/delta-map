import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { MapData, Marker, Mode, GalleryImage } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Toolbar } from '@/components/Toolbar';
import { MapCanvas } from '@/components/MapCanvas';
import { UploadModal } from '@/components/UploadModal';
import { AddMarkerModal } from '@/components/AddMarkerModal';
import { MarkerPopup } from '@/components/MarkerPopup';
import { ImageGallery } from '@/components/ImageGallery';
import { ConfirmModal } from '@/components/ConfirmModal';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function MapApp() {
  const [mode, setMode] = useState<Mode>('view');
  const [maps, setMaps] = useLocalStorage<MapData[]>('deltaMaps', []);
  const [currentMapId, setCurrentMapId] = useLocalStorage<string | null>('deltaCurrentMapId', null);
  const [markers, setMarkers] = useLocalStorage<Marker[]>('deltaMarkers', []);
  const [galleryImages, setGalleryImages] = useLocalStorage<GalleryImage[]>('deltaGallery', []);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddMarkerModal, setShowAddMarkerModal] = useState(false);
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [gallerySelectMode, setGallerySelectMode] = useState(false);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);

  const [addMarkerPosition, setAddMarkerPosition] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCacheConfirm, setShowCacheConfirm] = useState(false);

  const currentMap = maps.find(m => m.id === currentMapId) ?? null;
  const currentMarkers = markers.filter(m => m.mapId === currentMapId);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!currentMap) setMode('view');
  }, [currentMap]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  const handleUploadMap = (name: string, imageBase64: string, width: number, height: number) => {
    const newMap: MapData = { id: generateId(), name, imageBase64, width, height, createdAt: Date.now() };
    setMaps(prev => [...prev, newMap]);
    setCurrentMapId(newMap.id);
    setMode('edit');
  };

  const handleSwitchMap = (mapId: string) => setCurrentMapId(mapId);

  const handleDeleteMap = (mapId: string) => {
    setMaps(prev => prev.filter(m => m.id !== mapId));
    setMarkers(prev => prev.filter(m => m.mapId !== mapId));
    if (currentMapId === mapId) setCurrentMapId(null);
  };

  const handleMapClick = (x: number, y: number) => {
    if (mode === 'edit' && currentMap) {
      setEditingMarker(null);
      setAddMarkerPosition({ x, y });
      setShowAddMarkerModal(true);
    }
  };

  const handleAddMarker = (type: 'red' | 'card', name: string, imageBase64: string, description: string, iconImage: string, iconSize: number) => {
    if (!currentMap) return;
    if (imageBase64) {
      const exists = galleryImages.some(img => img.imageBase64 === imageBase64);
      if (!exists) {
        const img = new window.Image();
        img.onload = () => handleUploadToGallery(name || '点位图片', imageBase64, img.width, img.height);
        img.src = imageBase64;
      }
    }
    if (editingMarker) {
      setMarkers(prev => prev.map(m => m.id === editingMarker.id ? { ...m, type, name, imageBase64, description, iconImage, iconSize } : m));
      setEditingMarker(null);
    } else {
      const newMarker: Marker = {
        id: generateId(), mapId: currentMap.id, type, name,
        x: addMarkerPosition.x, y: addMarkerPosition.y,
        imageBase64, iconImage, iconSize, description, createdAt: Date.now(),
      };
      setMarkers(prev => [...prev, newMarker]);
    }
    setShowAddMarkerModal(false);
  };

  const handleMarkerClick = (marker: Marker) => {
    if (mode === 'edit') {
      setEditingMarker(marker);
      setAddMarkerPosition({ x: marker.x, y: marker.y });
      setShowAddMarkerModal(true);
    } else {
      setSelectedMarker(marker);
      setShowMarkerPopup(true);
    }
  };

  const handleDeleteMarker = () => {
    if (!selectedMarker) return;
    setMarkers(prev => prev.filter(m => m.id !== selectedMarker.id));
    setShowMarkerPopup(false);
    setSelectedMarker(null);
  };

  const handleExportData = () => {
    const data = { maps, currentMapId, markers, gallery: galleryImages, exportTime: Date.now() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delta-maps-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (!data.maps || !data.markers) { alert('导入失败：文件格式不正确'); return; }
          const existingMapIds = new Set(maps.map(m => m.id));
          const existingMarkerIds = new Set(markers.map(m => m.id));
          const newMaps = data.maps.filter((m: MapData) => !existingMapIds.has(m.id));
          const newMarkers = data.markers.filter((m: Marker) => !existingMarkerIds.has(m.id));
          setMaps(prev => [...prev, ...newMaps]);
          setMarkers(prev => [...prev, ...newMarkers]);
          if (!currentMapId && newMaps.length > 0) setCurrentMapId(newMaps[0].id);
          alert(`导入成功！新增 ${newMaps.length} 张地图，${newMarkers.length} 个点位`);
        } catch { alert('导入失败：文件格式不正确'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleUploadToGallery = (name: string, imageBase64: string, width: number, height: number) => {
    const newImage: GalleryImage = { id: generateId(), name, imageBase64, width, height, createdAt: Date.now() };
    setGalleryImages(prev => [...prev, newImage]);
  };

  const handleDeleteGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const handleOpenGallery = () => { setGallerySelectMode(false); setShowImageGallery(true); };

  const handleSelectFromGallery = (callback: (image: GalleryImage) => void) => {
    setGallerySelectMode(true);
    setGallerySelectCallback(() => callback);
    setShowImageGallery(true);
  };

  const [gallerySelectCallback, setGallerySelectCallback] = useState<((image: GalleryImage) => void) | null>(null);

  const handleGallerySelect = (image: GalleryImage) => {
    if (gallerySelectCallback) gallerySelectCallback(image);
    setShowImageGallery(false);
    setGallerySelectMode(false);
    setGallerySelectCallback(null);
  };

  const handleClearData = () => setShowClearConfirm(true);

  const confirmClearData = () => {
    setMaps([]);
    setCurrentMapId(null);
    setMarkers([]);
    setGalleryImages([]);
    setMode('view');
    setShowClearConfirm(false);
  };

  const handleClearCache = () => setShowCacheConfirm(true);

  const confirmClearCache = async () => {
    // 清除 localStorage
    localStorage.clear();
    
    // 清除 Service Worker 缓存
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // 清除 sessionStorage
    sessionStorage.clear();
    
    // 刷新页面
    window.location.reload();
  };

  return (
    <div className={`h-screen bg-military-900 ${isMobile ? 'fixed inset-0 overflow-hidden flex flex-col' : 'flex flex-row'}`}>
      {!isMobile && (
        <Toolbar
          mode={mode}
          onModeChange={handleModeChange}
          onUploadMap={() => setShowUploadModal(true)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onOpenGallery={handleOpenGallery}
          onClearData={handleClearData}
          onClearCache={handleClearCache}
          maps={maps}
          currentMapId={currentMapId}
          onSwitchMap={handleSwitchMap}
          onDeleteMap={handleDeleteMap}
          markers={currentMarkers}
          isMobile={false}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {!isMobile && (
          <header className="bg-military-800 border-b border-military-700 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-military-400">
                  当前模式:{' '}
                  <span className={mode === 'view' ? 'text-green-400' : 'text-orange-400'}>
                    {mode === 'view' ? '观看模式' : '编辑模式'}
                  </span>
                </span>
                {currentMap && (
                  <span className="text-sm text-military-400">
                    地图: <span className="text-white">{currentMap.name}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-military-500">
                  刷红: {currentMarkers.filter(m => m.type === 'red').length} | 刷卡: {currentMarkers.filter(m => m.type === 'card').length}
                </span>
              </div>
            </div>
          </header>
        )}

        <main className={`flex-1 min-h-0 flex flex-col ${!isMobile ? 'p-4' : 'p-0'}`}>
          <MapCanvas
            mapData={currentMap}
            markers={currentMarkers}
            mode={mode}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            isMobile={isMobile}
            onTap={() => setShowMobileToolbar(true)}
          />
        </main>
      </div>

      {isMobile && (
        <Toolbar
          mode={mode}
          onModeChange={handleModeChange}
          onUploadMap={() => setShowUploadModal(true)}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onOpenGallery={handleOpenGallery}
          onClearData={handleClearData}
          onClearCache={handleClearCache}
          maps={maps}
          currentMapId={currentMapId}
          onSwitchMap={handleSwitchMap}
          onDeleteMap={handleDeleteMap}
          markers={currentMarkers}
          isMobile={true}
          show={showMobileToolbar}
          onHide={() => setShowMobileToolbar(false)}
          onShow={() => setShowMobileToolbar(true)}
        />
      )}

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUploadMap} />
      )}

      {showAddMarkerModal && (
        <AddMarkerModal
          x={addMarkerPosition.x} y={addMarkerPosition.y}
          onClose={() => { setShowAddMarkerModal(false); setEditingMarker(null); }}
          onSave={handleAddMarker} editMarker={editingMarker}
          onOpenGallery={handleSelectFromGallery} onOpenIconGallery={handleSelectFromGallery}
        />
      )}

      {showMarkerPopup && selectedMarker && (
        <MarkerPopup
          marker={selectedMarker}
          onClose={() => { setShowMarkerPopup(false); setSelectedMarker(null); }}
          onEdit={() => {
            setShowMarkerPopup(false);
            setEditingMarker(selectedMarker);
            setAddMarkerPosition({ x: selectedMarker.x, y: selectedMarker.y });
            setShowAddMarkerModal(true);
            setSelectedMarker(null);
          }}
          onDelete={handleDeleteMarker} isEditMode={mode === 'edit'}
        />
      )}

      {showImageGallery && (
        <ImageGallery
          images={galleryImages}
          onClose={() => { setShowImageGallery(false); setGallerySelectMode(false); setGallerySelectCallback(null); }}
          onUpload={handleUploadToGallery} onDelete={handleDeleteGalleryImage}
          onSelect={gallerySelectMode ? handleGallerySelect : undefined} selectMode={gallerySelectMode}
        />
      )}

      <ConfirmModal
        isOpen={showClearConfirm} title="确认清空数据"
        message="确定要清空所有数据吗？这将删除所有地图、点位标记和图片仓库中的图片，此操作不可恢复！"
        confirmText="确认清空" cancelText="取消" danger={true}
        onConfirm={confirmClearData} onCancel={() => setShowClearConfirm(false)}
      />

      <ConfirmModal
        isOpen={showCacheConfirm} title="确认清除缓存"
        message="确定要清除浏览器缓存吗？这将清除所有本地存储数据、Service Worker缓存，并刷新页面，此操作不可恢复！"
        confirmText="确认清除" cancelText="取消" danger={true}
        onConfirm={confirmClearCache} onCancel={() => setShowCacheConfirm(false)}
      />

    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapApp />} />
    </Routes>
  );
}

export default App;
