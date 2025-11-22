
import React, { useState, useEffect } from 'react';
import { Camera } from './components/Camera';
import { GalleryWall } from './components/GalleryWall';
import { Photo } from './types';
import { fileToGenerativePart, generateImageCaption } from './services/gemini';
import { playPolaroidSound } from './utils/audio';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(100);

  // Load photos from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('navyblue-gallery');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old photos to have x, y, scale, zIndex if they don't
      const migrated = parsed.map((p: any) => ({
        ...p,
        x: p.x ?? Math.random() * (window.innerWidth - 300),
        y: p.y ?? Math.random() * (window.innerHeight - 400),
        scale: p.scale ?? 1,
        zIndex: p.zIndex ?? 1,
        isLiked: p.isLiked ?? false
      }));
      setPhotos(migrated);
      
      // Set initial zIndex counter based on loaded photos
      const maxZ = Math.max(...migrated.map((p: Photo) => p.zIndex || 0), 100);
      setHighestZIndex(maxZ + 1);
    }
  }, []);

  // Save photos when updated
  useEffect(() => {
    localStorage.setItem('navyblue-gallery', JSON.stringify(photos));
  }, [photos]);

  const getImageOrientation = (url: string): Promise<'portrait' | 'landscape' | 'square'> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > img.height * 1.1) resolve('landscape');
        else if (img.height > img.width * 1.1) resolve('portrait');
        else resolve('square');
      };
      img.src = url;
    });
  };

  const handlePhotoSelect = async (file: File) => {
    // 1. Play Sound immediately
    playPolaroidSound();

    // 2. Show in camera immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setIsProcessing(true);

    try {
      // 3. Start background tasks
      const orientationPromise = getImageOrientation(objectUrl);
      const base64Promise = fileToGenerativePart(file);
      
      // 4. Wait for the camera "printing" animation (2.2s)
      // This ensures the photo doesn't appear on the wall until it ejects from the camera
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      // 5. Prepare Photo Data
      const orientation = await orientationPromise;
      const base64Data = await base64Promise;

      // Calculate random initial position (centered-ish)
      const initialX = (window.innerWidth / 2) - 150 + (Math.random() * 100 - 50);
      const initialY = (window.innerHeight / 2) - 200 + (Math.random() * 100 - 50);
      const newZIndex = highestZIndex + 1;
      setHighestZIndex(newZIndex);

      const newPhoto: Photo = {
        id: generateId(),
        url: objectUrl,
        timestamp: Date.now(),
        isLoadingCaption: true,
        rotation: (Math.random() * 6) - 3, // Slight organic tilt
        orientation: orientation,
        x: initialX,
        y: initialY,
        scale: 1,
        zIndex: newZIndex,
        isLiked: false
      };

      // 6. Add to Gallery Wall (Visual handoff)
      setPhotos(prev => [...prev, newPhoto]);
      
      // Stop camera animation (it will fade out)
      setIsProcessing(false);

      // 7. Fetch Caption (in background after photo is placed)
      try {
        const caption = await generateImageCaption(base64Data);
        
        setPhotos(prev => prev.map(p => 
          p.id === newPhoto.id 
            ? { ...p, caption: caption.toLowerCase(), isLoadingCaption: false }
            : p
        ));
      } catch (captionError) {
        console.warn("Caption generation failed", captionError);
        setPhotos(prev => prev.map(p => 
          p.id === newPhoto.id 
            ? { ...p, caption: "untitled", isLoadingCaption: false }
            : p
        ));
      }

    } catch (error) {
      console.error("Failed to process photo", error);
      setIsProcessing(false);
    }
  };

  const updatePhoto = (id: string, updates: Partial<Photo>) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const bringToFront = (id: string) => {
    const newZ = highestZIndex + 1;
    setHighestZIndex(newZ);
    updatePhoto(id, { zIndex: newZ });
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Header - Handwritten Retro */}
      <header className="absolute top-0 left-0 w-full p-8 z-40 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="handwriting text-5xl font-bold tracking-tight text-white/90 mix-blend-difference shadow-black drop-shadow-lg">
            gallery by navyblue
          </h1>
          <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mt-2">
            Est 2025 Saturn
          </div>
        </div>
      </header>

      {/* Main Gallery Area - Full Screen Canvas */}
      <main className="absolute inset-0 z-10">
        <GalleryWall 
          photos={photos} 
          onUpdatePhoto={updatePhoto}
          onBringToFront={bringToFront}
          onDeletePhoto={deletePhoto}
        />
      </main>

      {/* Bottom Camera Control Area */}
      <footer className="fixed bottom-0 left-0 w-full h-auto z-50 pointer-events-none flex flex-col justify-end pb-8">
         {/* Subtle gradient to fade out bottom photos behind controls */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent h-48 mt-auto top-auto bottom-0 pointer-events-none"></div>
         
         <div className="pointer-events-auto w-full flex justify-center pb-4 scale-90 md:scale-100 origin-bottom">
            <Camera 
              onPhotoSelect={handlePhotoSelect} 
              isProcessing={isProcessing} 
              previewUrl={previewImage}
            />
         </div>
      </footer>
    </div>
  );
};

export default App;
