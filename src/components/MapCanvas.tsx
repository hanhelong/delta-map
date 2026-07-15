import { useRef, useState, useCallback, useEffect } from 'react';
import type { MapData, Marker, MarkerType, Mode, Skin } from '@/types';
import { MarkerPoint } from './MarkerPoint';
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff } from 'lucide-react';

interface MapCanvasProps {
  mapData: MapData | null;
  markers: Marker[];
  mode: Mode;
  skin: Skin;
  markerTypes: MarkerType[];
  onMarkerClick: (marker: Marker) => void;
  onMapClick: (x: number, y: number) => void;
  isMobile?: boolean;
  onTap?: () => void;
}

export function MapCanvas({ mapData, markers, mode, skin, markerTypes, onMarkerClick, onMapClick, isMobile = false, onTap }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [lastTapTime, setLastTapTime] = useState(0);
  const [mapDisplaySize, setMapDisplaySize] = useState({ width: 0, height: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [minScale, setMinScale] = useState(1);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());
  const [showLegendPanel, setShowLegendPanel] = useState(false);

  const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
    if (!containerRef.current || !mapData) return { x, y };
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const mapWidth = mapDisplaySize.width * currentScale;
    const mapHeight = mapDisplaySize.height * currentScale;
    
    const minX = Math.min(0, containerWidth - mapWidth);
    const maxX = Math.max(0, containerWidth - mapWidth);
    const minY = Math.min(0, containerHeight - mapHeight);
    const maxY = Math.max(0, containerHeight - mapHeight);
    
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }, [mapData, mapDisplaySize]);

  const getTypeCount = (typeId: string) => {
    return markers.filter(m => m.type === typeId).length;
  };

  // 获取当前地图中存在的标记类型
  const getMapMarkerTypes = () => {
    const typeIds = new Set(markers.map(m => m.type));
    return markerTypes.filter(mt => typeIds.has(mt.id));
  };

  const mapMarkerTypes = getMapMarkerTypes();

  // 切换标记类型的显示/隐藏
  const toggleTypeVisibility = (typeId: string) => {
    setHiddenTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(typeId)) {
        newSet.delete(typeId);
      } else {
        newSet.add(typeId);
      }
      return newSet;
    });
  };

  // 过滤要显示的标记点
  const visibleMarkers = markers.filter(m => !hiddenTypes.has(m.type));

  const zoomBy = useCallback((factor: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setScale((prevScale) => {
      const newScale = Math.min(Math.max(prevScale * factor, minScale), 5);
      const ratio = newScale / prevScale;
      const newX = centerX - (centerX - position.x) * ratio;
      const newY = centerY - (centerY - position.y) * ratio;
      const clamped = clampPosition(newX, newY, newScale);
      setPosition(clamped);
      return newScale;
    });
  }, [minScale, position, clampPosition]);

  const setZoom = useCallback((newScale: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const clampedScale = Math.min(Math.max(newScale, minScale), 5);
    const ratio = clampedScale / scale;
    const newX = centerX - (centerX - position.x) * ratio;
    const newY = centerY - (centerY - position.y) * ratio;
    const clamped = clampPosition(newX, newY, clampedScale);
    setPosition(clamped);
    setScale(clampedScale);
  }, [minScale, scale, position, clampPosition]);

  const fitMapToContainer = useCallback(() => {
    if (!containerRef.current || !mapData) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const scaleX = containerWidth / mapData.width;
    const scaleY = containerHeight / mapData.height;
    const fitScale = Math.max(scaleX, scaleY);
    
    const mapWidth = mapData.width * fitScale;
    const mapHeight = mapData.height * fitScale;
    
    const offsetX = (containerWidth - mapWidth) / 2;
    const offsetY = (containerHeight - mapHeight) / 2;
    
    setScale(fitScale);
    setMinScale(fitScale);
    setPosition({ x: offsetX, y: offsetY });
    setMapDisplaySize({ width: mapData.width, height: mapData.height });
  }, [mapData]);

  useEffect(() => {
    if (mapData && containerRef.current) {
      fitMapToContainer();
    }
  }, [mapData, fitMapToContainer]);

  useEffect(() => {
    const handleResize = () => {
      if (mapData) {
        fitMapToContainer();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapData, fitMapToContainer]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setScale((prevScale) => {
      const newScale = Math.min(Math.max(prevScale * delta, minScale), 5);
      const ratio = newScale / prevScale;
      const newX = mouseX - (mouseX - position.x) * ratio;
      const newY = mouseY - (mouseY - position.y) * ratio;
      const clamped = clampPosition(newX, newY, newScale);
      setPosition(clamped);
      return newScale;
    });
  }, [minScale, position, clampPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && scale > minScale) {
      setIsDragging(true);
      setHasDragged(false);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragOffset({ x: position.x, y: position.y });
    }
  }, [position, scale, minScale]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setHasDragged(true);
    }
    const newX = dragOffset.x + dx;
    const newY = dragOffset.y + dy;
    const clamped = clampPosition(newX, newY, scale);
    setPosition(clamped);
  }, [isDragging, dragStart, dragOffset, scale, clampPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current || !mapData) return;
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (scale > minScale) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
        setDragOffset({ x: position.x, y: position.y });
      }
      
      const currentTime = Date.now();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 300 && tapLength > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left - position.x) / scale / mapDisplaySize.width) * 100;
        const y = ((touch.clientY - rect.top - position.y) / scale / mapDisplaySize.height) * 100;
        
        if (mode === 'edit' && x >= 0 && x <= 100 && y >= 0 && y <= 100) {
          onMapClick(x, y);
        }
        e.preventDefault();
      }
      setLastTapTime(currentTime);
    }
  }, [position, scale, minScale, mode, lastTapTime, onMapClick, mapData, mapDisplaySize]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.x;
      const dy = touch.clientY - dragStart.y;
      const newX = dragOffset.x + dx;
      const newY = dragOffset.y + dy;
      const clamped = clampPosition(newX, newY, scale);
      setPosition(clamped);
    }
  }, [isDragging, dragStart, dragOffset, scale, clampPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!mapData || !containerRef.current || hasDragged) return;

    // 检查是否点击了标记点，如果是则不添加新标记
    const target = e.target as HTMLElement;
    if (target.closest('[data-marker-point]')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - position.x) / scale / mapDisplaySize.width) * 100;
    const y = ((e.clientY - rect.top - position.y) / scale / mapDisplaySize.height) * 100;

    if (mode === 'edit' && x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      onMapClick(x, y);
    }
  }, [mapData, mode, position, scale, onMapClick, mapDisplaySize, hasDragged]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current && isMobile && onTap) {
      onTap();
    }
  }, [isMobile, onTap]);

  const resetView = useCallback(() => {
    fitMapToContainer();
  }, [fitMapToContainer]);

  if (!mapData) {
    return (
      <div className={`flex-1 flex items-center justify-center border-2 border-dashed transition-all duration-500 ${
        skin === 'skin2' 
          ? 'bg-[#0a0a0f] border-[#1a1a2e]' 
          : 'bg-military-900 border-military-600'
      } ${isMobile ? 'rounded-none' : 'rounded-lg'}`}>
        <div className={`text-center px-4 transition-all duration-500 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>
          <p className={`${isMobile ? 'text-base' : 'text-lg'}`}>暂无地图</p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>请上传地图图片</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!isMobile && (
        <div className={`flex items-center justify-between px-4 py-2 flex-shrink-0 transition-all duration-500 ${
          skin === 'skin2' 
            ? 'bg-[#12121a]/80 border-[#1a1a2e]' 
            : 'bg-military-800 border-military-700'
        } border-b backdrop-blur-xl`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm transition-all duration-500 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>缩放: {Math.round(scale * 100)}%</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => zoomBy(0.8)}
                className={`px-2 py-1 text-sm rounded transition-all duration-300 ${
                  skin === 'skin2' 
                    ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]' 
                    : 'bg-military-700 hover:bg-military-600'
                }`}
              >
                -
              </button>
              <button
                onClick={() => zoomBy(1.25)}
                className={`px-2 py-1 text-sm rounded transition-all duration-300 ${
                  skin === 'skin2' 
                    ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]' 
                    : 'bg-military-700 hover:bg-military-600'
                }`}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={resetView}
            className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
              skin === 'skin2' 
                ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]' 
                : 'bg-military-700 hover:bg-military-600'
            }`}
          >
            重置视图
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden relative min-h-0 transition-all duration-500 ${
          skin === 'skin2' ? 'bg-[#0a0a0f] skin2-grid-bg' : 'bg-military-900'
        } ${scale > minScale ? 'cursor-grab active:cursor-grabbing' : mode === 'edit' ? 'cursor-crosshair' : 'cursor-default'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onClick={handleCanvasClick}
        onClickCapture={handleContainerClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: mapDisplaySize.width || mapData.width,
            height: mapDisplaySize.height || mapData.height,
          }}
        >
          <img
            src={mapData.imageBase64}
            alt={mapData.name}
            className="w-full h-full block select-none pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0">
            {visibleMarkers.map((marker) => (
              <MarkerPoint
                key={marker.id}
                marker={marker}
                markerTypes={markerTypes}
                onClick={() => onMarkerClick(marker)}
                isEditMode={mode === 'edit'}
                skin={skin}
              />
            ))}
          </div>
        </div>
        
        {isMobile && mapData && (
          <div 
            className="absolute top-2 right-2 z-30 flex flex-col items-end gap-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className={`rounded-lg px-3 py-2 shadow-lg backdrop-blur-xl transition-all duration-500 ${
              skin === 'skin2' 
                ? 'bg-[#12121a]/95 border border-[#1a1a2e]' 
                : 'bg-military-800/95 border border-military-600'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={(e) => { e.stopPropagation(); zoomBy(0.8); }}
                  onTouchStart={(e) => e.stopPropagation()}
                  className={`w-9 h-9 border rounded flex items-center justify-center active:scale-95 transition-all duration-300 ${
                    skin === 'skin2' 
                      ? 'bg-[#1a1a2e]/50 border-[#1a1a2e] text-[#8888aa] hover:bg-[#1a1a2e]' 
                      : 'bg-military-700 border-military-600 text-military-300 hover:bg-military-600'
                  }`}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className={`text-xs font-mono min-w-[48px] text-center transition-all duration-500 ${
                  skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
                }`}>
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); zoomBy(1.25); }}
                  onTouchStart={(e) => e.stopPropagation()}
                  className={`w-9 h-9 border rounded flex items-center justify-center active:scale-95 transition-all duration-300 ${
                    skin === 'skin2' 
                      ? 'bg-[#1a1a2e]/50 border-[#1a1a2e] text-[#8888aa] hover:bg-[#1a1a2e]' 
                      : 'bg-military-700 border-military-600 text-military-300 hover:bg-military-600'
                  }`}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetView(); }}
                  onTouchStart={(e) => e.stopPropagation()}
                  className={`w-9 h-9 border rounded flex items-center justify-center active:scale-95 transition-all duration-300 ${
                    skin === 'skin2' 
                      ? 'bg-[#1a1a2e]/50 border-[#1a1a2e] text-[#8888aa] hover:bg-[#1a1a2e]' 
                      : 'bg-military-700 border-military-600 text-military-300 hover:bg-military-600'
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="range"
                min={minScale}
                max={5}
                step={0.05}
                value={scale}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-500 ${
                  skin === 'skin2' ? 'accent-[#00f5ff]' : 'accent-blue-500'
                }`}
                style={{
                  background: skin === 'skin2'
                    ? `linear-gradient(to right, #00f5ff 0%, #00f5ff ${((scale - minScale) / (5 - minScale)) * 100}%, #1a1a2e ${((scale - minScale) / (5 - minScale)) * 100}%, #1a1a2e 100%)`
                    : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((scale - minScale) / (5 - minScale)) * 100}%, #374151 ${((scale - minScale) / (5 - minScale)) * 100}%, #374151 100%)`
                }}
              />
            </div>
          </div>
        )}
        
        {mode === 'edit' && (
          <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} px-3 py-2 rounded border z-30 pointer-events-none backdrop-blur-xl transition-all duration-500 ${
            skin === 'skin2' 
              ? 'bg-[#12121a]/90 border-[#1a1a2e]' 
              : 'bg-military-800/90 border-military-600'
          }`}>
            <div className={`text-xs transition-all duration-500 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>
              {isMobile ? (
                <>
                  <p>双击添加标记</p>
                  <p className="mt-1">单指拖动移动</p>
                </>
              ) : (
                <>
                  <p>点击添加标记 | 滚轮缩放</p>
                  <p className="mt-1">按住左键拖动移动</p>
                </>
              )}
            </div>
          </div>
        )}

        <div className={`absolute ${isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-6 left-1/2 -translate-x-1/2'} z-30 pointer-events-none`}>
          <div className={`rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-xl border transition-all duration-500 ${
            skin === 'skin2'
              ? 'bg-[#12121a]/90 border-[#1a1a2e] skin2-legend-glow'
              : 'bg-military-800/90 border-military-600'
          }`}>
            <div className={`flex items-center gap-4 ${isMobile ? 'gap-3' : 'gap-5'}`}>
              {mapMarkerTypes.map((mt) => {
                const count = getTypeCount(mt.id);
                const isVisible = !hiddenTypes.has(mt.id);
                return (
                  <div key={mt.id} className={`flex items-center gap-2 transition-all duration-300 ${!isVisible ? 'opacity-40' : ''}`}>
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: mt.color,
                        boxShadow: skin === 'skin2' && isVisible ? `0 0 8px ${mt.color}` : 'none',
                      }}
                    />
                    <span className={`text-xs font-medium whitespace-nowrap transition-all duration-500 ${
                      skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
                    }`}>
                      {mt.name}
                      <span className={`ml-1 font-bold tabular-nums transition-all duration-500 ${
                        skin === 'skin2' ? 'text-white' : 'text-military-200'
                      }`}>
                        {count}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右下角图例显示/隐藏控制 */}
        {mapMarkerTypes.length > 0 && (
          <div className={`absolute ${isMobile ? 'right-2 top-16' : 'right-4 top-4'} z-30`}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowLegendPanel(!showLegendPanel); }}
              className={`p-2 rounded-lg backdrop-blur-xl border transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-[#12121a]/90 border-[#1a1a2e] text-[#00f5ff] hover:bg-[#1a1a2e]'
                  : 'bg-military-800/90 border-military-600 text-military-300 hover:bg-military-700'
              }`}
              title="图例控制"
            >
              {showLegendPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {showLegendPanel && (
              <div className={`absolute top-full right-0 mt-2 rounded-xl overflow-hidden backdrop-blur-xl border transition-all duration-300 animate-scale-in ${
                skin === 'skin2'
                  ? 'bg-[#12121a]/95 border-[#1a1a2e]'
                  : 'bg-military-800/95 border-military-600'
              }`} style={{ minWidth: '140px' }}>
                <div className={`px-3 py-2 border-b transition-all duration-500 ${
                  skin === 'skin2' ? 'border-[#1a1a2e]' : 'border-military-700'
                }`}>
                  <span className={`text-xs font-medium transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
                  }`}>显示/隐藏点位</span>
                </div>
                <div className="p-2">
                  {mapMarkerTypes.map((mt) => {
                    const isVisible = !hiddenTypes.has(mt.id);
                    const count = getTypeCount(mt.id);
                    return (
                      <button
                        key={mt.id}
                        onClick={(e) => { e.stopPropagation(); toggleTypeVisibility(mt.id); }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                          skin === 'skin2' ? 'hover:bg-[#1a1a2e]' : 'hover:bg-military-700'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300"
                          style={{
                            backgroundColor: isVisible ? mt.color : '#444',
                            boxShadow: isVisible && skin === 'skin2' ? `0 0 6px ${mt.color}` : 'none',
                            opacity: isVisible ? 1 : 0.5,
                          }}
                        />
                        <span className={`text-xs flex-1 text-left transition-all duration-300 ${
                          skin === 'skin2'
                            ? isVisible ? 'text-[#8888aa]' : 'text-[#444466]'
                            : isVisible ? 'text-military-300' : 'text-military-600'
                        }`}>
                          {mt.name}
                        </span>
                        <span className={`text-xs font-bold tabular-nums transition-all duration-300 ${
                          skin === 'skin2'
                            ? isVisible ? 'text-white' : 'text-[#444466]'
                            : isVisible ? 'text-military-200' : 'text-military-600'
                        }`}>
                          {count}
                        </span>
                        {isVisible ? (
                          <Eye className={`w-3.5 h-3.5 transition-all duration-300 ${
                            skin === 'skin2' ? 'text-[#00f5ff]' : 'text-blue-400'
                          }`} />
                        ) : (
                          <EyeOff className={`w-3.5 h-3.5 transition-all duration-300 ${
                            skin === 'skin2' ? 'text-[#444466]' : 'text-military-600'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}