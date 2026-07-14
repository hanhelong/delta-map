import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-military-800 border border-military-600 rounded-xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-military-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${danger ? 'bg-red-900/50' : 'bg-military-700'}`}>
              <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-military-300'}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-military-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-military-400" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-military-300 text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-military-700 hover:bg-military-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors text-sm font-medium ${
              danger
                ? 'bg-red-600 hover:bg-red-500'
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
