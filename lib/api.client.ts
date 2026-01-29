// File: lib/api.client.ts
import { safeFetch, UserFriendlyError } from './error-utils';
import { getBaseUrl } from './utils';
import {
  RegionData,
  OverpassResponse,
  WeatherData,
  WaterLevelPost,
  PumpData,
  EarthquakeData,
  DisasterReport,
  NominatimResult,
  FetchDisasterReportsArgs,
  FetchWeatherDataArgs,
  GeocodeLocationArgs,
  DisplayNotificationArgs,
  CombinedWeatherData,
} from './api'; // Import necessary types from lib/api.ts



export async function fetchRegionsClient(
  type: 'provinces' | 'regencies' | 'districts' | 'villages' | 'states' | 'counties' | 'cities',
  parentCode?: number | string,
): Promise<RegionData[]> {
  const baseUrl = getBaseUrl();
  const apiUrl = `${baseUrl}/api/regions?type=${type}${parentCode ? `&parentCode=${parentCode}` : ''}`;

  try {
    const data: RegionData[] = await safeFetch(apiUrl, undefined, 'Failed to fetch region data. Please try again.');
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchRegionsClient: ${error.message}`);
    throw error;
  }
}

// Small mapping helpers to convert Open‑Meteo weathercode to friendly description/icon.
function mapWeatherCodeToDescription(code: number | undefined): string {
  const mapping: { [k: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Rain showers',
    95: 'Thunderstorm',
  };
  return mapping[Number(code)] || 'Unknown';
}

function mapWeatherCodeToIcon(code: number | undefined): string {
  // Return a simple icon name used by UI mapping; keep generic if unknown.
  const mapping: { [k: number]: string } = {
    0: 'sun',
    1: 'sun',
    2: 'cloud-sun',
    3: 'cloud',
    45: 'cloud-fog',
    48: 'cloud-fog',
    51: 'cloud-drizzle',
    53: 'cloud-drizzle',
    55: 'cloud-drizzle',
    61: 'cloud-rain',
    63: 'cloud-rain',
    65: 'cloud-heavy-rain',
    80: 'cloud-showers',
    95: 'cloud-lightning',
  };
  return mapping[Number(code)] || 'cloud';
}

export async function fetchDisasterProneData(
  south: number,
  west: number,
  north: number,
  east: number,
): Promise<OverpassResponse> {
  const query = `
[out:json][timeout:25];
(
  node[\"flood_prone\"=\"yes\"](${south},${west},${north},${east});
  way[\"flood_prone\"=\"yes\"](${south},${west},${north},${east});
  relation[\"flood_prone\"=\"yes\"](${south},${west},${north},${east});
  node[\"hazard\"=\"flood\"](${south},${west},${north},${east});
  way[\"hazard\"=\"flood\"](${south},${west},${north},${east});
  relation[\"hazard\"=\"flood\"](${south},${west},${north},${east});
  node[\"natural\"=\"landslide\"](${south},${west},${north},${east});
  way[\"natural\"=\"landslide\"](${south},${west},${north},${east});
  relation[\"natural\"=\"landslide\"](${south},${west},${north},${east});
  node[\"hazard\"=\"landslide\"](${south},${west},${north},${east});
  way[\"hazard\"=\"landslide\"](${south},${west},${north},${east});
  relation[\"hazard\"=\"landslide\"](${south},${west},${north},${east});
  node[\"waterway\"~\"^(river|stream|canal|drain|ditch)$\"](${south},${west},${north},${east});
  way[\"waterway\"~\"^(river|stream|canal|drain|ditch)$\"](${south},${west},${north},${east});
  relation[\"waterway\"~\"^(river|stream|canal|drain|ditch)$\"](${south},${west},${north},${east});
  node[\"natural\"=\"water\"](${south},${west},${north},${east});
  way[\"natural\"=\"water\"](${south},${west},${north},${east});
  relation[\"natural\"=\"water\"](${south},${west},${north},${east});
  node[\"man_made\"=\"dyke\"](${south},${west},${north},${east});
  way[\"man_made\"=\"dyke\"](${south},${west},${north},${east});
  relation[\"man_made\"=\"dyke\"](${south},${west},${north},${east});
  node[\"landuse\"=\"basin\"](${south},${west},${north},${east});
  way[\"landuse\"=\"basin\"](${south},${west},${north},${east});
  relation[\"landuse\"=\"basin\"](${south},${west},${north},${east});
  node[\"natural\"=\"wetland\"](${south},${west},${north},${east});
  way[\"natural\"=\"wetland\"](${south},${west},${north},${east});
  relation[\"natural\"=\"wetland\"](${south},${west},${north},${east});
);
out body geom;
`.trim();

  console.log('Overpass API Query:', query);

  try {
    const data: OverpassResponse = await safeFetch(
      'https://overpass-api.de/api/interpreter',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        next: { revalidate: 3600 }, // Revalidate every 1 hour
      },
      'Failed to fetch disaster-prone area data. Please try again.'
    );
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchDisasterProneData: ${error.message}`);
    throw error;
  }
}

export async function fetchWeatherData(
  lat: number,
  lon: number,
  apiKey?: string,
): Promise<WeatherData> {
  // Use Open‑Meteo hourly endpoint with comprehensive weather variables
  // Temperature: Fahrenheit, Wind: mph, Precipitation: inch, Timezone: America/Chicago, Time: ISO 8601
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,windspeed_10m,winddirection_10m,windgusts_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=iso8601&timezone=America%2FChicago`;
  try {
    const raw: any = await safeFetch(url, undefined, 'Failed to fetch weather data. Please try again.');
    // Get the most recent hourly data (index 0 is current hour)
    const hourly = raw?.hourly || {};
    const idx = 0; // Current hour
    
    const mapped: WeatherData = {
      temperature: Number(hourly.temperature_2m?.[idx] ?? 0),
      feelsLike: Number(hourly.apparent_temperature?.[idx] ?? hourly.temperature_2m?.[idx] ?? 0),
      humidity: Number(hourly.relativehumidity_2m?.[idx] ?? 0),
      pressure: Number(hourly.pressure_msl?.[idx] ?? hourly.surface_pressure?.[idx] ?? 0),
      windSpeed: Number(hourly.windspeed_10m?.[idx] ?? 0),
      description: mapWeatherCodeToDescription(hourly.weathercode?.[idx]),
      icon: mapWeatherCodeToIcon(hourly.weathercode?.[idx]),
      uvIndex: undefined,
      rain1h: Number(hourly.rain?.[idx] ?? 0),
      dt: hourly.time?.[idx] ? new Date(hourly.time[idx]).getTime() / 1000 : undefined,
    };
    return mapped;
  } catch (error: any) {
    console.error(`API Error in fetchWeatherData: ${error.message}`);
    throw error;
  }
}

// Fetch CombinedWeatherData from the server-side adapter (/api/weather)
export async function fetchWeatherFromServer(lat: number, lon: number): Promise<CombinedWeatherData> {
  const baseUrl = getBaseUrl();
  const apiUrl = `${baseUrl}/api/weather?lat=${lat}&lon=${lon}`;
  try {
    const data: CombinedWeatherData = await safeFetch(apiUrl, undefined, 'Failed to fetch weather data from server.');
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchWeatherFromServer: ${error.message}`);
    throw error;
  }
}

export async function fetchWaterLevelData(
  districtName?: string,
): Promise<WaterLevelPost[]> {
  const baseUrl = getBaseUrl(); // ADDED
  let apiUrl = `${baseUrl}/api/water-level-proxy`; // MODIFIED
  const trimmedDistrictName = districtName?.trim();
  if (trimmedDistrictName) {
    apiUrl += `?districtName=${encodeURIComponent(trimmedDistrictName)}`;
  }
  try {
    const data: WaterLevelPost[] = await safeFetch(apiUrl, undefined, 'Failed to fetch water level data. Please try again.');
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchWaterLevelData: ${error.message}`);
    throw error;
  }
}

export async function fetchPumpStatusData(
  districtName?: string,
): Promise<PumpData[]> {
  const baseUrl = getBaseUrl(); // ADDED
  let apiUrl = `${baseUrl}/api/pump-status-proxy`; // MODIFIED
  const trimmedDistrictName = districtName?.trim();
  if (trimmedDistrictName) {
    apiUrl += `?districtName=${encodeURIComponent(trimmedDistrictName)}`;
  }
  try {
    const data: PumpData[] = await safeFetch(apiUrl, undefined, 'Failed to fetch pump status data. Please try again.');
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchPumpStatusData: ${error.message}`);
    throw error;
  }
}

export async function fetchUSGSLatestQuake(): Promise<EarthquakeData> {
  // USGS Earthquake Hazards Program - Real-time global earthquake data
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
  try {
    const data: any = await safeFetch(url, { next: { revalidate: 60 } }, 'Failed to fetch earthquake data. Please try again.');
    // Map basic fields to EarthquakeData shape if possible. For now, return a simplified object.
    if (data && data.features && data.features.length > 0) {
      const f = data.features[0];
      return {
        Date: new Date(f.properties.time).toISOString().split('T')[0],
        Time: new Date(f.properties.time).toISOString().split('T')[1].split('Z')[0],
        DateTime: new Date(f.properties.time).toISOString(),
        Coordinates: f.geometry.coordinates.join(','),
        Latitude: String(f.geometry.coordinates[1]),
        Longitude: String(f.geometry.coordinates[0]),
        Magnitude: String(f.properties.mag),
        Depth: '0',
        Region: f.properties.place || '',
        Potential: '',
        Felt: '',
        Shakemap: '',
      } as EarthquakeData;
    }
    throw new UserFriendlyError('Invalid earthquake feed format.', new Error('Invalid earthquake data format.'));
  } catch (error: any) {
    console.error(`API Error in fetchUSGSLatestQuake: ${error.message}`);
    throw error;
  }
}

export async function fetchDisasterReports(
  hazardType: string = 'flood',
  timeframe: string = '1h',
): Promise<DisasterReport[]> {
  const baseUrl = getBaseUrl();
  const apiUrl = `${baseUrl}/api/disaster-map-proxy-new?hazardType=${hazardType}&timeframe=${timeframe}`;
  try {
    const responseData = await safeFetch<any>(apiUrl, { next: { revalidate: 60 } }, 'Failed to fetch disaster reports. Please try again.');

    const features = responseData?.result?.features;
    if (!Array.isArray(features)) {
      console.warn('Disaster proxy returned data without a features array or an empty features array:', responseData);
      return [];
    }
    return features;
  } catch (error: any) {
    console.error(`API Error in fetchDisasterReports: ${error.message}`);
    throw error;
  }
}

export async function geocodeLocation(
  query: string,
): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=1&countrycodes=us`;
  console.log(`[Geocoding API] Fetching from URL: ${url}`);

  try {
    const data: NominatimResult[] = await safeFetch(
      url,
      {
        headers: {
          'User-Agent': 'RisqMapApp/1.0 (support@risqmapapp.com)', 
        },
      },
      'Failed to identify location. Please try again.'
    );
    console.log(`[Geocoding API] Received data for '${query}':`, data);
    return data;
  } catch (error: any) {
    console.error(`API Error in geocodeLocation: ${error.message}`);
    throw error;
  }
}
