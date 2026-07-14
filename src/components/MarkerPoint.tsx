import { Skull, Key } from 'lucide-react';
import type { Marker } from '@/types';

interface MarkerPointProps {
  marker: Marker;
  onClick: () => void;
  isEditMode: boolean;
}

export function MarkerPoint({ marker, onClick, isEditMode }: MarkerPointProps) {
  const isRed = marker.type === 'red';
  const iconSize = marker.iconSize ?? 40;

  return (
    <div
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 active:scale-95 ${
        isRed ? 'marker-red' : 'marker-card'
      }`}
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        zIndex: isEditMode ? 20 : 10,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        className={`rounded-full flex items-center justify-center border-2 shadow-lg overflow-hidden ${
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
          <img
            src={marker.iconImage}
            alt="点位图标"
            className="w-full h-full object-cover"
            draggable={false}
          />
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
      <div className="absolute -inset-3 sm:-inset-2" />
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-military-800 text-xs px-2 py-1 rounded border border-military-600 text-white">
        {marker.name || (isRed ? '刷红' : '刷卡')}
      </div>
    </div>
  );
}
