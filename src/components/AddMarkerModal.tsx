import { useState, useRef, useEffect } from 'react';
import { Skull, Key, Upload, X, Images, RotateCcw } from 'lucide-react';
import type { Marker, GalleryImage, Skin } from '@/types';

interface AddMarkerModalProps {
  x: number;
  y: number;
  skin: Skin;
  onClose: () => void;
  onSave: (type: 'red' | 'card', name: string, imageBase64: string, description: string, iconImage: string, iconSize: number) => void;
  editMarker?: Marker | null;
  onOpenGallery?: (callback: (image: GalleryImage) => void) => void;
  onOpenIconGallery?: (callback: (image: GalleryImage) => void) => void;
}

export function AddMarkerModal({ x, y, skin, onClose, onSave, editMarker, onOpenGallery, onOpenIconGallery }: AddMarkerModalProps) {
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
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 sm:items-center animate-fade-in-up">
      <div className={`rounded-t-2xl sm:rounded-lg border-t sm:border w-full sm:max-w-md p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto transition-all duration-500 ${
        skin === 'skin2'
          ? 'bg-[#12121a] border-[#1a1a2e]'
          : 'bg-military-800 border-military-600'
      }`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className={`text-lg font-semibold transition-all duration-500 ${
            skin === 'skin2' ? 'text-white skin2-text-glow' : 'text-white'
          }`}>{editMarker ? '编辑标记点位' : '添加标记点位'}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded transition-all duration-300 ${
              skin === 'skin2' ? 'hover:bg-[#1a1a2e]' : 'hover:bg-military-700'
            }`}
          >
            <X className={`w-5 h-5 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>坐标</label>
            <div className={`px-4 py-2 rounded border text-sm transition-all duration-500 ${
              skin === 'skin2' ? 'bg-[#0a0a0f] border-[#1a1a2e] text-[#8888aa]' : 'bg-military-900 border-military-700 text-military-300'
            }`}>
              X: {x.toFixed(2)}% | Y: {y.toFixed(2)}%
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>标记类型</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setType('red')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded border-2 transition-all ${
                  skin === 'skin2' ? 'hover:scale-[1.02]' : ''
                }`}
                style={type === 'red' 
                  ? skin === 'skin2'
                    ? { borderColor: '#ff00ff', backgroundColor: 'rgba(255, 0, 255, 0.2)', color: '#ff00ff', boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)' }
                    : { borderColor: '#ef4444', backgroundColor: 'rgba(153, 27, 27, 0.3)', color: '#f87171' }
                  : skin === 'skin2'
                    ? { borderColor: '#1a1a2e', backgroundColor: '#0a0a0f', color: '#8888aa' }
                    : { borderColor: '#475569', backgroundColor: '#0f172a', color: '#94a3b8' }
                }
              >
                <Skull className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm">刷红点位</span>
              </button>
              <button
                onClick={() => setType('card')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded border-2 transition-all ${
                  skin === 'skin2' ? 'hover:scale-[1.02]' : ''
                }`}
                style={type === 'card'
                  ? skin === 'skin2'
                    ? { borderColor: '#00f5ff', backgroundColor: 'rgba(0, 245, 255, 0.2)', color: '#00f5ff', boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)' }
                    : { borderColor: '#3b82f6', backgroundColor: 'rgba(29, 78, 216, 0.3)', color: '#93c5fd' }
                  : skin === 'skin2'
                    ? { borderColor: '#1a1a2e', backgroundColor: '#0a0a0f', color: '#8888aa' }
                    : { borderColor: '#475569', backgroundColor: '#0f172a', color: '#94a3b8' }
                }
              >
                <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm">刷卡点位</span>
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>点位名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入点位名称..."
              className={`w-full rounded-lg px-4 py-2 text-white focus:outline-none transition-all duration-500 ${
                skin === 'skin2'
                  ? 'bg-[#0a0a0f] border border-[#1a1a2e] focus:border-[#00f5ff] placeholder-[#444466]'
                  : 'bg-military-900 border border-military-700 focus:border-military-500 placeholder-military-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>点位图标</label>
            <div className={`rounded-lg p-3 transition-all duration-500 ${
              skin === 'skin2' ? 'bg-[#0a0a0f] border border-[#1a1a2e]' : 'bg-military-900 border border-military-700'
            }`}>
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full flex items-center justify-center border-2 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    iconImage
                      ? skin === 'skin2' ? 'bg-[#12121a] border-[#00f5ff]' : 'bg-military-900 border-military-400'
                      : type === 'red'
                      ? skin === 'skin2' ? 'bg-[#ff00ff] border-[#ff88ff]' : 'bg-red-600 border-red-400'
                      : skin === 'skin2' ? 'bg-[#00f5ff] border-[#00ffff]' : 'bg-blue-600 border-blue-400'
                  } ${skin === 'skin2' ? 'shadow-[0_0_10px_rgba(0,245,255,0.3)]' : ''}`}
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
                  <div className={`text-xs mb-1 transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
                  }`}>当前图标</div>
                  <div className={`text-xs truncate transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
                  }`}>
                    {iconImage ? '自定义图标' : `系统默认（${type === 'red' ? '骷髅' : '钥匙'}）`}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded transition-all duration-300 text-xs ${
                    skin === 'skin2'
                      ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-[#8888aa]'
                      : 'bg-military-700 hover:bg-military-600 text-military-300'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>上传</span>
                </button>
                {onOpenIconGallery && (
                  <button
                    type="button"
                    onClick={() => onOpenIconGallery((img) => setIconImage(img.imageBase64))}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded transition-all duration-300 text-xs ${
                      skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-[#8888aa]'
                        : 'bg-military-700 hover:bg-military-600 text-military-300'
                    }`}
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>仓库</span>
                  </button>
                )}
                {iconImage && (
                  <button
                    type="button"
                    onClick={handleResetIcon}
                    className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded transition-all duration-300 text-xs ${
                      skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 hover:bg-[#ff00ff]/20 text-[#8888aa] hover:text-[#ff00ff]'
                        : 'bg-military-700 hover:bg-red-900/50 text-military-300 hover:text-red-400'
                    }`}
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
                  <label className={`text-xs transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
                  }`}>图标大小</label>
                  <span className={`text-xs font-mono transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
                  }`}>{iconSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="2"
                  value={iconSize}
                  onChange={(e) => setIconSize(parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-500 ${
                    skin === 'skin2' ? 'accent-[#00f5ff]' : 'accent-blue-500'
                  }`}
                  style={{
                    background: skin === 'skin2'
                      ? `linear-gradient(to right, #00f5ff 0%, #00f5ff ${((iconSize - 20) / 60) * 100}%, #1a1a2e ${((iconSize - 20) / 60) * 100}%, #1a1a2e 100%)`
                      : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((iconSize - 20) / 60) * 100}%, #374151 ${((iconSize - 20) / 60) * 100}%, #374151 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>点位详情图片</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-500 ${
                skin === 'skin2'
                  ? 'border-[#1a1a2e] hover:border-[#00f5ff]'
                  : 'border-military-600 hover:border-military-500'
              }`}
            >
              <Upload className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 transition-all duration-500 ${
                skin === 'skin2' ? 'text-[#444466]' : 'text-military-500'
              }`} />
              {imageBase64 ? (
                <img src={imageBase64} alt="点位图片" className="max-h-24 sm:max-h-32 mx-auto rounded" />
              ) : (
                <span className={`text-sm transition-all duration-500 ${
                  skin === 'skin2' ? 'text-[#444466]' : 'text-military-500'
                }`}>点击上传点位详情图片</span>
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
                className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  skin === 'skin2'
                    ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-[#8888aa]'
                    : 'bg-military-700 hover:bg-military-600 text-military-300'
                }`}
              >
                <Images className="w-4 h-4" />
                <span className="text-sm">从图片仓库选择</span>
              </button>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>描述信息</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入点位描述信息..."
              className={`w-full rounded-lg px-4 py-2 text-white resize-none focus:outline-none transition-all duration-500 ${
                skin === 'skin2'
                  ? 'bg-[#0a0a0f] border border-[#1a1a2e] focus:border-[#00f5ff] placeholder-[#444466]'
                  : 'bg-military-900 border border-military-700 focus:border-military-500 placeholder-military-500'
              }`}
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 ${
              skin === 'skin2'
                ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-white'
                : 'bg-military-700 hover:bg-military-600 text-white'
            }`}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300 ${
              type === 'red'
                ? skin === 'skin2'
                  ? 'bg-gradient-to-r from-[#ff00ff] to-[#aa00aa] hover:from-[#ff22ff] hover:to-[#cc00cc]'
                  : 'bg-red-600 hover:bg-red-500'
                : skin === 'skin2'
                  ? 'bg-gradient-to-r from-[#00f5ff] to-[#0088aa] hover:from-[#00ffff] hover:to-[#00aacc]'
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
