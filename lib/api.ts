// File: lib/api.ts
import { createClient } from './supabase/server';
// ===============================================
// KUMPULAN INTERFACE (TIPE DATA)
// ===============================================

export interface RegionData {
  province_code?: string | number;
  province_name?: string;
  province_latitude?: number;
  province_longitude?: number;
  city_code?: number;
  city_name?: string;
  sub_district_code?: number;
  sub_district_name?: string;
  village_code?: number;
  village_name?: string;
  village_postal_codes?: string;
  sub_district_latitude?: number;
  sub_district_longitude?: number;
  sub_district_geometry?: string;
}

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  tags: { [key: string]: string };
  nodes?: number[];
  members?: Array<{ type: string; ref: number; role: string }>;
  geometry?: Array<{ lat: number; lon: number }>;
}

export interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
}

// Open‑Meteo simplified interfaces
export interface OpenMeteoCurrent {
  temperature: number;
  windspeed: number;
  winddirection?: number;
  weathercode?: number;
  time: string;
}

export interface CombinedWeatherData {
  current: OpenMeteoCurrent | null;
  daily: Array<{ dt: string; temp_max?: number; temp_min?: number; precipitation?: number }>;
  hourly?: Array<{ 
    timestamp: string; 
    precipitation: number;
    rain?: number;
    temperature?: number;
    apparent_temperature?: number;
    humidity?: number;
    dewpoint?: number;
    windSpeed?: number;
    windDirection?: number;
    windGusts?: number;
    pressure?: number;
    visibility?: number;
    cloudcover?: number;
    weathercode?: number;
  }>;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  uvIndex?: number;
  rain1h?: number;
  dt?: number;
}

export interface FloodAlert {
  id: string;
  regionId: string;
  level: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  timestamp: string;
  isActive: boolean;
  affectedAreas: string[];
  actions: string[];
  estimatedDuration?: number;
  coordinates?: [number, number];
  polygonCoordinates?: [number, number][][];
}

export interface WaterLevelPost {
  id: string;
  name: string;
  lat: number;
  lon: number;
  water_level?: number;
  unit?: string;
  timestamp?: string;
  status?: string;
}

export interface PumpData {
  id: string;
  infrastructure_name: string;
  latitude: number;
  longitude: number;
  building_condition: string;
  hydrological_type: string;
  infrastructure_type?: string;
  province?: string;
  city_regency?: string;
  district?: string;
  village?: string;
  location?: string;
  capacity_liters_per_second?: number;
  pump_status?: any[];
  updated_at?: number;
}

export interface EarthquakeData {
  Date: string;
  Time: string;
  DateTime: string;
  Coordinates: string;
  Latitude: string;
  Longitude: string;
  Magnitude: string;
  Depth: string;
  Region: string;
  Potential: string;
  Felt: string;
  Shakemap: string;
}

export interface DisasterReport {
  _id: string;
  appid: string;
  cat: string;
  detail: {
    en: string;
    id: string;
  };
  event_type: string;
  geom: {
    coordinates: [number, number];
    type: 'Point';
  };
  image?: string;
  source: string;
  status: string;
  timestamp: number;
  url: string;
  severity?: number;
}

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

export interface FetchDisasterReportsArgs {
  hazardType: string;
  timeframe: string;
}

export interface FetchWeatherDataArgs {
  lat?: number;
  lon?: number;
  locationName?: string;
}

export interface GeocodeLocationArgs {
  query: string;
}

export interface DisplayNotificationArgs {
  message: string;
  type?: string;
  duration?: number;
}

// ===============================================
// KUMPULAN FUNGSI API
// ===============================================

export async function getRegionDataServer(
  type: string,
  parentCode?: string | number | null,
): Promise<RegionData[]> {
  const supabase = createClient(); // Initialize the client here
  // Guard: hard-fail if supabase is not available (i.e., called from client)
  if (typeof window !== 'undefined' || !supabase) {
    const errorMessage = `ERROR: getRegionDataServer called from client-side or supabase not initialized. Module: lib/api.ts, Runtime: ${typeof window !== 'undefined' ? 'client' : 'unknown'}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  console.log(
    `getRegionData called with type='${type}' and parentCode='${parentCode}'`,
  );

  if (!type) {
    throw new Error('Missing required parameter: type');
  }

  let tableName: string;
  let selectColumns: string;
  let whereColumn: string | null = null;

  switch (type) {
    case 'provinces':
      tableName = 'provinces';
      selectColumns =
        'province_code, province_name, province_latitude, province_longitude';
      break;
    case 'regencies':
      tableName = 'regencies';
      selectColumns = 'city_code, city_name, city_latitude, city_longitude';
      whereColumn = 'city_province_code';
      break;
    case 'districts':
      tableName = 'districts';
      selectColumns =
        'sub_district_code, sub_district_name, sub_district_latitude, sub_district_longitude, sub_district_geometry';
      whereColumn = 'sub_district_city_code';
      break;
    case 'villages':
      tableName = 'villages';
      selectColumns =
        'village_code, village_name, village_postal_codes, village_latitude, village_longitude, village_geometry';
      whereColumn = 'village_sub_district_code';
      break;
    default:
      throw new Error(`Invalid region type: '${type}'`);
  }

  if (
    (type === 'regencies' || type === 'districts' || type === 'villages') &&
    (parentCode === undefined || parentCode === null || String(parentCode).toLowerCase() === 'undefined')
  ) {
    const errorMessage = `ERROR: Missing parent_code for type: ${type}. Received: ${parentCode}. This function should not be called with undefined/null parentCode for this type.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  let query = supabase.from(tableName).select(selectColumns);

  const sortColumn =
    selectColumns.split(',')[1]?.trim() ||
    selectColumns.split(',')[0]?.trim();
  if (sortColumn) {
    query = query.order(sortColumn, { ascending: true });
  }

  if (whereColumn && parentCode) {
    query = query.eq(whereColumn, parentCode);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data from Supabase:', error.message);
    throw new Error(error.message);
  }

  return (data as RegionData[]) || [];
}


export async function fetchRegionsServer(
  type: 'provinces' | 'regencies' | 'districts' | 'villages' | 'states' | 'counties' | 'cities',
  parentCode?: number | string,
): Promise<RegionData[]> {
  try {
    const data = await getRegionDataServer(type, parentCode);
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchRegionsServer: ${error.message}`);
    throw error;
  }
}