import { Eye, Edit3, Upload, Map, Download, Upload as UploadIcon, Trash2, Menu, X, ChevronUp, ChevronDown, Images, RefreshCw, Palette, ChevronRight } from 'lucide-react';
import type { MapData, Mode, Marker, MarkerType, Skin } from '@/types';
import { useState } from 'react';

interface ToolbarProps {
  mode: Mode;
  skin: Skin;
  markerTypes: MarkerType[];
  onModeChange: (mode: Mode) => void;
  onSkinChange: (skin: Skin) => void;
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

export function Toolbar({ mode, skin, markerTypes, onModeChange, onSkinChange, onUploadMap, onExportData, onImportData, onOpenGallery, onClearData, onClearCache, maps, currentMapId, onSwitchMap, onDeleteMap, markers, isMobile = false, show = true, onHide, onShow }: ToolbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSkinDropdown, setShowSkinDropdown] = useState(false);
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

  const skin1Label = '经典';
  const skin2Label = '赛博';

  if (isMobile) {
    return (
      <>
        {show && (
          <div className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg transition-all duration-500 ${
            skin === 'skin2' 
              ? 'bg-gradient-to-t from-[#0a0a0f] via-[#12121a] to-[#12121a]/95 border-[#1a1a2e]' 
              : 'bg-gradient-to-t from-military-900 via-military-800 to-military-800/95 border-military-700'
          }`}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  skin === 'skin2' 
                    ? 'bg-gradient-to-br from-[#00f5ff] to-[#0088aa] shadow-lg shadow-[#00f5ff]/30' 
                    : 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/20'
                }`}>
                  <Map className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>三角洲行动</p>
                  <p className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>{currentMap ? currentMap.name : '未选择'} | {markerTypes.map(t => `${markers.filter(m => m.type === t.id).length}${t.name.charAt(0)}`).join(' ')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onModeChange('view')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    mode === 'view'
                      ? skin === 'skin2' 
                        ? 'bg-gradient-to-br from-[#00ff88] to-[#00aa55] text-white shadow-lg shadow-[#00ff88]/30'
                        : 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg shadow-green-500/30'
                      : skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
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
                      ? skin === 'skin2'
                        ? 'bg-gradient-to-br from-[#ffaa00] to-[#ff6600] text-white shadow-lg shadow-[#ffaa00]/30'
                        : 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30'
                      : skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                        : 'bg-military-700/50 text-military-400 hover:bg-military-600/50'
                  }`}
                  title="编辑模式"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => { setShowSkinDropdown(!showSkinDropdown); setShowMobileMenu(false); }}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 text-[#00f5ff] hover:bg-[#1a1a2e] skin2-button-glow'
                        : 'bg-military-700/50 text-military-400 hover:bg-military-600/50'
                    }`}
                    title="切换皮肤"
                  >
                    <Palette className="w-5 h-5" />
                  </button>
                  {showSkinDropdown && (
                    <div className={`absolute bottom-full right-0 mb-2 w-32 rounded-xl overflow-hidden shadow-xl ${
                      skin === 'skin2' ? 'bg-[#12121a] border border-[#1a1a2e]' : 'bg-military-800 border border-military-700'
                    } animate-scale-in`}>
                      <button
                        onClick={() => { onSkinChange('skin1'); setShowSkinDropdown(false); }}
                        className={`w-full px-4 py-3 flex items-center gap-2 transition-all ${
                          skin === 'skin1'
                            ? 'bg-blue-600/20 text-blue-400'
                            : skin === 'skin2' ? 'text-[#8888aa] hover:bg-[#1a1a2e]' : 'text-military-400 hover:bg-military-700'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-700" />
                        <span className="text-sm">{skin1Label}</span>
                      </button>
                      <button
                        onClick={() => { onSkinChange('skin2'); setShowSkinDropdown(false); }}
                        className={`w-full px-4 py-3 flex items-center gap-2 transition-all ${
                          skin === 'skin2'
                            ? 'bg-[#00f5ff]/20 text-[#00f5ff]'
                            : 'text-military-400 hover:bg-military-700'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#ff00ff]" />
                        <span className="text-sm">{skin2Label}</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { setShowMobileMenu(!showMobileMenu); setShowSkinDropdown(false); }}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    skin === 'skin2'
                      ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                      : 'bg-military-700/50 text-military-400 hover:bg-military-600/50'
                  }`}
                  title="更多选项"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {showMobileMenu && (
              <div className="px-4 pb-4 space-y-4 animate-fade-in-up">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>地图</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {maps.length === 0 ? (
                      <div className={`rounded-xl p-4 text-center text-xs ${
                        skin === 'skin2' ? 'bg-[#1a1a2e]/50 text-[#8888aa]' : 'bg-military-900/50 text-military-500'
                      }`}>
                        暂无地图，点击上传
                      </div>
                    ) : (
                      maps.map((map, index) => {
                        const mapMarkers = markers.filter(m => m.mapId === map.id);
                        const isActive = map.id === currentMapId;
                        return (
                          <div
                            key={map.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 animate-slide-in-right ${
                              isActive
                                ? skin === 'skin2'
                                  ? 'bg-gradient-to-r from-[#00f5ff]/30 to-[#0088aa]/10 border border-[#00f5ff]/50'
                                  : 'bg-gradient-to-r from-blue-600/30 to-blue-800/10 border border-blue-500/50'
                                : skin === 'skin2'
                                  ? 'bg-[#1a1a2e]/30 hover:bg-[#1a1a2e]/50 border border-transparent'
                                  : 'bg-military-700/30 hover:bg-military-600/30 border border-transparent'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => { onSwitchMap(map.id); setShowMobileMenu(false); }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden ${
                              isActive ? skin === 'skin2' ? 'ring-2 ring-[#00f5ff]' : 'ring-2 ring-blue-500' : ''
                            }`}>
                              <img src={map.imageBase64} alt={map.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isActive ? (skin === 'skin2' ? 'text-[#00f5ff]' : 'text-blue-300') : 'text-white'}`}>{map.name}</p>
                              <p className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>{mapMarkers.length} 个标记</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                              className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                                deleteConfirmId === map.id
                                  ? 'bg-red-600 text-white'
                                  : skin === 'skin2' ? 'text-[#8888aa] hover:text-red-400' : 'text-military-500 hover:text-red-400'
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
                  <label className={`block text-xs font-medium mb-2 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>地图操作</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { onUploadMap(); setShowMobileMenu(false); }}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                        skin === 'skin2'
                          ? 'bg-gradient-to-br from-[#00f5ff] to-[#0088aa] text-white shadow-lg shadow-[#00f5ff]/30'
                          : 'bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">上传地图</span>
                    </button>
                    <button
                      onClick={() => { onOpenGallery(); setShowMobileMenu(false); }}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                        skin === 'skin2'
                          ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                          : 'bg-military-700/50 hover:bg-military-600/50 text-military-300'
                      }`}
                    >
                      <Images className="w-5 h-5" />
                      <span className="text-xs">图片仓库</span>
                    </button>
                    <button
                      onClick={() => { onExportData(); setShowMobileMenu(false); }}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                        skin === 'skin2'
                          ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                          : 'bg-military-700/50 hover:bg-military-600/50 text-military-300'
                      }`}
                    >
                      <Download className="w-5 h-5" />
                      <span className="text-xs">导出数据</span>
                    </button>
                    <button
                      onClick={() => { onImportData(); setShowMobileMenu(false); }}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                        skin === 'skin2'
                          ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                          : 'bg-military-700/50 hover:bg-military-600/50 text-military-300'
                      }`}
                    >
                      <UploadIcon className="w-5 h-5" />
                      <span className="text-xs">导入数据</span>
                    </button>
                    <button
                      onClick={() => { onClearData(); setShowMobileMenu(false); }}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                        skin === 'skin2'
                          ? 'bg-gradient-to-br from-[#ff00ff]/20 to-[#aa00aa]/10 text-[#ff00ff]'
                          : 'bg-gradient-to-br from-red-900/50 to-red-800/30 hover:from-red-800/50 hover:to-red-700/30 text-red-400'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-xs">清空数据</span>
                    </button>
                    <button
                      onClick={() => { onClearCache(); setShowMobileMenu(false); }}
                      className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                        skin === 'skin2'
                          ? 'bg-gradient-to-br from-[#ffaa00]/20 to-[#ff6600]/10 text-[#ffaa00]'
                          : 'bg-gradient-to-br from-orange-900/50 to-orange-800/30 hover:from-orange-800/50 hover:to-orange-700/30 text-orange-400'
                      }`}
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
              className={`absolute top-[-32px] right-4 p-2 backdrop-blur-lg rounded-t-xl transition-colors ${
                skin === 'skin2'
                  ? 'bg-[#12121a]/90 border-t border-x border-[#1a1a2e] text-[#8888aa] hover:text-white'
                  : 'bg-military-800/90 border-t border-x border-military-700 text-military-400 hover:text-white'
              }`}
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {!show && (
          <button
            onClick={onShow}
            className={`fixed bottom-4 right-4 p-3 rounded-full shadow-xl transition-all duration-300 z-30 ${
              skin === 'skin2'
                ? 'bg-gradient-to-br from-[#12121a] to-[#1a1a2e] border border-[#1a1a2e]/50 text-[#8888aa] hover:text-white'
                : 'bg-gradient-to-br from-military-700 to-military-800 border border-military-600/50 text-military-400 hover:text-white'
            }`}
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        )}
      </>
    );
  }

  return (
    <div className={`w-72 flex flex-col backdrop-blur-xl transition-all duration-500 ${
      skin === 'skin2'
        ? 'bg-gradient-to-b from-[#12121a] via-[#12121a] to-[#0a0a0f]/80 border-r border-[#1a1a2e]/30'
        : 'bg-gradient-to-b from-military-800 via-military-800 to-military-900/80 border-r border-military-700/30'
    }`}>
      <div className={`p-5 border-b transition-all duration-500 ${
        skin === 'skin2' ? 'border-[#1a1a2e]/30' : 'border-military-700/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              skin === 'skin2'
                ? 'bg-gradient-to-br from-[#00f5ff] to-[#0088aa] shadow-xl shadow-[#00f5ff]/30'
                : 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/20'
            }`}>
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-wide ${skin === 'skin2' ? 'text-white skin2-text-glow' : 'text-white'}`}>三角洲行动</h1>
              <p className={`text-xs mt-0.5 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>MAP MARKER TOOL</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSkinDropdown(!showSkinDropdown)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-[#1a1a2e]/50 text-[#00f5ff] hover:bg-[#1a1a2e] skin2-button-glow'
                  : 'bg-military-700/30 text-military-400 hover:bg-military-600/30'
              }`}
              title="切换皮肤"
            >
              <Palette className="w-5 h-5" />
            </button>
            {showSkinDropdown && (
              <div className={`absolute top-full right-0 mt-2 w-32 rounded-xl overflow-hidden shadow-xl ${
                skin === 'skin2' ? 'bg-[#12121a] border border-[#1a1a2e]' : 'bg-military-800 border border-military-700'
              } animate-scale-in`}>
                <button
                  onClick={() => { onSkinChange('skin1'); setShowSkinDropdown(false); }}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all ${
                    skin === 'skin1'
                      ? 'bg-blue-600/20 text-blue-400'
                      : skin === 'skin2' ? 'text-[#8888aa] hover:bg-[#1a1a2e]' : 'text-military-400 hover:bg-military-700'
                  }`}
                >
                  <span className="text-sm">{skin1Label}</span>
                  <ChevronRight className={`w-4 h-4 ${skin === 'skin1' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <button
                  onClick={() => { onSkinChange('skin2'); setShowSkinDropdown(false); }}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all ${
                    skin === 'skin2'
                      ? 'bg-[#00f5ff]/20 text-[#00f5ff]'
                      : 'text-military-400 hover:bg-military-700'
                  }`}
                >
                  <span className="text-sm">{skin2Label}</span>
                  <ChevronRight className={`w-4 h-4 ${skin === 'skin2' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div className={`rounded-2xl p-4 border transition-all duration-500 ${
          skin === 'skin2' ? 'bg-[#1a1a2e]/30 border-[#1a1a2e]/30' : 'bg-military-900/50 border-military-700/20'
        }`}>
          <label className={`block text-sm font-medium mb-3 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>操作模式</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onModeChange('view')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                mode === 'view'
                  ? skin === 'skin2'
                    ? 'bg-gradient-to-br from-[#00ff88] to-[#00aa55] text-white shadow-lg shadow-[#00ff88]/30'
                    : 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg shadow-green-500/30'
                  : skin === 'skin2'
                    ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
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
                  ? skin === 'skin2'
                    ? 'bg-gradient-to-br from-[#ffaa00] to-[#ff6600] text-white shadow-lg shadow-[#ffaa00]/30'
                    : 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30'
                  : skin === 'skin2'
                    ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                    : 'bg-military-700/30 text-military-400 hover:bg-military-600/30'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span className="text-sm font-medium">编辑</span>
            </button>
          </div>
        </div>

        <div className={`rounded-2xl p-4 border transition-all duration-500 ${
          skin === 'skin2' ? 'bg-[#1a1a2e]/30 border-[#1a1a2e]/30' : 'bg-military-900/50 border-military-700/20'
        }`}>
          <label className={`block text-sm font-medium mb-3 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>地图</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {maps.length === 0 ? (
              <div className={`rounded-xl p-4 text-center text-xs ${
                skin === 'skin2' ? 'bg-[#1a1a2e]/50 text-[#8888aa]' : 'bg-military-900/50 text-military-500'
              }`}>
                暂无地图，点击上传
              </div>
            ) : (
              maps.map((map, index) => {
                const mapMarkers = markers.filter(m => m.mapId === map.id);
                const isActive = map.id === currentMapId;
                return (
                  <div
                    key={map.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group animate-slide-in-right ${
                      isActive
                        ? skin === 'skin2'
                          ? 'bg-gradient-to-r from-[#00f5ff]/30 to-[#0088aa]/10 border border-[#00f5ff]/50'
                          : 'bg-gradient-to-r from-blue-600/30 to-blue-800/10 border border-blue-500/50'
                        : skin === 'skin2'
                          ? 'bg-[#1a1a2e]/20 hover:bg-[#1a1a2e]/40 border border-transparent'
                          : 'bg-military-700/20 hover:bg-military-600/20 border border-transparent'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => onSwitchMap(map.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden ${
                      isActive ? skin === 'skin2' ? 'ring-2 ring-[#00f5ff] shadow-lg shadow-[#00f5ff]/20' : 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''
                    }`}>
                      <img src={map.imageBase64} alt={map.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? (skin === 'skin2' ? 'text-[#00f5ff]' : 'text-blue-300') : 'text-white'}`}>{map.name}</p>
                      <p className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>{mapMarkers.length} 个标记</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                      className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        deleteConfirmId === map.id
                          ? 'bg-red-600 text-white'
                          : skin === 'skin2' ? 'text-[#8888aa] opacity-0 group-hover:opacity-100 hover:text-red-400' : 'text-military-500 opacity-0 group-hover:opacity-100 hover:text-red-400'
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

        <div className={`rounded-2xl p-4 border transition-all duration-500 ${
          skin === 'skin2' ? 'bg-[#1a1a2e]/30 border-[#1a1a2e]/30' : 'bg-military-900/50 border-military-700/20'
        }`}>
          <label className={`block text-sm font-medium mb-3 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>地图操作</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onUploadMap}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-gradient-to-br from-[#00f5ff] to-[#0088aa] text-white shadow-lg shadow-[#00f5ff]/30'
                  : 'bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20'
              }`}
              title="上传地图"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">上传地图</span>
            </button>
            <button
              onClick={onOpenGallery}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                  : 'bg-military-700/30 hover:bg-military-600/30 text-military-300'
              }`}
              title="图片仓库"
            >
              <Images className="w-5 h-5" />
              <span className="text-xs font-medium">图片仓库</span>
            </button>
            <button
              onClick={onExportData}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                  : 'bg-military-700/30 hover:bg-military-600/30 text-military-300'
              }`}
              title="导出数据"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs font-medium">导出数据</span>
            </button>
            <button
              onClick={onImportData}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-[#1a1a2e]'
                  : 'bg-military-700/30 hover:bg-military-600/30 text-military-300'
              }`}
              title="导入数据"
            >
              <UploadIcon className="w-5 h-5" />
              <span className="text-xs font-medium">导入数据</span>
            </button>
            <button
              onClick={onClearData}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-gradient-to-br from-[#ff00ff]/20 to-[#aa00aa]/10 text-[#ff00ff]'
                  : 'bg-gradient-to-br from-red-900/40 to-red-800/20 hover:from-red-800/40 hover:to-red-700/20 text-red-400'
              }`}
              title="清空数据"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs font-medium">清空数据</span>
            </button>
            <button
              onClick={onClearCache}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 ${
                skin === 'skin2'
                  ? 'bg-gradient-to-br from-[#ffaa00]/20 to-[#ff6600]/10 text-[#ffaa00]'
                  : 'bg-gradient-to-br from-orange-900/40 to-orange-800/20 hover:from-orange-800/40 hover:to-orange-700/20 text-orange-400'
              }`}
              title="清除缓存"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs font-medium">清除缓存</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`p-4 border-t space-y-3 transition-all duration-500 ${
        skin === 'skin2' ? 'border-[#1a1a2e]/30' : 'border-military-700/30'
      }`}>
        {currentMap ? (
          <div className={`rounded-xl p-3 border transition-all duration-500 ${
            skin === 'skin2' ? 'bg-[#1a1a2e]/30 border-[#1a1a2e]/30' : 'bg-military-900/50 border-military-700/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>当前地图</span>
              <span className={`text-sm font-medium ${skin === 'skin2' ? 'text-[#00f5ff]' : 'text-blue-400'}`}>{currentMap.name}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>尺寸</span>
              <span className="text-sm text-white">{currentMap.width} × {currentMap.height}</span>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl p-3 text-center text-sm ${
            skin === 'skin2' ? 'bg-[#1a1a2e]/30 text-[#8888aa]' : 'bg-military-900/50 text-military-500'
          }`}>
            未选择地图
          </div>
        )}

      </div>

      <div className={`p-4 border-t transition-all duration-500 ${
        skin === 'skin2' ? 'border-[#1a1a2e]/30' : 'border-military-700/30'
      }`}>
        <div className={`text-xs text-center space-y-1 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-500'}`}>
          <p className="tracking-wider">滚轮缩放 | 拖拽平移</p>
          <p>编辑模式下点击地图添加标记</p>
        </div>
      </div>
    </div>
  );
}