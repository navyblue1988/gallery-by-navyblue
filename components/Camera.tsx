import React, { useRef, useState } from 'react';
import { Camera as CameraIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraProps {
  onPhotoSelect: (file: File) => void;
  isProcessing: boolean;
}

export const Camera: React.FC<CameraProps> = ({ onPhotoSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
      e.target.value = '';
    }
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Printing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }} // Start lower (inside camera)
            animate={{ y: -240, opacity: 1, scale: 1 }} // Move up and out
            exit={{ y: -280, opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute z-0 w-56 h-64 bg-white shadow-2xl pointer-events-none flex flex-col p-3 pb-10 border border-gray-300"
            style={{ bottom: '80px' }} // Anchor tightly behind the camera body
          >
            <div className="w-full h-full bg-black/90 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLASSIC POLAROID DESIGN */}
      <motion.div
        className="relative w-72 h-56 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Main Body (Bottom Half - Sloped) */}
        <div className="absolute bottom-0 w-full h-32 bg-[#e8e8e5] rounded-b-lg shadow-[0_10px_50px_rgba(0,0,0,0.7)] border-b-4 border-[#bfbfbd] z-10">
            {/* Rainbow Stripe */}
            <div className="absolute top-8 left-0 right-0 h-3 bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 opacity-80" />
            
            {/* Eject Slot */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-3 bg-[#333] rounded-full" />
            
            {/* Logo Text */}
            <div className="absolute bottom-4 right-6 text-[10px] font-bold tracking-widest text-gray-400 font-sans lowercase">
                navyblue
            </div>
        </div>

        {/* Top Housing (Black Face) */}
        <div className="absolute top-6 left-4 right-4 h-32 bg-[#1a1a1a] rounded-t-lg z-10 border-t border-gray-700 shadow-inner">
            {/* Viewfinder */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-[#0a0a0a] border border-gray-600 rounded-sm overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-transparent" />
            </div>

            {/* Flash Bar */}
            <div className="absolute top-6 right-6 w-24 h-8 bg-[#2a2a2a] border border-gray-600 grid grid-cols-4 gap-0.5 px-1 items-center">
                <div className="h-6 w-full bg-gray-100/10 rounded-sm" />
                <div className="h-6 w-full bg-gray-100/10 rounded-sm" />
                <div className="h-6 w-full bg-gray-100/10 rounded-sm" />
                <div className="h-6 w-full bg-gray-100/10 rounded-sm" />
            </div>

            {/* Red Shutter Button */}
            <div className="absolute bottom-4 right-6 w-8 h-8 bg-red-600 rounded-full border-2 border-red-800 shadow-lg transform active:scale-90 transition-transform" />
        </div>

        {/* The Lens (Center) */}
        <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-[#111] rounded-full border-[6px] border-[#2a2a2a] z-20 shadow-xl flex items-center justify-center transition-transform duration-700 ${isProcessing ? 'rotate-180' : ''}`}>
             {/* Glass Elements */}
             <div className="w-20 h-20 bg-black rounded-full border-4 border-[#000] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-blue-900/60" />
                
                {/* Reflections */}
                <div className="absolute top-4 left-5 w-6 h-3 bg-white/20 blur-sm rounded-full -rotate-45" />
                <div className="absolute bottom-4 right-5 w-2 h-2 bg-white/40 blur-[1px] rounded-full" />

                <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    {isProcessing ? <Sparkles className="animate-spin w-6 h-6" /> : null}
                </div>
             </div>
        </div>

        {/* Flash Effect Overlay */}
        <AnimatePresence>
            {isProcessing && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.1, delay: 0.1 }}
                    className="fixed inset-0 bg-white z-50 pointer-events-none mix-blend-overlay"
                />
            )}
        </AnimatePresence>

      </motion.div>
      
      <p className="mt-6 text-gray-600 font-mono text-xs tracking-widest lowercase">
        {isProcessing ? "developing..." : "create your memory"}
      </p>
    </div>
  );
};