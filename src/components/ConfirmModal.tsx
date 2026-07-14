import { AlertTriangle, X } from 'lucide-react';
import type { Skin } from '@/types';

interface ConfirmModalProps {
  isOpen: boolean;
  skin: Skin;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  skin,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fade-in-up">
      <div className={`rounded-xl w-full max-w-sm shadow-2xl transition-all duration-500 ${
        skin === 'skin2'
          ? 'bg-[#12121a] border border-[#1a1a2e]'
          : 'bg-military-800 border border-military-600'
      }`}>
        <div className={`flex items-center justify-between p-4 border-b transition-all duration-500 ${
          skin === 'skin2' ? 'border-[#1a1a2e]' : 'border-military-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              danger
                ? skin === 'skin2' ? 'bg-[#ff00ff]/20' : 'bg-red-900/50'
                : skin === 'skin2' ? 'bg-[#1a1a2e]/50' : 'bg-military-700'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                danger
                  ? skin === 'skin2' ? 'text-[#ff00ff]' : 'text-red-400'
                  : skin === 'skin2' ? 'text-[#00f5ff]' : 'text-military-300'
              }`} />
            </div>
            <h3 className={`text-lg font-semibold transition-all duration-500 ${
              skin === 'skin2' ? 'text-white skin2-text-glow' : 'text-white'
            }`}>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              skin === 'skin2' ? 'hover:bg-[#1a1a2e]' : 'hover:bg-military-700'
            }`}
          >
            <X className={`w-5 h-5 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`} />
          </button>
        </div>
        
        <div className="p-4">
          <p className={`text-sm leading-relaxed transition-all duration-500 ${
            skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
          }`}>{message}</p>
        </div>
        
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${
              skin === 'skin2'
                ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-white'
                : 'bg-military-700 hover:bg-military-600 text-white'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all duration-300 text-sm font-medium ${
              danger
                ? skin === 'skin2'
                  ? 'bg-gradient-to-r from-[#ff00ff] to-[#aa00aa] hover:from-[#ff22ff] hover:to-[#cc00cc]'
                  : 'bg-red-600 hover:bg-red-500'
                : skin === 'skin2'
                  ? 'bg-gradient-to-r from-[#00f5ff] to-[#0088aa] hover:from-[#00ffff] hover:to-[#00aacc]'
                  : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
