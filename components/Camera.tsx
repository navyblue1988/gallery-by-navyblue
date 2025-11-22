
import React, { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraType } from '../types';

interface CameraProps {
  onPhotoSelect: (file: File) => void;
  isProcessing: boolean;
  previewUrl: string | null;
  cameraType: CameraType;
  onSwitchCamera: (type: CameraType) => void;
}

export const Camera: React.FC<CameraProps> = ({ 
  onPhotoSelect, 
  isProcessing, 
  previewUrl,
  cameraType,
  onSwitchCamera
}) => {
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

  // Define camera body styles
  const renderCameraBody = () => {
    switch (cameraType) {
      case 'leica':
        return (
          <div className="relative w-80 h-52">
             {/* Leica M Body */}
             <div className="absolute bottom-0 w-full h-40 bg-[#1a1a1a] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-b-4 border-black overflow-hidden">
                {/* Leather Texture */}
                <div className="absolute inset-0 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/black-leather.png')] bg-repeat bg-contain" />
             </div>
             
             {/* Top Plate */}
             <div className="absolute top-4 w-full h-16 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-t-2xl border-b border-gray-600/50 z-10 shadow-md">
                 {/* Shutter Dial */}
                 <div className="absolute -top-1 right-20 w-10 h-6 bg-[#ccc] rounded-sm border border-gray-500 transform skew-x-6" />
                 <div className="absolute top-1 right-20 w-10 h-10 bg-gradient-to-tr from-gray-300 to-gray-100 rounded-full border border-gray-400 shadow-sm flex items-center justify-center">
                   <div className="w-8 h-8 border border-dashed border-gray-500 rounded-full opacity-40"></div>
                 </div>
                 
                 {/* Shutter Button */}
                 <div className="absolute top-2 right-8 w-6 h-6 bg-[#d4d4d4] rounded-full border border-gray-400 ring-1 ring-gray-300 shadow-inner active:scale-90 transition-transform cursor-pointer" />
                 
                 {/* Hot shoe */}
                 <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#bbb] rounded-sm border border-gray-400 shadow-inner" />
                 
                 {/* Viewfinder Window */}
                 <div className="absolute top-3 left-6 w-14 h-9 bg-[#050505] border-2 border-gray-400 shadow-[inset_0_0_5px_rgba(0,0,0,0.8)] overflow-hidden">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-blue-900/40 blur-[2px] rounded-full"></div>
                 </div>
                 <div className="absolute top-3 left-24 w-6 h-6 bg-white/80 border border-gray-400 shadow-inner opacity-60"></div>
             </div>

             {/* Red Dot Logo */}
             <div className="absolute top-24 right-8 w-8 h-8 bg-[#D40000] rounded-full border border-[#800000] shadow-lg z-20 flex items-center justify-center">
                 <span className="text-[6px] text-white font-serif italic font-bold leading-none">Leica</span>
             </div>

             {/* Lens */}
             <div className={`absolute top-[45%] left-1/2 transform -translate-x-1/2 w-36 h-36 bg-[#111] rounded-full border-4 border-[#222] z-10 shadow-2xl flex items-center justify-center transition-transform duration-700 ${isProcessing ? 'rotate-[360deg]' : ''}`}>
                 {/* Ring 1 */}
                 <div className="w-32 h-32 bg-[#151515] rounded-full border border-gray-700 flex items-center justify-center">
                     {/* Ring 2 */}
                    <div className="w-24 h-24 bg-[#000] rounded-full border-8 border-[#1a1a1a] relative overflow-hidden shadow-inner">
                         <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent" />
                         <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent" />
                         <div className="absolute top-4 left-4 w-8 h-4 bg-white/10 rounded-full -rotate-45 blur-md" />
                         {isProcessing && <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white/40 animate-spin" />}
                    </div>
                 </div>
                 {/* Lens Text */}
                 <div className="absolute top-2 text-[5px] text-white/50 tracking-widest font-mono uppercase">Summilux-M 1:1.4/50</div>
             </div>
          </div>
        );

      case 'fuji':
        return (
          <div className="relative w-72 h-48">
             {/* Fuji X100 Body - Silver/Black */}
             <div className="absolute bottom-0 w-full h-36 bg-[#222] rounded-b-xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] border-x border-b border-gray-800 overflow-hidden">
                  {/* Texture */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-80" />
             </div>
             
             {/* Top Plate Silver */}
             <div className="absolute top-4 w-full h-14 bg-gradient-to-b from-[#e0e0e0] to-[#c0c0c0] rounded-t-lg border-t border-white/50 z-10 shadow-md flex justify-between px-6">
                 {/* Viewfinder selector */}
                 <div className="absolute top-5 left-20 w-3 h-6 bg-black rounded-sm border border-gray-600" />
             </div>

             {/* Dials - The Fuji signature */}
             <div className="absolute -top-1 right-6 w-10 h-10 bg-gradient-to-b from-[#dcdcdc] to-[#bbb] rounded-full border-2 border-[#999] shadow-md flex items-center justify-center z-20">
                <div className="w-full h-[1px] bg-gray-500 absolute transform rotate-45"></div>
                <div className="w-full h-[1px] bg-gray-500 absolute transform -rotate-45"></div>
             </div>
             <div className="absolute -top-1 right-18 w-8 h-8 bg-gradient-to-b from-[#dcdcdc] to-[#bbb] rounded-full border-2 border-[#999] shadow-md z-20 mr-12" style={{right: '50px'}}></div>
             
             {/* Flash */}
             <div className="absolute top-9 left-1/2 -translate-x-1/2 w-10 h-2 bg-white/80 rounded-sm shadow-[0_0_5px_white]" />

             {/* Lens */}
             <div className={`absolute top-[40%] left-1/2 transform -translate-x-1/2 w-28 h-28 bg-[#1a1a1a] rounded-full border-[6px] border-[#cccccc] z-10 shadow-2xl flex items-center justify-center transition-transform duration-700 ${isProcessing ? 'scale-105' : ''}`}>
                 <div className="w-20 h-20 bg-black rounded-full border-2 border-gray-700 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-transparent" />
                     <div className="absolute top-3 right-5 w-4 h-2 bg-white/30 rounded-full rotate-45 blur-sm" />
                 </div>
             </div>
             
             {/* Grip */}
             <div className="absolute bottom-4 left-2 w-4 h-20 bg-[#151515] rounded-r-lg shadow-lg border-l border-gray-700" />
          </div>
        );

      case 'polaroid':
      default:
        return (
          <motion.div
            className="relative w-72 h-56"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
                <div className="absolute bottom-4 right-6 w-8 h-8 bg-red-600 rounded-full border-2 border-red-800 shadow-lg" />
            </div>

            {/* The Lens (Center) */}
            <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-[#111] rounded-full border-[6px] border-[#2a2a2a] z-20 shadow-xl flex items-center justify-center transition-transform duration-700 ${isProcessing ? 'rotate-180' : ''}`}>
                 {/* Glass Elements */}
                 <div className="w-20 h-20 bg-black rounded-full border-4 border-[#000] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-blue-900/60" />
                    <div className="absolute top-4 left-5 w-6 h-3 bg-white/20 blur-sm rounded-full -rotate-45" />
                    <div className="absolute bottom-4 right-5 w-2 h-2 bg-white/40 blur-[1px] rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center text-white/30">
                        {isProcessing ? <Sparkles className="animate-spin w-6 h-6" /> : null}
                    </div>
                 </div>
            </div>
          </motion.div>
        );
    }
  };

  // Animation offsets based on camera type to make print look like it comes from correct slot
  const getPrintExitStyle = () => {
    switch (cameraType) {
      case 'leica': return { bottom: '10px', width: '240px', height: '260px' }; // Wider print, comes from bottom back? Assuming artificial slot
      case 'fuji': return { bottom: '10px', width: '220px', height: '240px' };
      default: return { bottom: '80px', width: '224px', height: '256px' }; // Polaroid standard
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
            initial={{ y: 100, opacity: 0, scale: 0.95 }} 
            animate={{ y: cameraType === 'polaroid' ? -240 : -200, opacity: 1, scale: 1 }} 
            exit={{ y: -280, opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute z-0 bg-white shadow-2xl pointer-events-none flex flex-col p-3 pb-10 border border-gray-300"
            style={getPrintExitStyle()} 
          >
            {/* Photo Area */}
            <div className="w-full h-full bg-[#1a1a1a] overflow-hidden relative">
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Developing" 
                  className={`w-full h-full object-cover filter ${cameraType === 'leica' ? 'grayscale contrast-125' : 'contrast-110'}`}
                />
              )}
              <motion.div 
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-black pointer-events-none mix-blend-multiply"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLICK AREA FOR CAMERA */}
      <div onClick={handleClick} className="cursor-pointer hover:scale-[1.01] transition-transform duration-200 active:scale-[0.99]">
        {renderCameraBody()}
      </div>
      
      {/* CAMERA SELECTOR */}
      <div className="mt-12 flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
         <button 
            onClick={() => onSwitchCamera('polaroid')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${cameraType === 'polaroid' ? 'bg-white text-black scale-110 shadow-lg' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Polaroid"
         >
            <span className="font-bold text-xs">P</span>
         </button>
         <button 
            onClick={() => onSwitchCamera('leica')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${cameraType === 'leica' ? 'bg-red-600 text-white scale-110 shadow-lg' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Leica"
         >
             <span className="font-serif italic text-xs">L</span>
         </button>
         <button 
            onClick={() => onSwitchCamera('fuji')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${cameraType === 'fuji' ? 'bg-gray-300 text-black scale-110 shadow-lg' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Fujifilm"
         >
             <span className="font-mono font-bold text-xs">F</span>
         </button>
      </div>

      <p className="mt-4 text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
        {isProcessing ? "developing..." : `select ${cameraType}`}
      </p>
    </div>
  );
};
