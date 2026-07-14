import { Eye, Edit3, Upload, Map, Skull, Key, Download, Upload as UploadIcon, Trash2, Menu, X, ChevronUp, ChevronDown, Images, RefreshCw } from 'lucide-react';
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
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-military-900 via-military-800 to-military-800/95 border-t border-military-700/50 backdrop-blur-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Map className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-military-500">三角洲行动</p>
                  <p className="text-xs text-military-400">{currentMap ? currentMap.name : '未选择'} | {redCount}红 {cardCount}卡</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onModeChange('view')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    mode === 'view'
                      ? 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg shadow-green-500/30'
                      : 'bg-military-700/50 text-military-400 hover:bg-military-600/50'
                  }`}
                  title="观看模式"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onModeChange('edit')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    mode === 'edit'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-military-700/50 text-military-400 hover:bg-military-600/50'
                  }`}
                  title="编辑模式"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-3 bg-military-700/50 hover:bg-military-600/50 text-military-400 rounded-xl transition-all duration-300"
                  title="更多选项"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {showMobileMenu && (
              <div className="px-4 pb-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-military-400 mb-2">地图</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {maps.length === 0 ? (
                      <div className="bg-military-900/50 rounded-xl p-4 text-center text-military-500 text-xs">
                        暂无地图，点击上传
                      </div>
                    ) : (
                      maps.map(map => {
                        const mapMarkers = markers.filter(m => m.mapId === map.id);
                        const isActive = map.id === currentMapId;
                        return (
                          <div
                            key={map.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/30 to-blue-800/10 border border-blue-500/50'
                                : 'bg-military-700/30 hover:bg-military-600/30 border border-transparent'
                            }`}
                            onClick={() => { onSwitchMap(map.id); setShowMobileMenu(false); }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden ${
                              isActive ? 'ring-2 ring-blue-500' : ''
                            }`}>
                              <img src={map.imageBase64} alt={map.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isActive ? 'text-blue-300' : 'text-white'}`}>{map.name}</p>
                              <p className="text-xs text-military-500">{mapMarkers.length} 个标记</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                                deleteConfirmId === map.id
                                  ? 'bg-red-600 text-white'
                                  : 'text-military-500 hover:text-red-400'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-military-400 mb-2">地图操作</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { onUploadMap(); setShowMobileMenu(false); }}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">上传地图</span>
                    </button>
                    <button
                      onClick={() => { onOpenGallery(); setShowMobileMenu(false); }}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-military-700/50 hover:bg-military-600/50 text-military-300 rounded-xl transition-all duration-300"
                    >
                      <Images className="w-5 h-5" />
                      <span className="text-xs">图片仓库</span>
                    </button>
                    <button
                      onClick={() => { onExportData(); setShowMobileMenu(false); }}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-military-700/50 hover:bg-military-600/50 text-military-300 rounded-xl transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      <span className="text-xs">导出数据</span>
                    </button>
                    <button
                      onClick={() => { onImportData(); setShowMobileMenu(false); }}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-military-700/50 hover:bg-military-600/50 text-military-300 rounded-xl transition-all duration-300"
                    >
                      <UploadIcon className="w-5 h-5" />
                      <span className="text-xs">导入数据</span>
                    </button>
                    <button
                      onClick={() => { onClearData(); setShowMobileMenu(false); }}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-red-900/50 to-red-800/30 hover:from-red-800/50 hover:to-red-700/30 text-red-400 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-xs">清空数据</span>
                    </button>
                    <button
                      onClick={() => { onClearCache(); setShowMobileMenu(false); }}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-orange-900/50 to-orange-800/30 hover:from-orange-800/50 hover:to-orange-700/30 text-orange-400 rounded-xl transition-all duration-300"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span className="text-xs">清除缓存</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={onHide}
              className="absolute top-[-32px] right-4 p-2 bg-military-800/90 border-t border-x border-military-700/50 rounded-t-xl text-military-400 hover:text-white transition-colors backdrop-blur-lg"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {!show && (
          <button
            onClick={onShow}
            className="fixed bottom-4 right-4 p-3 bg-gradient-to-br from-military-700 to-military-800 border border-military-600/50 rounded-full shadow-xl text-military-400 hover:text-white transition-all duration-300 z-30"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        )}
      </>
    );
  }

  return (
    <div className="w-72 bg-gradient-to-b from-military-800 via-military-800 to-military-900/80 border-r border-military-700/30 flex flex-col backdrop-blur-xl">
      <div className="p-5 border-b border-military-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">三角洲行动</h1>
            <p className="text-xs text-military-500 mt-0.5">MAP MARKER TOOL</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div className="bg-military-900/50 rounded-2xl p-4 border border-military-700/20">
          <label className="block text-sm font-medium text-military-400 mb-3">操作模式</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onModeChange('view')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                mode === 'view'
                  ? 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg shadow-green-500/30'
                  : 'bg-military-700/30 text-military-400 hover:bg-military-600/30'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">观看</span>
            </button>
            <button
              onClick={() => onModeChange('edit')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                mode === 'edit'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-military-700/30 text-military-400 hover:bg-military-600/30'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span className="text-sm font-medium">编辑</span>
            </button>
          </div>
        </div>

        <div className="bg-military-900/50 rounded-2xl p-4 border border-military-700/20">
          <label className="block text-sm font-medium text-military-400 mb-3">地图</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {maps.length === 0 ? (
              <div className="bg-military-900/50 rounded-xl p-4 text-center text-military-500 text-xs">
                暂无地图，点击上传
              </div>
            ) : (
              maps.map(map => {
                const mapMarkers = markers.filter(m => m.mapId === map.id);
                const isActive = map.id === currentMapId;
                return (
                  <div
                    key={map.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-blue-800/10 border border-blue-500/50'
                        : 'bg-military-700/20 hover:bg-military-600/20 border border-transparent'
                    }`}
                    onClick={() => onSwitchMap(map.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden ${
                      isActive ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''
                    }`}>
                      <img src={map.imageBase64} alt={map.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-300' : 'text-white'}`}>{map.name}</p>
                      <p className="text-xs text-military-500">{mapMarkers.length} 个标记</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                      className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        deleteConfirmId === map.id
                          ? 'bg-red-600 text-white'
                          : 'text-military-500 opacity-0 group-hover:opacity-100 hover:text-red-400'
                      }`}
                      title={deleteConfirmId === map.id ? '再次点击确认删除' : '删除地图'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-military-900/50 rounded-2xl p-4 border border-military-700/20">
          <label className="block text-sm font-medium text-military-400 mb-3">地图操作</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onUploadMap}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
              title="上传地图"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">上传地图</span>
            </button>
            <button
              onClick={onOpenGallery}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-military-700/30 hover:bg-military-600/30 text-military-300 rounded-xl transition-all duration-300"
              title="图片仓库"
            >
              <Images className="w-5 h-5" />
              <span className="text-xs font-medium">图片仓库</span>
            </button>
            <button
              onClick={onExportData}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-military-700/30 hover:bg-military-600/30 text-military-300 rounded-xl transition-all duration-300"
              title="导出数据"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs font-medium">导出数据</span>
            </button>
            <button
              onClick={onImportData}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-military-700/30 hover:bg-military-600/30 text-military-300 rounded-xl transition-all duration-300"
              title="导入数据"
            >
              <UploadIcon className="w-5 h-5" />
              <span className="text-xs font-medium">导入数据</span>
            </button>
            <button
              onClick={onClearData}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-red-900/40 to-red-800/20 hover:from-red-800/40 hover:to-red-700/20 text-red-400 rounded-xl transition-all duration-300"
              title="清空数据"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs font-medium">清空数据</span>
            </button>
            <button
              onClick={onClearCache}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-orange-900/40 to-orange-800/20 hover:from-orange-800/40 hover:to-orange-700/20 text-orange-400 rounded-xl transition-all duration-300"
              title="清除缓存"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs font-medium">清除缓存</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-military-700/30 space-y-3">
        {currentMap ? (
          <div className="bg-military-900/50 rounded-xl p-3 border border-military-700/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-military-500">当前地图</span>
              <span className="text-sm text-blue-400 font-medium">{currentMap.name}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-military-500">尺寸</span>
              <span className="text-sm text-white">{currentMap.width} × {currentMap.height}</span>
            </div>
          </div>
        ) : (
          <div className="bg-military-900/50 rounded-xl p-3 text-center text-military-500 text-sm">
            未选择地图
          </div>
        )}

        <div className="bg-military-900/50 rounded-xl p-3 border border-military-700/20">
          <label className="block text-sm font-medium text-military-400 mb-3">标记统计</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-red-600/20 flex items-center justify-center">
                  <Skull className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-xs text-red-400">刷红点位</span>
              </div>
              <span className="text-2xl font-bold text-red-400">{redCount}</span>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs text-blue-400">刷卡点位</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">{cardCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-military-700/30">
        <div className="text-xs text-military-500 text-center space-y-1">
          <p className="tracking-wider">滚轮缩放 | 拖拽平移</p>
          <p>编辑模式下点击地图添加标记</p>
        </div>
      </div>
    </div>
  );
}