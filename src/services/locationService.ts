import { supabase } from '@/lib/supabase';
import type { DangilPath, Festival, MapLocation } from '@/types/location';

/**
 * Fetch walking paths (dangil_paths) from Supabase
 */
export async function fetchDangilPaths(): Promise<MapLocation[]> {
  const { data, error } = await supabase
    .from('dangil_paths')
    .select('*')
    .limit(50); // Limit to 50 for performance

  if (error) {
    console.error('Error fetching dangil_paths:', error);
    return [];
  }

  return (data as DangilPath[]).map(path => ({
    id: path.id,
    name: path.conts_name || path.name01,
    type: 'path' as const,
    location: {
      lat: path.coord_y,
      lng: path.coord_x,
    },
    description: path.value01 || path.name02 || '',
    address: path.addr_new || path.addr_old || '',
    tel: path.tel,
    imageUrl: path.image_main_url,
    coordinates: path.coord_data?.coordinates || [],
  }));
}

/**
 * Fetch festivals from Supabase
 */
export async function fetchFestivals(): Promise<MapLocation[]> {
  const { data, error } = await supabase
    .from('festivals')
    .select('*')
    .limit(100); // Limit to 100 for performance

  if (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }

  return (data as Festival[]).map(festival => ({
    id: festival.id,
    name: festival.conts_name || festival.name01,
    type: 'festival' as const,
    location: {
      lat: festival.coord_y,
      lng: festival.coord_x,
    },
    description: festival.name02 || festival.value01 || '',
    date: festival.value02 || '',
    address: festival.addr_new || festival.addr_old || '',
    tel: festival.tel,
    imageUrl: festival.image_main_url,
  }));
}

/**
 * Fetch all locations (paths + festivals)
 */
export async function fetchAllLocations(): Promise<MapLocation[]> {
  const [paths, festivals] = await Promise.all([
    fetchDangilPaths(),
    fetchFestivals(),
  ]);

  return [...paths, ...festivals];
}
