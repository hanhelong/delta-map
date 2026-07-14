import { X, Upload, Trash2, Images, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import type { GalleryImage, Skin } from '@/types';

interface ImageGalleryProps {
  images: GalleryImage[];
  skin: Skin;
  onClose: () => void;
  onUpload: (name: string, imageBase64: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
  onSelect?: (image: GalleryImage) => void;
  selectMode?: boolean;
}

export function ImageGallery({ images, skin, onClose, onUpload, onDelete, onSelect, selectMode = false }: ImageGalleryProps) {
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const imageBase64 = event.target?.result as string;
        const name = file.name.replace(/\.[^/.]+$/, '');
        onUpload(name, imageBase64, img.width, img.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDelete(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fade-in-up">
      <div className={`rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col transition-all duration-500 ${
        skin === 'skin2'
          ? 'bg-[#12121a] border border-[#1a1a2e]'
          : 'bg-military-800 border border-military-700'
      }`}>
        <div className={`flex items-center justify-between p-4 border-b transition-all duration-500 ${
          skin === 'skin2' ? 'border-[#1a1a2e]' : 'border-military-700'
        }`}>
          <div className="flex items-center gap-3">
            <Images className={`w-6 h-6 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#00f5ff]' : 'text-blue-400'
            }`} />
            <h2 className={`text-lg font-bold transition-all duration-500 ${
              skin === 'skin2' ? 'text-white skin2-text-glow' : 'text-white'
            }`}>图片仓库</h2>
            <span className={`text-sm transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>{images.length} 张</span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 ${
              skin === 'skin2'
                ? 'hover:bg-[#1a1a2e] text-[#8888aa] hover:text-white'
                : 'hover:bg-military-700 text-military-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-4 border-b transition-all duration-500 ${
          skin === 'skin2' ? 'border-[#1a1a2e]' : 'border-military-700'
        }`}>
          <label className={`flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg cursor-pointer transition-all duration-300 ${
            skin === 'skin2'
              ? 'bg-gradient-to-r from-[#00f5ff] to-[#0088aa] hover:from-[#00ffff] hover:to-[#00aacc]'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}>
            <Upload className="w-5 h-5" />
            <span>上传图片到仓库</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          {selectMode && (
            <p className={`text-xs mt-2 text-center transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>
              点击图片可选择使用
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {images.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-16 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#444466]' : 'text-military-500'
            }`}>
              <Images className="w-16 h-16 mb-4 opacity-50" />
              <p>图片仓库为空</p>
              <p className="text-sm mt-1">上传图片后会自动保存到这里</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative group rounded-lg overflow-hidden border transition-all ${
                    selectMode
                      ? skin === 'skin2'
                        ? 'border-[#1a1a2e] hover:border-[#00f5ff] cursor-pointer hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                        : 'border-military-600 hover:border-blue-500 cursor-pointer'
                      : skin === 'skin2'
                        ? 'border-[#1a1a2e]'
                        : 'border-military-700'
                  }`}
                  onClick={() => {
                    if (selectMode && onSelect) {
                      onSelect(img);
                    } else {
                      setPreviewImage(img);
                    }
                  }}
                >
                  <div className={`aspect-square ${skin === 'skin2' ? 'bg-[#0a0a0f]' : 'bg-military-900'}`}>
                    <img
                      src={img.imageBase64}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs text-white truncate">{img.name}</p>
                  </div>
                  {!selectMode && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(img);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img.id);
                        }}
                        className={`absolute top-2 left-2 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                          deleteConfirmId === img.id
                            ? skin === 'skin2' ? 'bg-[#ff00ff] text-white' : 'bg-red-600 text-white'
                            : 'bg-black/50 text-white hover:bg-red-600'
                        }`}
                        title={deleteConfirmId === img.id ? '再次点击确认删除' : '删除图片'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
              skin === 'skin2'
                ? 'bg-[#12121a]/80 hover:bg-[#1a1a2e] text-white/70 hover:text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={previewImage.imageBase64}
            alt={previewImage.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
