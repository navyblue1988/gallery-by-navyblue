
import React, { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Photo } from '../types';
import { Loader2, Maximize2, X, RotateCw } from 'lucide-react';

interface PhotoFrameProps {
  photo: Photo;
  onUpdate: (updates: Partial<Photo>) => void;
  onFocus: () => void;
  onDelete: () => void;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({ 
  photo, 
  onUpdate, 
  onFocus, 
  onDelete
}) => {
  const controls = useDragControls();
  const [isInteracting, setIsInteracting] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Dimensions based on orientation (Polaroid Style)
  const isLandscape = photo.orientation === 'landscape';
  const baseWidth = isLandscape ? 320 : 260;
  const baseHeight = isLandscape ? 310 : 380;
  
  // Constraints
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2.5;

  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsInteracting(true);
    onFocus();

    const element = e.currentTarget as HTMLElement;
    element.setPointerCapture(e.pointerId);

    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const startScale = photo.scale;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      const currentDist = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
      const scaleChange = currentDist / startDist;
      const newScale = Math.min(Math.max(startScale * scaleChange, MIN_SCALE), MAX_SCALE);
      onUpdate({ scale: newScale });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      setIsInteracting(false);
      element.releasePointerCapture(upEvent.pointerId);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
    };

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
  };

  const handleRotateStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsInteracting(true);
    onFocus();

    const element = e.currentTarget as HTMLElement;
    element.setPointerCapture(e.pointerId);

    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate initial angle relative to center
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const startRotation = photo.rotation;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      const angleDiff = currentAngle - startAngle;
      const degDiff = angleDiff * (180 / Math.PI);
      
      onUpdate({ rotation: startRotation + degDiff });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      setIsInteracting(false);
      element.releasePointerCapture(upEvent.pointerId);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
    };

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
  };

  const getFilterClass = () => {
    switch (photo.filterType) {
      case 'leica':
        // Classic Leica Monochrom look: High contrast B&W, sharp
        return 'grayscale contrast-[1.25] brightness-95'; 
      case 'fuji':
        // Fujifilm Simulation (Velvia/Classic Chrome): High saturation, punchy
        return 'saturate-[1.3] contrast-110 brightness-105 sepia-[0.05]'; 
      case 'polaroid':
      default:
        // Vintage Instant Film: Warm, faded, slightly soft
        return 'contrast-110 brightness-95 saturate-[0.85] sepia-[0.15]';
    }
  };

  return (
    <motion.div
      drag
      dragControls={controls}
      dragMomentum={false}
      onDragStart={() => onFocus()}
      onDragEnd={(_, info) => {
        onUpdate({ 
          x: photo.x + info.offset.x, 
          y: photo.y + info.offset.y 
        });
      }}
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ 
        opacity: 1, 
        scale: photo.scale,
        x: photo.x, 
        y: photo.y,
        rotate: photo.rotation,
        zIndex: photo.zIndex
      }}
      transition={{ 
        x: { duration: 0 }, 
        y: { duration: 0 },
        rotate: { duration: isInteracting ? 0 : 0.2 }, // Instant when interacting
        scale: { duration: isInteracting ? 0 : 0.2 },
        opacity: { duration: 0.5 }
      }}
      className="absolute cursor-grab active:cursor-grabbing group"
      style={{
        width: baseWidth,
        height: baseHeight,
        touchAction: 'none'
      }}
      ref={frameRef}
      onPointerDown={() => onFocus()}
    >
      {/* Shadow Container & White Card */}
      <div className="w-full h-full bg-[#fdfdfd] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.1)] relative flex flex-col p-3 pb-2">
        
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-3 -right-3 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-50 shadow-md cursor-pointer"
          title="Remove Photo"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Area */}
        <div className="relative w-full bg-gray-100 overflow-hidden flex-1 border border-black/5">
          <div className="w-full h-full relative transition-all duration-700">
             <img 
              src={photo.url} 
              alt="Gallery item" 
              className={`w-full h-full object-cover ${getFilterClass()}`}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
            {photo.filterType === 'polaroid' && (
              <div className="absolute inset-0 opacity-10 bg-noise pointer-events-none"></div>
            )}
             {photo.filterType === 'leica' && (
              <div className="absolute inset-0 opacity-20 bg-noise pointer-events-none mix-blend-overlay"></div>
            )}
          </div>
        </div>

        {/* Caption Area */}
        <div className="w-full h-12 flex items-center justify-center shrink-0 relative">
          {photo.isLoadingCaption ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-3 h-3 animate-spin text-black" />
            </div>
          ) : (
            <input 
              type="text"
              value={photo.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              className="typewriter w-full bg-transparent text-black/85 text-[11px] tracking-[0.15em] text-center leading-tight uppercase focus:outline-none focus:bg-gray-50 placeholder-gray-300 pt-1 px-2"
              placeholder="TYPE CAPTION..."
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
          )}
        </div>

        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-white/20 rotate-1 pointer-events-none backdrop-blur-sm border border-white/10 shadow-sm" />

        {/* === CONTROLS === */}
        
        {/* Rotate Handle (Bottom Left) */}
        <div 
          className="absolute -bottom-6 -left-6 w-16 h-16 flex items-center justify-center cursor-ew-resize z-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={handleRotateStart}
          title="Rotate"
        >
          <div className="w-9 h-9 bg-white/90 hover:bg-white text-black/80 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg border border-black/10 transition-transform hover:scale-110">
             <RotateCw className="w-4 h-4" />
          </div>
        </div>

        {/* Resize Handle (Bottom Right) */}
        <div 
          className="absolute -bottom-6 -right-6 w-16 h-16 flex items-center justify-center cursor-nwse-resize z-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={handleResizeStart}
          title="Resize"
        >
          <div className="w-9 h-9 bg-white/90 hover:bg-white text-black/80 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg border border-black/10 transition-transform hover:scale-110">
             <Maximize2 className="w-4 h-4" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};
