
export type CameraType = 'polaroid' | 'leica' | 'fuji';

export interface Photo {
  id: string;
  url: string;
  timestamp: number;
  caption?: string;
  isLoadingCaption?: boolean;
  rotation: number; // Random rotation for natural look
  orientation: 'portrait' | 'landscape' | 'square';
  x: number;
  y: number;
  scale: number;
  zIndex: number;
  isLiked?: boolean;
  filterType: CameraType;
}

export interface GemniResponse {
  caption: string;
}
