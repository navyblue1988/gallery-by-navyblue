import React from 'react';
import { Photo } from '../types';
import { PhotoFrame } from './PhotoFrame';

interface GalleryWallProps {
  photos: Photo[];
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => void;
  onBringToFront: (id: string) => void;
}

export const GalleryWall: React.FC<GalleryWallProps> = ({ photos, onUpdatePhoto, onBringToFront }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {photos.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 pointer-events-none z-0">
          <p className="typewriter text-xl font-bold tracking-widest opacity-60">EMPTY WALL</p>
          <p className="text-xs mt-2 font-mono tracking-wide opacity-40">Take a photo to begin exhibition</p>
        </div>
      )}
      
      {photos.map((photo) => (
        <PhotoFrame 
          key={photo.id} 
          photo={photo} 
          onUpdate={(updates) => onUpdatePhoto(photo.id, updates)}
          onFocus={() => onBringToFront(photo.id)}
        />
      ))}
    </div>
  );
};