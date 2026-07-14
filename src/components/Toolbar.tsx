import { Eye, Edit3, Upload, Map, Skull, Key, Download, Upload as UploadIcon, Trash2, Menu, X, ChevronUp, ChevronDown, MapPin, Images, RefreshCw } from 'lucide-react';
import type { MapData, Mode, Marker } from '@/types';
import { useState } from 'react';

interface ToolbarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onUploadMap: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onOpenGallery: () => void;
  onClearData: () => void;
  onClearCache: () => void;
  maps: MapData[];
  currentMapId: string | null;
  onSwitchMap: (mapId: string) => void;
  onDeleteMap: (mapId: string) => void;
  markers: Marker[];
  isMobile?: boolean;
  show?: boolean;
  onHide?: () => void;
  onShow?: () => void;
}

export function Toolbar({ mode, onModeChange, onUploadMap, onExportData, onImportData, onOpenGallery, onClearData, onClearCache, maps, currentMapId, onSwitchMap, onDeleteMap, markers, isMobile = false, show = true, onHide, onShow }: ToolbarProps) {
  const redCount = markers.filter((m) => m.type === 'red').length;
  const cardCount = markers.filter((m) => m.type === 'card').length;
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMapList, setShowMapList] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const currentMap = maps.find(m => m.id === currentMapId);

  const handleDeleteMap = (mapId: string) => {
    if (deleteConfirmId === mapId) {
      onDeleteMap(mapId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(mapId);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  if (isMobile) {
    return (
      <>
        {show && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-military-800 border-t border-military-700">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-military-700 flex items-center justify-center">
                  <Map className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-military-500">三角洲行动</p>
                  <p className="text-xs text-military-400">{currentMap ? currentMap.name : '未选择'} | {redCount}红 {cardCount}卡</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onModeChange('view')}
                  className={`p-3 rounded-lg transition-all ${
                    mode === 'view'
                      ? 'bg-green-600 text-white'
                      : 'bg-military-700 text-military-400 hover:bg-military-600'
                  }`}
                  title="观看模式"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onModeChange('edit')}
                  className={`p-3 rounded-lg transition-all ${
                    mode === 'edit'
                      ? 'bg-orange-600 text-white'
                      : 'bg-military-700 text-military-400 hover:bg-military-600'
                  }`}
                  title="编辑模式"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-3 bg-military-700 hover:bg-military-600 text-military-400 rounded-lg transition-all"
                  title="更多选项"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {showMobileMenu && (
              <div className="px-4 pb-4 space-y-2">
                {/* 地图选择器 */}
                {maps.length > 0 && (
                  <div>
                    <label className="block text-xs text-military-500 mb-1.5">切换地图</label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {maps.map(map => (
                        <div
                          key={map.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            map.id === currentMapId
                              ? 'bg-blue-600/30 border border-blue-500'
                              : 'bg-military-700 hover:bg-military-600 border border-transparent'
                          }`}
                          onClick={() => { onSwitchMap(map.id); setShowMobileMenu(false); }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-military-400 flex-shrink-0" />
                            <span className="text-sm text-white truncate">{map.name}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                            className={`p-1 rounded transition-colors flex-shrink-0 ${
                              deleteConfirmId === map.id
                                ? 'bg-red-600 text-white'
                                : 'text-military-500 hover:text-red-400'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { onUploadMap(); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">上传地图</span>
                </button>
                <button
                  onClick={() => { onOpenGallery(); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
                >
                  <Images className="w-4 h-4" />
                  <span className="text-sm">图片仓库</span>
                </button>
                <button
                  onClick={() => { onExportData(); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">导出数据</span>
                </button>
                <button
                  onClick={() => { onImportData(); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
                >
                  <UploadIcon className="w-4 h-4" />
                  <span className="text-sm">导入数据</span>
                </button>
                <button
                  onClick={() => { onClearData(); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">清空数据</span>
                </button>
                <button
                  onClick={() => { onClearCache(); setShowMobileMenu(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-900/50 hover:bg-orange-800/50 text-orange-400 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">清除缓存</span>
                </button>
              </div>
            )}
            
            <button
              onClick={onHide}
              className="absolute top-[-32px] right-4 p-2 bg-military-800 border-t border-x border-military-700 rounded-t-lg text-military-400 hover:text-white transition-colors"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {!show && (
          <button
            onClick={onShow}
            className="fixed bottom-4 right-4 p-3 bg-military-800 border border-military-700 rounded-full shadow-lg text-military-400 hover:text-white transition-colors z-30"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        )}
      </>
    );
  }

  return (
    <div className="w-64 bg-military-800 border-r border-military-700 flex flex-col">
      <div className="p-4 border-b border-military-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Map className="w-6 h-6 text-blue-500" />
          三角洲行动
        </h1>
        <p className="text-xs text-military-500 mt-1">地图标记工具</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-military-400 mb-2">操作模式</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onModeChange('view')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                mode === 'view'
                  ? 'bg-green-600 text-white'
                  : 'bg-military-700 text-military-400 hover:bg-military-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">观看</span>
            </button>
            <button
              onClick={() => onModeChange('edit')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                mode === 'edit'
                  ? 'bg-orange-600 text-white'
                  : 'bg-military-700 text-military-400 hover:bg-military-600'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm">编辑</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-military-400 mb-2">地图操作</label>
          <div className="space-y-2">
            <button
              onClick={onUploadMap}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">上传地图</span>
            </button>
            <button
              onClick={onOpenGallery}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
            >
              <Images className="w-4 h-4" />
              <span className="text-sm">图片仓库</span>
            </button>
            <button
              onClick={onExportData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">导出数据</span>
            </button>
            <button
              onClick={onImportData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
            >
              <UploadIcon className="w-4 h-4" />
              <span className="text-sm">导入数据</span>
            </button>
            <button
              onClick={onClearData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">清空数据</span>
            </button>
            <button
              onClick={onClearCache}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-900/50 hover:bg-orange-800/50 text-orange-400 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">清除缓存</span>
            </button>
          </div>
        </div>
      </div>

      {/* 地图列表 */}
      <div className="flex-1 px-4 pb-2 min-h-0">
        <button
          onClick={() => setShowMapList(!showMapList)}
          className="w-full flex items-center justify-between text-sm font-medium text-military-400 mb-2 hover:text-military-300 transition-colors"
        >
          <span>地图列表 ({maps.length})</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showMapList ? 'rotate-180' : ''}`} />
        </button>
        
        {showMapList && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {maps.length === 0 ? (
              <div className="bg-military-900/50 rounded-lg p-3 text-center text-military-500 text-xs">
                暂无地图，点击上传
              </div>
            ) : (
              maps.map(map => {
                const mapMarkers = markers.filter(m => m.mapId === map.id);
                const isActive = map.id === currentMapId;
                return (
                  <div
                    key={map.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                      isActive
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-military-900/50 hover:bg-military-700/50 border border-transparent'
                    }`}
                    onClick={() => onSwitchMap(map.id)}
                  >
                    <div className={`w-8 h-8 rounded flex-shrink-0 overflow-hidden ${
                      isActive ? 'ring-1 ring-blue-500' : ''
                    }`}>
                      <img src={map.imageBase64} alt={map.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isActive ? 'text-blue-300' : 'text-white'}`}>{map.name}</p>
                      <p className="text-xs text-military-500">
                        {mapMarkers.length} 个标记
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                      className={`p-1 rounded transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 ${
                        deleteConfirmId === map.id
                          ? 'opacity-100 bg-red-600 text-white'
                          : 'text-military-500 hover:text-red-400'
                      }`}
                      title={deleteConfirmId === map.id ? '再次点击确认删除' : '删除地图'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 当前地图信息 & 统计 */}
      <div className="p-4 border-t border-military-700 space-y-3">
        {currentMap ? (
          <div className="bg-military-900 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-military-500">当前地图</span>
              <span className="text-sm text-blue-400">{currentMap.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-military-500">尺寸</span>
              <span className="text-sm text-white">{currentMap.width} × {currentMap.height}</span>
            </div>
          </div>
        ) : (
          <div className="bg-military-900/50 rounded-lg p-3 text-center text-military-500 text-sm">
            未选择地图
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-military-400 mb-2">标记统计</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Skull className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">刷红点位</span>
              </div>
              <span className="text-xl font-bold text-red-400">{redCount}</span>
            </div>
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-400">刷卡点位</span>
              </div>
              <span className="text-xl font-bold text-blue-400">{cardCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-military-700">
        <div className="text-xs text-military-500 text-center">
          <p>滚轮缩放 | 拖拽平移</p>
          <p className="mt-1">编辑模式下点击地图添加标记</p>
        </div>
      </div>
    </div>
  );
}
