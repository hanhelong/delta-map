import { useState, useRef, useEffect } from 'react';
import { Skull, Key, Upload, X, Images, RotateCcw } from 'lucide-react';
import type { Marker, GalleryImage } from '@/types';

interface AddMarkerModalProps {
  x: number;
  y: number;
  onClose: () => void;
  onSave: (type: 'red' | 'card', name: string, imageBase64: string, description: string, iconImage: string, iconSize: number) => void;
  editMarker?: Marker | null;
  onOpenGallery?: (callback: (image: GalleryImage) => void) => void;
  onOpenIconGallery?: (callback: (image: GalleryImage) => void) => void;
}

export function AddMarkerModal({ x, y, onClose, onSave, editMarker, onOpenGallery, onOpenIconGallery }: AddMarkerModalProps) {
  const [type, setType] = useState<'red' | 'card'>('red');
  const [name, setName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [iconImage, setIconImage] = useState('');
  const [iconSize, setIconSize] = useState(40);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMarker) {
      setType(editMarker.type);
      setName(editMarker.name);
      setImageBase64(editMarker.imageBase64);
      setIconImage(editMarker.iconImage || '');
      setIconSize(editMarker.iconSize ?? 40);
      setDescription(editMarker.description);
    } else {
      setType('red');
      setName('');
      setImageBase64('');
      setIconImage('');
      setIconSize(40);
      setDescription('');
    }
  }, [editMarker]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setIconImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(type, name, imageBase64, description, iconImage, iconSize);
    onClose();
  };

  const handleResetIcon = () => {
    setIconImage('');
    setIconSize(40);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 sm:items-center">
      <div className={`bg-military-800 rounded-t-2xl sm:rounded-lg border-t sm:border border-military-600 w-full sm:max-w-md p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg font-semibold text-white">{editMarker ? '编辑标记点位' : '添加标记点位'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-military-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-military-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">坐标</label>
            <div className="bg-military-900 px-4 py-2 rounded border border-military-700 text-military-300 text-sm">
              X: {x.toFixed(2)}% | Y: {y.toFixed(2)}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">标记类型</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setType('red')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded border-2 transition-all`}
                style={type === 'red' 
                  ? { borderColor: '#ef4444', backgroundColor: 'rgba(153, 27, 27, 0.3)', color: '#f87171' }
                  : { borderColor: '#475569', backgroundColor: '#0f172a', color: '#94a3b8' }
                }
              >
                <Skull className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm">刷红点位</span>
              </button>
              <button
                onClick={() => setType('card')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded border-2 transition-all`}
                style={type === 'card'
                  ? { borderColor: '#3b82f6', backgroundColor: 'rgba(29, 78, 216, 0.3)', color: '#93c5fd' }
                  : { borderColor: '#475569', backgroundColor: '#0f172a', color: '#94a3b8' }
                }
              >
                <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm">刷卡点位</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">点位名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入点位名称..."
              className="w-full bg-military-900 border border-military-700 rounded-lg px-4 py-2 text-white placeholder-military-500 focus:outline-none focus:border-military-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">点位图标</label>
            <div className="bg-military-900 border border-military-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full flex items-center justify-center border-2 overflow-hidden flex-shrink-0 ${
                    iconImage
                      ? 'bg-military-900 border-military-400'
                      : type === 'red'
                      ? 'bg-red-600 border-red-400'
                      : 'bg-blue-600 border-blue-400'
                  }`}
                  style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                  }}
                >
                  {iconImage ? (
                    <img src={iconImage} alt="图标" className="w-full h-full object-cover" />
                  ) : type === 'red' ? (
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
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-military-400 mb-1">当前图标</div>
                  <div className="text-xs text-military-300 truncate">
                    {iconImage ? '自定义图标' : `系统默认（${type === 'red' ? '骷髅' : '钥匙'}）`}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-military-700 hover:bg-military-600 text-military-300 rounded transition-colors text-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>上传</span>
                </button>
                {onOpenIconGallery && (
                  <button
                    type="button"
                    onClick={() => onOpenIconGallery((img) => setIconImage(img.imageBase64))}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-military-700 hover:bg-military-600 text-military-300 rounded transition-colors text-xs"
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>仓库</span>
                  </button>
                )}
                {iconImage && (
                  <button
                    type="button"
                    onClick={handleResetIcon}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 bg-military-700 hover:bg-red-900/50 text-military-300 hover:text-red-400 rounded transition-colors text-xs"
                    title="恢复默认图标"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                ref={iconInputRef}
                type="file"
                accept="image/*"
                onChange={handleIconFileChange}
                className="hidden"
              />
              
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-military-400">图标大小</label>
                  <span className="text-xs text-military-300 font-mono">{iconSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="2"
                  value={iconSize}
                  onChange={(e) => setIconSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-military-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((iconSize - 20) / 60) * 100}%, #374151 ${((iconSize - 20) / 60) * 100}%, #374151 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">点位详情图片</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-military-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-military-500 transition-colors"
            >
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-military-500 mx-auto mb-2" />
              {imageBase64 ? (
                <img src={imageBase64} alt="点位图片" className="max-h-24 sm:max-h-32 mx-auto rounded" />
              ) : (
                <span className="text-military-500 text-sm">点击上传点位详情图片</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {onOpenGallery && (
              <button
                onClick={() => onOpenGallery((img) => setImageBase64(img.imageBase64))}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-military-700 hover:bg-military-600 text-military-300 rounded-lg transition-colors"
              >
                <Images className="w-4 h-4" />
                <span className="text-sm">从图片仓库选择</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">描述信息</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入点位描述信息..."
              className="w-full bg-military-900 border border-military-700 rounded-lg px-4 py-2 text-white placeholder-military-500 focus:outline-none focus:border-military-500 resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-military-700 hover:bg-military-600 text-white rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
              type === 'red'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {editMarker ? '保存修改' : '添加标记'}
          </button>
        </div>
      </div>
    </div>
  );
}
