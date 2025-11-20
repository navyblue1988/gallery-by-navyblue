import React, { useRef, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Photo } from '../types';
import { Loader2, Maximize2 } from 'lucide-react';

interface PhotoFrameProps {
  photo: Photo;
  onUpdate: (updates: Partial<Photo>) => void;
  onFocus: () => void;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({ photo, onUpdate, onFocus }) => {
  const controls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Dimensions based on orientation (Polaroid Style)
  const isLandscape = photo.orientation === 'landscape';
  
  // Default dimensions (before scaling)
  const baseWidth = isLandscape ? 320 : 260;
  // Height calculation: 
  // Landscape: 320px width -> ~20px padding sides -> Image width 280. Image height ~220. Text area ~50. Total ~310.
  // Portrait: 260px width -> ~20px padding sides -> Image width 220. Image height ~290. Text area ~50. Total ~380.
  const baseHeight = isLandscape ? 310 : 380;
  
  // Scale constraints
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2.0;

  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    onFocus(); // Bring to front when resizing starts

    const startX = e.clientX;
    const startScale = photo.scale;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Calculate new scale based on horizontal movement relative to base width
      const scaleChange = deltaX / baseWidth;
      const newScale = Math.min(Math.max(startScale + scaleChange, MIN_SCALE), MAX_SCALE);
      
      onUpdate({ scale: newScale });
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
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
      }}
      ref={frameRef}
      onPointerDown={() => onFocus()} // Bring to front on click
    >
      {/* Shadow Container & White Card */}
      <div className="w-full h-full bg-[#fdfdfd] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.1)] relative flex flex-col p-3 pb-2">
        
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
        <div className="w-full h-12 flex items-center justify-center shrink-0">
          {photo.isLoadingCaption ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-3 h-3 animate-spin text-black" />
            </div>
          ) : (
            <p className="typewriter text-black/85 text-[11px] tracking-[0.15em] text-center leading-tight uppercase select-none pt-1">
              {photo.caption}
            </p>
          )}
        </div>

        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-white/20 rotate-1 pointer-events-none backdrop-blur-sm border border-white/10 shadow-sm" />

        {/* Resize Handle - Only visible on hover/drag */}
        <div 
          className="absolute -bottom-4 -right-4 w-8 h-8 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={handleResizeStart}
        >
          <Maximize2 className="w-4 h-4 text-white/70" />
        </div>
      </div>
    </motion.div>
  );
};