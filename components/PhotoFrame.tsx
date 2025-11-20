import React, { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Photo } from '../types';
import { Loader2, Maximize2, X } from 'lucide-react';

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
  const [isResizing, setIsResizing] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Dimensions based on orientation (Polaroid Style)
  const isLandscape = photo.orientation === 'landscape';
  
  // Default dimensions (before scaling)
  const baseWidth = isLandscape ? 320 : 260;
  const baseHeight = isLandscape ? 310 : 380;
  
  // Scale constraints
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2.0;

  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    onFocus(); // Bring to front when resizing starts

    const element = e.currentTarget as HTMLElement;
    // Capture pointer to handle fast movements outside the element
    if (element.setPointerCapture) {
        element.setPointerCapture(e.pointerId);
    }

    // Calculate center of the photo frame for distance-based scaling
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Initial distance from center to pointer
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const startScale = photo.scale;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      const currentDist = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
      
      // Calculate new scale preserving aspect ratio logic (pinch-like feel)
      // ratio: newDistance / oldDistance
      const scaleChange = currentDist / startDist;
      const newScale = Math.min(Math.max(startScale * scaleChange, MIN_SCALE), MAX_SCALE);
      
      onUpdate({ scale: newScale });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      setIsResizing(false);
      if (element.releasePointerCapture) {
          element.releasePointerCapture(upEvent.pointerId);
      }
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
    };

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <motion.div
      drag
      dragControls={controls}
      dragMomentum={false} // No physics, stays where you put it
      onDragStart={() => onFocus()}
      onDragEnd={(_, info) => {
        // Update position based on delta
        onUpdate({ 
          x: photo.x + info.offset.x, 
          y: photo.y + info.offset.y 
        });
      }}
      // Initial animation
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
        // Instant updates for drag/resize, smooth for entry
        x: { duration: 0 }, 
        y: { duration: 0 },
        scale: { duration: isResizing ? 0 : 0.2 },
        opacity: { duration: 0.5 }
      }}
      className="absolute cursor-grab active:cursor-grabbing group"
      style={{
        width: baseWidth,
        height: baseHeight,
        touchAction: 'none' // Important for touch devices
      }}
      ref={frameRef}
      onPointerDown={() => onFocus()} // Bring to front on click
    >
      {/* Shadow Container & White Card */}
      <div className="w-full h-full bg-[#fdfdfd] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.1)] relative flex flex-col p-3 pb-2">
        
        {/* Delete Button - Visible on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
          className="absolute -top-3 -right-3 w-6 h-6 bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-50 shadow-md cursor-pointer"
          title="Remove Photo"
        >
          <X className="w-3 h-3" />
        </button>

        {/* The Image Area - Flex grow to fill available space leaving room for text at bottom */}
        <div className="relative w-full bg-gray-100 overflow-hidden flex-1 border border-black/5">
          <div className="w-full h-full relative grayscale group-hover:grayscale-0 transition-all duration-700">
             <img 
              src={photo.url} 
              alt="Gallery item" 
              className="w-full h-full object-cover filter contrast-110 brightness-95"
              draggable={false}
            />
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none mix-blend-multiply" />
            <div className="absolute inset-0 opacity-10 bg-noise pointer-events-none"></div>
          </div>
        </div>

        {/* The Caption Area (Bottom White Space) */}
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
              onClick={(e) => e.stopPropagation()} // Stop drag when clicking input
              onPointerDown={(e) => e.stopPropagation()} // Stop drag start
            />
          )}
        </div>

        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-white/20 rotate-1 pointer-events-none backdrop-blur-sm border border-white/10 shadow-sm" />

        {/* Resize Handle - Bigger hit area for better UX */}
        <div 
          className="absolute -bottom-5 -right-5 w-14 h-14 flex items-center justify-center cursor-nwse-resize z-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={handleResizeStart}
        >
          <div className="w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm border border-white/20 transition-colors">
             <Maximize2 className="w-4 h-4 text-black/70 drop-shadow-sm" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};