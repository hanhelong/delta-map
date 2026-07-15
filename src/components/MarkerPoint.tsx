import { MapPin, icons } from 'lucide-react';
import type { Marker, MarkerType, Skin } from '@/types';

interface MarkerPointProps {
  marker: Marker;
  markerTypes: MarkerType[];
  onClick: () => void;
  isEditMode: boolean;
  skin?: Skin;
}

export function MarkerPoint({ marker, markerTypes, onClick, isEditMode, skin = 'skin1' }: MarkerPointProps) {
  const iconSize = marker.iconSize ?? 40;
  const markerType = markerTypes.find(t => t.id === marker.type);

  const getTypeColor = () => {
    if (markerType) return markerType.color;
    return '#64748b';
  };

  const getTypeGlow = () => {
    if (markerType) return markerType.glowColor;
    return '#8888aa';
  };

  const getTypeName = () => {
    if (markerType) return markerType.name;
    return '未知类型';
  };

  const TypeIcon = () => {
    if (marker.iconImage) return null;
    const iconName = markerType?.icon || 'MapPin';
    const LucideIcon = (icons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
    if (LucideIcon) {
      return <LucideIcon className="text-white" style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }} />;
    }
    return <MapPin className="text-white" style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }} />;
  };

  return (
    <div
      data-marker-point
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 active:scale-95 animate-pulse"
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
        zIndex: isEditMode ? 20 : 10,
        filter: `drop-shadow(0 0 6px ${getTypeGlow()}80)`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        className="rounded-full flex items-center justify-center border-2 shadow-lg overflow-hidden transition-all duration-300"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          backgroundColor: marker.iconImage ? (skin === 'skin2' ? '#12121a' : '#0f172a') : getTypeColor(),
          borderColor: marker.iconImage ? (skin === 'skin2' ? '#00f5ff' : '#64748b') : getTypeColor(),
          boxShadow: skin === 'skin2' ? `0 0 15px ${getTypeGlow()}80` : undefined,
        }}
      >
        {marker.iconImage ? (
          <img
            src={marker.iconImage}
            alt="点位图标"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <TypeIcon />
        )}
      </div>
      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded border text-white text-xs backdrop-blur-xl transition-all duration-300 ${
        skin === 'skin2' 
          ? 'bg-[#12121a]/90 border-[#1a1a2e]' 
          : 'bg-military-800/90 border-military-600'
      }`}>
        {marker.name || getTypeName()}
      </div>
    </div>
  );
}