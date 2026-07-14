import { useState } from 'react';
import { Skull, Key, Edit2, Trash2, X, ZoomIn } from 'lucide-react';
import type { Marker, Skin } from '@/types';

interface MarkerPopupProps {
  marker: Marker;
  skin: Skin;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}

export function MarkerPopup({ marker, skin, onClose, onEdit, onDelete, isEditMode }: MarkerPopupProps) {
  const isRed = marker.type === 'red';
  const [showImageViewer, setShowImageViewer] = useState(false);
  const iconSize = marker.iconSize ?? 40;

  return (
    <>
    <div 
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 sm:items-center animate-fade-in-up"
      onClick={onClose}
    >
      <div 
        className={`rounded-t-2xl sm:rounded-lg border-t sm:border w-full sm:max-w-lg p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto transition-all duration-500 ${
          skin === 'skin2'
            ? 'bg-[#12121a] border-[#1a1a2e]'
            : 'bg-military-800 border-military-600'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full flex items-center justify-center border-2 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                marker.iconImage
                  ? skin === 'skin2' ? 'bg-[#12121a] border-[#00f5ff]' : 'bg-military-900 border-military-400'
                  : isRed
                  ? skin === 'skin2' ? 'bg-[#ff00ff] border-[#ff88ff]' : 'bg-red-600 border-red-400'
                  : skin === 'skin2' ? 'bg-[#00f5ff] border-[#00ffff]' : 'bg-blue-600 border-blue-400'
              } ${skin === 'skin2' ? 'shadow-[0_0_15px_rgba(0,245,255,0.5)]' : ''}`}
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
              }}
            >
              {marker.iconImage ? (
                <img src={marker.iconImage} alt="图标" className="w-full h-full object-cover" />
              ) : isRed ? (
                <Skull
                  className="text-white"
                  style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }}
                />
              ) : (
                <Key
                  className="text-white"
                  style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }}
                />
              )}
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-semibold transition-all duration-500 ${
                skin === 'skin2' ? 'text-white skin2-text-glow' : 'text-white'
              }`}>
                {marker.name || (isRed ? '刷红点位' : '刷卡点位')}
              </h2>
              <p className={`text-xs sm:text-sm transition-all duration-500 ${
                skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
              }`}>
                {isRed ? '刷红点位' : '刷卡点位'} | 坐标: ({marker.x.toFixed(2)}, {marker.y.toFixed(2)})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {isEditMode && (
              <>
                <button
                  onClick={onEdit}
                  className={`p-1.5 sm:p-2 rounded transition-all duration-300 ${
                    skin === 'skin2' ? 'hover:bg-[#1a1a2e]' : 'hover:bg-military-700'
                  }`}
                  title="编辑"
                >
                  <Edit2 className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#00f5ff]' : 'text-military-400'
                  }`} />
                </button>
                <button
                  onClick={onDelete}
                  className={`p-1.5 sm:p-2 rounded transition-all duration-300 ${
                    skin === 'skin2' ? 'hover:bg-[#ff00ff]/20' : 'hover:bg-red-900/50'
                  }`}
                  title="删除"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className={`p-1.5 sm:p-2 rounded transition-all duration-300 ${
                skin === 'skin2' ? 'hover:bg-[#1a1a2e]' : 'hover:bg-military-700'
              }`}
            >
              <X className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 ${
                skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
              }`} />
            </button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {marker.imageBase64 && (
            <div className="relative group">
              <img
                src={marker.imageBase64}
                alt="点位图片"
                className={`w-full h-32 sm:h-48 object-contain rounded-lg border transition-all duration-500 ${
                  skin === 'skin2' ? 'bg-[#0a0a0f] border-[#1a1a2e]' : 'bg-military-900 border-military-700'
                }`}
              />
              <button
                onClick={() => setShowImageViewer(true)}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="放大查看"
              >
                <ZoomIn className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>描述信息</label>
            <div className={`rounded-lg px-4 py-2 sm:py-3 text-white text-sm whitespace-pre-wrap transition-all duration-500 ${
              skin === 'skin2' ? 'bg-[#0a0a0f] border border-[#1a1a2e]' : 'bg-military-900 border border-military-700'
            }`}>
              {marker.description || '暂无描述'}
            </div>
          </div>

          <div className={`flex items-center justify-between text-xs pt-2 border-t transition-all duration-500 ${
            skin === 'skin2' ? 'text-[#444466] border-[#1a1a2e]' : 'text-military-500 border-military-700'
          }`}>
            <span>创建时间: {new Date(marker.createdAt).toLocaleString()}</span>
            <span>ID: {marker.id.slice(0, 8)}</span>
          </div>
        </div>
      </div>
    </div>
    
    {showImageViewer && (
      <div 
        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
        onClick={() => setShowImageViewer(false)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setShowImageViewer(false); }}
          className={`absolute top-4 right-4 p-2 rounded-full text-white transition-all duration-300 z-10 ${
            skin === 'skin2' ? 'bg-[#12121a]/80 hover:bg-[#1a1a2e]' : 'bg-military-800/80 hover:bg-military-700'
          }`}
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={marker.imageBase64}
          alt="点位图片"
          className="max-w-full max-h-full object-contain p-4"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
    </>
  );
}
