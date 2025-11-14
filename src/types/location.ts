// Types for Seoul location data from Supabase

export interface DangilPath {
  id: string;
  conts_id: string;
  conts_name: string;
  theme_name: string;
  name01: string;
  name02: string;
  value01: string;
  value02: string;
  image_main_url: string;
  image_sub_category_url: string;
  tel: string;
  addr_old: string;
  addr_new: string;
  coord_x: number;
  coord_y: number;
  coord_data: {
    type: string;
    coordinates: number[][];
  };
  sub_category_name: string;
  theme_id: string;
  sub_category_id: string;
  created_at: string;
}

export interface Festival {
  id: string;
  conts_id: string;
  conts_name: string;
  theme_name: string;
  name01: string;
  name02: string;
  value01: string;
  value02: string;
  image_main_url: string;
  image_sub_category_url: string;
  tel: string;
  addr_old: string;
  addr_new: string;
  coord_x: number;
  coord_y: number;
  coord_data: {
    type: string;
    coordinates: number[];
  };
  sub_category_name: string;
  theme_id: string;
  sub_category_id: string;
  created_at: string;
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'path' | 'festival';
  location: { lat: number; lng: number };
  description: string;
  date?: string;
  address: string;
  tel?: string;
  imageUrl?: string;
  coordinates?: number[][];
}
