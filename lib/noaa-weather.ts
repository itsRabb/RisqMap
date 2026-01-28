/**
 * NOAA Weather API Integration
 * Official US weather data and severe weather alerts
 * 
 * API Documentation: https://www.weather.gov/documentation/services-web-api
 * Features: Current conditions, forecasts, active alerts
 * Update Frequency: Hourly (forecasts), Real-time (alerts)
 * Rate Limit: None (public API)
 */

// Custom type for NOAA weather data (different from CombinedWeatherData)
export interface NOAAWeatherData {
  temperature: number;
  temperatureUnit: string;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  dewPoint: number;
  forecast: Array<{
    time: string;
    temperature: number;
    temperatureUnit: string;
    condition: string;
    description: string;
    precipProbability: number;
    windSpeed: number;
    windDirection: string;
    isDaytime: boolean;
  }>;
  alerts: Array<{
    id: string;
    event: string;
    headline: string;
    description: string;
    severity: 'extreme' | 'severe' | 'moderate' | 'minor';
    urgency: 'immediate' | 'expected' | 'future';
    areas: string;
    effective: string;
    expires: string;
    instruction: string;
  }>;
  location: {
    city: string;
    state: string;
    lat: string;
    lon: string;
  };
  source: string;
  timestamp: string;
  lastUpdate: string;
}

interface NOAAPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

interface NOAAForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

interface NOAAAlert {
  properties: {
    id: string;
    areaDesc: string;
    geocode: {
      SAME: string[];
      UGC: string[];
    };
    severity: string;
    certainty: string;
    urgency: string;
    event: string;
    headline: string;
    description: string;
    instruction: string;
    response: string;
    sent: string;
    effective: string;
    expires: string;
  };
}

/**
 * Fetch weather data from NOAA API
 * This is the official US government weather source
 */
export async function fetchNOAAWeather(
  lat: number,
  lon: number
): Promise<NOAAWeatherData> {
  const userAgent = 'RisqMap/1.0 (contact@risqmap.com)';
  
  try {
    // Step 1: Get grid point data for this location
    const pointUrl = `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`;
    const pointResponse = await fetch(pointUrl, {
      headers: { 'User-Agent': userAgent, 'Accept': 'application/geo+json' }
    });

    if (!pointResponse.ok) {
      throw new Error(`NOAA Point API error: ${pointResponse.status}`);
    }

    const pointData: NOAAPoint = await pointResponse.json();

    // Step 2: Get forecast data
    const forecastUrl = pointData.properties.forecast;
    const forecastResponse = await fetch(forecastUrl, {
      headers: { 'User-Agent': userAgent, 'Accept': 'application/geo+json' }
    });

    if (!forecastResponse.ok) {
      throw new Error(`NOAA Forecast API error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();
    const periods: NOAAForecastPeriod[] = forecastData.properties.periods;

    // Step 3: Get active weather alerts
    const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
    const alertsResponse = await fetch(alertsUrl, {
      headers: { 'User-Agent': userAgent, 'Accept': 'application/geo+json' }
    });

    let alerts: NOAAAlert[] = [];
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json();
      alerts = alertsData.features || [];
    }

    // Transform to our format
    return transformNOAAData(periods, alerts, pointData);
  } catch (error) {
    console.error('Error fetching NOAA weather:', error);
    throw error;
  }
}

/**
 * Transform NOAA data to our NOAAWeatherData format
 */
function transformNOAAData(
  periods: NOAAForecastPeriod[],
  alerts: NOAAAlert[],
  pointData: NOAAPoint
): NOAAWeatherData {
  const currentPeriod = periods[0];
  
  // Extract wind speed (NOAA format: "5 to 10 mph" or "10 mph")
  const windSpeedMatch = currentPeriod.windSpeed.match(/(\d+)/);
  const windSpeed = windSpeedMatch ? parseInt(windSpeedMatch[1]) : 0;

  // Determine precipitation probability from forecast text
  const precipMatch = currentPeriod.detailedForecast.match(/(\d+)%/);
  const precipProbability = precipMatch ? parseInt(precipMatch[1]) : 0;

  // Map NOAA weather icons to conditions
  const weatherCondition = mapNOAAIconToCondition(currentPeriod.icon);

  return {
    // Current conditions
    temperature: currentPeriod.temperature,
    temperatureUnit: currentPeriod.temperatureUnit,
    condition: weatherCondition,
    description: currentPeriod.shortForecast,
    humidity: estimateHumidity(weatherCondition), // NOAA doesn't provide in forecast
    windSpeed: windSpeed,
    windDirection: currentPeriod.windDirection,
    pressure: 1013, // Standard pressure - not in NOAA forecast API
    visibility: 10, // Assume good visibility
    uvIndex: currentPeriod.isDaytime ? 5 : 0,
    feelsLike: currentPeriod.temperature, // Calculate windchill/heat index if needed
    dewPoint: currentPeriod.temperature - 5, // Rough estimate
    
    // Forecast
    forecast: periods.slice(0, 7).map(period => ({
      time: period.startTime,
      temperature: period.temperature,
      temperatureUnit: period.temperatureUnit,
      condition: mapNOAAIconToCondition(period.icon),
      description: period.shortForecast,
      precipProbability: extractPrecipProbability(period.detailedForecast),
      windSpeed: extractWindSpeed(period.windSpeed),
      windDirection: period.windDirection,
      isDaytime: period.isDaytime
    })),

    // Alerts
    alerts: alerts.map(alert => ({
      id: alert.properties.id,
      event: alert.properties.event,
      headline: alert.properties.headline,
      description: alert.properties.description,
      severity: alert.properties.severity.toLowerCase() as 'extreme' | 'severe' | 'moderate' | 'minor',
      urgency: alert.properties.urgency.toLowerCase() as 'immediate' | 'expected' | 'future',
      areas: alert.properties.areaDesc,
      effective: alert.properties.effective,
      expires: alert.properties.expires,
      instruction: alert.properties.instruction
    })),

    // Location info
    location: {
      city: pointData.properties.relativeLocation.properties.city,
      state: pointData.properties.relativeLocation.properties.state,
      lat: pointData.properties.relativeLocation.properties.city,
      lon: pointData.properties.relativeLocation.properties.state
    },

    // Metadata
    source: 'NOAA/NWS',
    timestamp: new Date().toISOString(),
    lastUpdate: currentPeriod.startTime
  };
}

/**
 * Map NOAA weather icon URL to our weather condition types
 */
function mapNOAAIconToCondition(iconUrl: string): string {
  const icon = iconUrl.toLowerCase();
  
  if (icon.includes('rain') || icon.includes('showers')) return 'rainy';
  if (icon.includes('snow') || icon.includes('blizzard')) return 'snowy';
  if (icon.includes('thunder') || icon.includes('tsra')) return 'stormy';
  if (icon.includes('fog')) return 'foggy';
  if (icon.includes('cloud')) return 'cloudy';
  if (icon.includes('clear') || icon.includes('sunny') || icon.includes('skc')) return 'sunny';
  if (icon.includes('wind')) return 'windy';
  
  return 'partly-cloudy';
}

/**
 * Extract precipitation probability from detailed forecast text
 */
function extractPrecipProbability(text: string): number {
  const match = text.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Extract numeric wind speed from NOAA format
 */
function extractWindSpeed(windStr: string): number {
  const match = windStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Estimate humidity based on weather condition
 */
function estimateHumidity(condition: string): number {
  switch (condition) {
    case 'rainy': return 95;
    case 'stormy': return 90;
    case 'foggy': return 100;
    case 'cloudy': return 75;
    case 'partly-cloudy': return 60;
    case 'sunny': return 45;
    case 'snowy': return 85;
    default: return 60;
  }
}

/**
 * Get active severe weather alerts for a location
 */
export async function getNOAAAlerts(lat: number, lon: number) {
  const userAgent = 'RisqMap/1.0 (contact@risqmap.com)';
  const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': userAgent, 'Accept': 'application/geo+json' }
    });

    if (!response.ok) {
      throw new Error(`NOAA Alerts API error: ${response.status}`);
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Error fetching NOAA alerts:', error);
    return [];
  }
}

/**
 * Get active alerts by state
 */
export async function getNOAAAlertsByState(stateCode: string) {
  const userAgent = 'RisqMap/1.0 (contact@risqmap.com)';
  const url = `https://api.weather.gov/alerts/active?area=${stateCode}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': userAgent, 'Accept': 'application/geo+json' }
    });

    if (!response.ok) {
      throw new Error(`NOAA Alerts API error: ${response.status}`);
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Error fetching NOAA alerts by state:', error);
    return [];
  }
}
