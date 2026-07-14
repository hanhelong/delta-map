import { useState, useRef } from 'react';
import { Upload, X, Map } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (name: string, imageBase64: string, width: number, height: number) => void;
}

export function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [name, setName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setImageBase64('');
      setWidth(0);
      setHeight(0);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        const img = new Image();
        img.onload = () => {
          setImageBase64(result);
          setWidth(img.width);
          setHeight(img.height);
          setIsLoading(false);
        };
        img.onerror = () => {
          setIsLoading(false);
          alert('图片加载失败，请选择有效的图片文件');
        };
        img.src = result;
      };
      reader.onerror = () => {
        setIsLoading(false);
        alert('文件读取失败');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (name && imageBase64 && width > 0 && height > 0) {
      onUpload(name, imageBase64, width, height);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 sm:items-center">
      <div className={`bg-military-800 rounded-t-2xl sm:rounded-lg border-t sm:border border-military-600 w-full sm:max-w-md p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-military-700 flex items-center justify-center">
              <Map className="w-5 h-5 text-military-300" />
            </div>
            <h2 className="text-lg font-semibold text-white">上传地图</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-military-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-military-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">地图名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入地图名称..."
              className="w-full bg-military-900 border border-military-700 rounded-lg px-4 py-2 text-white placeholder-military-500 focus:outline-none focus:border-military-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-military-400 mb-2">地图图片</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-military-600 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-military-500 transition-colors"
            >
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-military-500 mx-auto mb-2 sm:mb-3" />
              {isLoading ? (
                <div className="py-4">
                  <div className="w-8 h-8 border-2 border-military-500 border-t-military-300 rounded-full animate-spin mx-auto" />
                  <p className="text-military-400 mt-2 text-sm">加载中...</p>
                </div>
              ) : imageBase64 ? (
                <div>
                  <img src={imageBase64} alt="地图预览" className="max-h-32 sm:max-h-40 mx-auto rounded" />
                  <p className="text-military-400 mt-2 text-sm">
                    {width} × {height} px
                  </p>
                </div>
              ) : (
                <span className="text-military-500">点击选择图片或拖拽上传</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
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
            disabled={!name || !imageBase64 || width === 0 || height === 0 || isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-military-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            上传地图
          </button>
        </div>
      </div>
    </div>
  );
}
