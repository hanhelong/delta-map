import { useState } from 'react';
import { Skull, Key, Edit2, Trash2, X, ZoomIn } from 'lucide-react';
import type { Marker } from '@/types';

interface MarkerPopupProps {
  marker: Marker;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}

export function MarkerPopup({ marker, onClose, onEdit, onDelete, isEditMode }: MarkerPopupProps) {
  const isRed = marker.type === 'red';
  const [showImageViewer, setShowImageViewer] = useState(false);
  const iconSize = marker.iconSize ?? 40;

  return (
    <>
    <div 
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 sm:items-center"
      onClick={onClose}
    >
      <div 
        className={`bg-military-800 rounded-t-2xl sm:rounded-lg border-t sm:border border-military-600 w-full sm:max-w-lg p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full flex items-center justify-center border-2 overflow-hidden flex-shrink-0 ${
                marker.iconImage
                  ? 'bg-military-900 border-military-400'
                  : isRed
                  ? 'bg-red-600 border-red-400'
                  : 'bg-blue-600 border-blue-400'
              }`}
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
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {marker.name || (isRed ? '刷红点位' : '刷卡点位')}
              </h2>
              <p className="text-xs sm:text-sm text-military-400">
                {isRed ? '刷红点位' : '刷卡点位'} | 坐标: ({marker.x.toFixed(2)}, {marker.y.toFixed(2)})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {isEditMode && (
              <>
                <button
                  onClick={onEdit}
                  className="p-1.5 sm:p-2 hover:bg-military-700 rounded transition-colors"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-military-400" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 sm:p-2 hover:bg-red-900/50 rounded transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-military-700 rounded transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-military-400" />
            </button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {marker.imageBase64 && (
            <div className="relative group">
              <img
                src={marker.imageBase64}
                alt="点位图片"
                className="w-full h-32 sm:h-48 object-contain bg-military-900 rounded-lg border border-military-700"
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
            <label className="block text-sm font-medium text-military-400 mb-2">描述信息</label>
            <div className="bg-military-900 border border-military-700 rounded-lg px-4 py-2 sm:py-3 text-white text-sm whitespace-pre-wrap">
              {marker.description || '暂无描述'}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-military-500 pt-2 border-t border-military-700">
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
          className="absolute top-4 right-4 p-2 bg-military-800/80 hover:bg-military-700 rounded-full text-white transition-colors z-10"
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
