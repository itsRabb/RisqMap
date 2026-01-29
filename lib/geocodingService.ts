import { GeocodingResponse, ReverseGeocodingResponse } from '../types/geocoding';
import { AirPollutionData } from '../types/airPollution';

export async function getCurrentWeather(latitude: number, longitude: number) {
  // Placeholder implementation using Open‑Meteo for quick US-focused demo.
  // TODO: move mapping to a shared adapter so other parts of the app reuse it.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weathercode,pressure_msl,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=iso8601&timezone=America%2FChicago`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data.');
  }
  const data = await response.json();
  return data;
}

export async function getCoordsByLocationName(locationName: string, limit?: number): Promise<GeocodingResponse[] | null> {
  console.warn(`Placeholder: getCoordsByLocationName called with ${locationName} and limit ${limit}`);
  // Implement actual geocoding logic here (e.g., using a geocoding API)
  // For now, return a dummy GeocodingResponse array
  if (locationName) {
    // Return a US sample default (New York) for placeholder geocoding
    return [{ name: locationName, lat: 40.7128, lon: -74.0060, country: "US" }];
  }
  return [];
}

export async function getLocationNameByCoords(lat: number, lng: number): Promise<ReverseGeocodingResponse | null> {
  try {
    // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key required)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RisqMap/1.0 (Flood Risk Monitoring System)'
      }
    });
    
    if (!response.ok) {
      console.error('Reverse geocoding failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Extract location name from response
    const address = data.address || {};
    let locationName = '';
    
    // Build location name from available address components
    if (address.city) {
      locationName = address.city;
    } else if (address.town) {
      locationName = address.town;
    } else if (address.village) {
      locationName = address.village;
    } else if (address.county) {
      locationName = address.county;
    }
    
    // Add state if available
    if (address.state) {
      locationName = locationName ? `${locationName}, ${address.state}` : address.state;
    }
    
    // Fallback to display_name if no structured name available
    if (!locationName && data.display_name) {
      const parts = data.display_name.split(',');
      locationName = parts.slice(0, 2).join(',').trim();
    }
    
    console.log(`✅ Reverse geocoded: ${locationName} at (${lat}, ${lng})`);
    
    return {
      name: locationName || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat: lat,
      lon: lng,
      country: address.country_code?.toUpperCase() || 'US',
      state: address.state,
      city: address.city || address.town || address.village,
      county: address.county
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return {
      name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat: lat,
      lon: lng,
      country: 'US'
    };
  }
}

export async function getAirPollutionData(latitude: number, longitude: number): Promise<AirPollutionData | null> {
  console.warn(`Placeholder: getAirPollutionData called with lat: ${latitude}, lng: ${longitude}`);
  // Implement actual air pollution data fetching logic here
  return {
    dt: Math.floor(Date.now() / 1000),
    main: { aqi: 1 },
    components: {
      co: 0, no: 0, no2: 0, o3: 0, so2: 0, pm2_5: 0, pm10: 0, nh3: 0
    }
  };
}