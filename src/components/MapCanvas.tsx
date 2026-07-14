import { useRef, useState, useCallback, useEffect } from 'react';
import type { MapData, Marker, Mode } from '@/types';
import { MarkerPoint } from './MarkerPoint';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MapCanvasProps {
  mapData: MapData | null;
  markers: Marker[];
  mode: Mode;
  onMarkerClick: (marker: Marker) => void;
  onMapClick: (x: number, y: number) => void;
  isMobile?: boolean;
  onTap?: () => void;
}

export function MapCanvas({ mapData, markers, mode, onMarkerClick, onMapClick, isMobile = false, onTap }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [lastTapTime, setLastTapTime] = useState(0);
  const [mapDisplaySize, setMapDisplaySize] = useState({ width: 0, height: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [minScale, setMinScale] = useState(1);

  const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
    if (!containerRef.current || !mapData) return { x, y };
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const mapWidth = mapDisplaySize.width * currentScale;
    const mapHeight = mapDisplaySize.height * currentScale;
    
    const minX = Math.min(0, containerWidth - mapWidth);
    const maxX = Math.max(0, containerWidth - mapWidth);
    const minY = Math.min(0, containerHeight - mapHeight);
    const maxY = Math.max(0, containerHeight - mapHeight);
    
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }, [mapData, mapDisplaySize]);

  const zoomBy = useCallback((factor: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setScale((prevScale) => {
      const newScale = Math.min(Math.max(prevScale * factor, minScale), 5);
      const ratio = newScale / prevScale;
      const newX = centerX - (centerX - position.x) * ratio;
      const newY = centerY - (centerY - position.y) * ratio;
      const clamped = clampPosition(newX, newY, newScale);
      setPosition(clamped);
      return newScale;
    });
  }, [minScale, position, clampPosition]);

  const setZoom = useCallback((newScale: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const clampedScale = Math.min(Math.max(newScale, minScale), 5);
    const ratio = clampedScale / scale;
    const newX = centerX - (centerX - position.x) * ratio;
    const newY = centerY - (centerY - position.y) * ratio;
    const clamped = clampPosition(newX, newY, clampedScale);
    setPosition(clamped);
    setScale(clampedScale);
  }, [minScale, scale, position, clampPosition]);

  const fitMapToContainer = useCallback(() => {
    if (!containerRef.current || !mapData) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const scaleX = containerWidth / mapData.width;
    const scaleY = containerHeight / mapData.height;
    const fitScale = Math.max(scaleX, scaleY);
    
    const mapWidth = mapData.width * fitScale;
    const mapHeight = mapData.height * fitScale;
    
    const offsetX = (containerWidth - mapWidth) / 2;
    const offsetY = (containerHeight - mapHeight) / 2;
    
    setScale(fitScale);
    setMinScale(fitScale);
    setPosition({ x: offsetX, y: offsetY });
    setMapDisplaySize({ width: mapData.width, height: mapData.height });
  }, [mapData]);

  useEffect(() => {
    if (mapData && containerRef.current) {
      fitMapToContainer();
    }
  }, [mapData, fitMapToContainer]);

  useEffect(() => {
    const handleResize = () => {
      if (mapData) {
        fitMapToContainer();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapData, fitMapToContainer]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setScale((prevScale) => {
      const newScale = Math.min(Math.max(prevScale * delta, minScale), 5);
      const ratio = newScale / prevScale;
      const newX = mouseX - (mouseX - position.x) * ratio;
      const newY = mouseY - (mouseY - position.y) * ratio;
      const clamped = clampPosition(newX, newY, newScale);
      setPosition(clamped);
      return newScale;
    });
  }, [minScale, position, clampPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && scale > minScale) {
      setIsDragging(true);
      setHasDragged(false);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragOffset({ x: position.x, y: position.y });
    }
  }, [position, scale, minScale]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setHasDragged(true);
    }
    const newX = dragOffset.x + dx;
    const newY = dragOffset.y + dy;
    const clamped = clampPosition(newX, newY, scale);
    setPosition(clamped);
  }, [isDragging, dragStart, dragOffset, scale, clampPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current || !mapData) return;
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (scale > minScale) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
        setDragOffset({ x: position.x, y: position.y });
      }
      
      const currentTime = Date.now();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 300 && tapLength > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((touch.clientX - rect.left - position.x) / scale / mapDisplaySize.width) * 100;
        const y = ((touch.clientY - rect.top - position.y) / scale / mapDisplaySize.height) * 100;
        
        if (mode === 'edit' && x >= 0 && x <= 100 && y >= 0 && y <= 100) {
          onMapClick(x, y);
        }
        e.preventDefault();
      }
      setLastTapTime(currentTime);
    }
  }, [position, scale, minScale, mode, lastTapTime, onMapClick, mapData, mapDisplaySize]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.x;
      const dy = touch.clientY - dragStart.y;
      const newX = dragOffset.x + dx;
      const newY = dragOffset.y + dy;
      const clamped = clampPosition(newX, newY, scale);
      setPosition(clamped);
    }
  }, [isDragging, dragStart, dragOffset, scale, clampPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!mapData || !containerRef.current || hasDragged) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - position.x) / scale / mapDisplaySize.width) * 100;
    const y = ((e.clientY - rect.top - position.y) / scale / mapDisplaySize.height) * 100;
    
    if (mode === 'edit' && x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      onMapClick(x, y);
    }
  }, [mapData, mode, position, scale, onMapClick, mapDisplaySize, hasDragged]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current && isMobile && onTap) {
      onTap();
    }
  }, [isMobile, onTap]);

  const resetView = useCallback(() => {
    fitMapToContainer();
  }, [fitMapToContainer]);

  if (!mapData) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-military-900 border-2 border-dashed border-military-600 ${isMobile ? 'rounded-none' : 'rounded-lg'}`}>
        <div className="text-center text-military-500 px-4">
          <p className={`${isMobile ? 'text-base' : 'text-lg'}`}>暂无地图</p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>请上传地图图片</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!isMobile && (
        <div className="flex items-center justify-between px-4 py-2 bg-military-800 border-b border-military-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-military-500">缩放: {Math.round(scale * 100)}%</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => zoomBy(0.8)}
                className="px-2 py-1 text-sm bg-military-700 hover:bg-military-600 rounded transition-colors"
              >
                -
              </button>
              <button
                onClick={() => zoomBy(1.25)}
                className="px-2 py-1 text-sm bg-military-700 hover:bg-military-600 rounded transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={resetView}
            className="px-3 py-1 text-sm bg-military-700 hover:bg-military-600 rounded transition-colors"
          >
            重置视图
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden bg-military-900 relative min-h-0 ${scale > minScale ? 'cursor-grab active:cursor-grabbing' : mode === 'edit' ? 'cursor-crosshair' : 'cursor-default'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onClick={handleCanvasClick}
        onClickCapture={handleContainerClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: mapDisplaySize.width || mapData.width,
            height: mapDisplaySize.height || mapData.height,
          }}
        >
          <img
            src={mapData.imageBase64}
            alt={mapData.name}
            className="w-full h-full block select-none pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0">
            {markers.map((marker) => (
              <MarkerPoint
                key={marker.id}
                marker={marker}
                onClick={() => onMarkerClick(marker)}
                isEditMode={mode === 'edit'}
              />
            ))}
          </div>
        </div>
        
        {isMobile && mapData && (
          <div 
            className="absolute top-2 right-2 z-30 flex flex-col items-end gap-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="bg-military-800/95 border border-military-600 rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={(e) => { e.stopPropagation(); zoomBy(0.8); }}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="w-9 h-9 bg-military-700 hover:bg-military-600 border border-military-600 rounded flex items-center justify-center text-military-300 active:scale-95 transition-transform"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-military-300 font-mono min-w-[48px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); zoomBy(1.25); }}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="w-9 h-9 bg-military-700 hover:bg-military-600 border border-military-600 rounded flex items-center justify-center text-military-300 active:scale-95 transition-transform"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetView(); }}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="w-9 h-9 bg-military-700 hover:bg-military-600 border border-military-600 rounded flex items-center justify-center text-military-300 active:scale-95 transition-transform"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="range"
                min={minScale}
                max={5}
                step={0.05}
                value={scale}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full h-2 bg-military-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((scale - minScale) / (5 - minScale)) * 100}%, #374151 ${((scale - minScale) / (5 - minScale)) * 100}%, #374151 100%)`
                }}
              />
            </div>
          </div>
        )}
        
        {mode === 'edit' && (
          <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} bg-military-800/90 text-xs text-military-400 px-3 py-2 rounded border border-military-600 z-30 pointer-events-none`}>
            {isMobile ? (
              <>
                <p>双击添加标记</p>
                <p className="mt-1">单指拖动移动</p>
              </>
            ) : (
              <>
                <p>点击添加标记 | 滚轮缩放</p>
                <p className="mt-1">按住左键拖动移动</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
