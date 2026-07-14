import { Skull, Key } from 'lucide-react';
import type { Marker, Skin } from '@/types';

interface MarkerPointProps {
  marker: Marker;
  onClick: () => void;
  isEditMode: boolean;
  skin?: Skin;
}

export function MarkerPoint({ marker, onClick, isEditMode, skin = 'skin1' }: MarkerPointProps) {
  const isRed = marker.type === 'red';
  const iconSize = marker.iconSize ?? 40;

  return (
    <div
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 active:scale-95 animate-pulse ${
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
        className={`rounded-full flex items-center justify-center border-2 shadow-lg overflow-hidden transition-all duration-300 ${
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
      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded border text-white text-xs backdrop-blur-xl transition-all duration-300 ${
        skin === 'skin2' 
          ? 'bg-[#12121a]/90 border-[#1a1a2e]' 
          : 'bg-military-800/90 border-military-600'
      }`}>
        {marker.name || (isRed ? '刷红' : '刷卡')}
      </div>
    </div>
  );
}