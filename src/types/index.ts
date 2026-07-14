export interface MapData {
  id: string;
  name: string;
  imageBase64: string;
  width: number;
  height: number;
  createdAt: number;
}

export interface Marker {
  id: string;
  mapId: string;
  type: 'red' | 'card';
  name: string;
  x: number;
  y: number;
  imageBase64: string;
  iconImage?: string;
  iconSize?: number;
  description: string;
  createdAt: number;
}

export interface GalleryImage {
  id: string;
  name: string;
  imageBase64: string;
  width: number;
  height: number;
  createdAt: number;
}

export type Mode = 'view' | 'edit';
