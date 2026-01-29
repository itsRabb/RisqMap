import { NextResponse } from 'next/server';
import { fetchNOAAWeather } from '@/lib/noaa-weather';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const lang = searchParams.get('lang') || 'en';

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // 🚀 NOW USING Open-Meteo with comprehensive hourly weather data
    // Temperature: Fahrenheit, Wind: mph, Precipitation: inch, Timezone: America/Chicago
    const axios = await import('axios');
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,windspeed_10m,winddirection_10m,windgusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=iso8601&timezone=America%2FChicago`;
    const omRes = await axios.default.get(omUrl);

    // Get current hour data (index 0)
    const hourly = omRes.data.hourly;
    const currentIdx = 0;
    const current = hourly ? {
      temperature: hourly.temperature_2m?.[currentIdx],
      weathercode: hourly.weathercode?.[currentIdx],
      windspeed: hourly.windspeed_10m?.[currentIdx],
      winddirection: hourly.winddirection_10m?.[currentIdx],
      time: hourly.time?.[currentIdx],
      humidity: hourly.relativehumidity_2m?.[currentIdx],
      pressure: hourly.pressure_msl?.[currentIdx] ?? hourly.surface_pressure?.[currentIdx],
      apparent_temperature: hourly.apparent_temperature?.[currentIdx],
      visibility: hourly.visibility?.[currentIdx],
      precipitation_probability: hourly.precipitation_probability?.[currentIdx]
    } : null;

    const daily = (omRes.data.daily && omRes.data.daily.time)
      ? omRes.data.daily.time.map((t: any, i: number) => ({
          dt: t,
          temp_max: omRes.data.daily.temperature_2m_max?.[i],
          temp_min: omRes.data.daily.temperature_2m_min?.[i],
          precipitation: omRes.data.daily.precipitation_sum?.[i],
          sunrise: omRes.data.daily.sunrise?.[i],
          sunset: omRes.data.daily.sunset?.[i]
        }))
      : [];

    const hourlyData = (hourly && hourly.time)
      ? hourly.time.map((t: any, i: number) => ({ 
          timestamp: t, 
          precipitation: hourly.precipitation?.[i] ?? 0,
          rain: hourly.rain?.[i] ?? 0,
          temperature: hourly.temperature_2m?.[i] ?? 0,
          apparent_temperature: hourly.apparent_temperature?.[i] ?? 0,
          humidity: hourly.relativehumidity_2m?.[i] ?? 0,
          dewpoint: hourly.dewpoint_2m?.[i] ?? 0,
          windSpeed: hourly.windspeed_10m?.[i] ?? 0,
          windDirection: hourly.winddirection_10m?.[i] ?? 0,
          windGusts: hourly.windgusts_10m?.[i] ?? 0,
          pressure: hourly.pressure_msl?.[i] ?? 0,
          visibility: hourly.visibility?.[i] ?? 0,
          cloudcover: hourly.cloudcover?.[i] ?? 0,
          weathercode: hourly.weathercode?.[i] ?? 0
        }))
      : [];

    return NextResponse.json({
      provider: 'open-meteo',
      current,
      daily,
      hourly: hourlyData,
      alerts: [], // Open-Meteo doesn't provide alerts
      location: null,
      airQuality: null,
    });
  } catch (err: any) {
    console.error('Open-Meteo API error:', err?.message || err);
    
    // Fallback to NOAA if Open-Meteo fails
    try {
      const noaaData = await fetchNOAAWeather(parseFloat(lat), parseFloat(lon));
      
      // Transform NOAA data to match our existing format
      const formattedData = {
        provider: 'NOAA/NWS (fallback)',
        current: {
          temperature: noaaData.temperature,
          weathercode: mapConditionToCode(noaaData.condition),
          windspeed: noaaData.windSpeed,
          winddirection: noaaData.windDirection,
          time: noaaData.timestamp
        },
        daily: noaaData.forecast.slice(0, 7).map(f => ({
          dt: f.time,
          temp_max: f.isDaytime ? f.temperature : null,
          temp_min: !f.isDaytime ? f.temperature : null,
          precipitation: f.precipProbability,
          condition: f.condition,
          description: f.description
        })),
        hourly: noaaData.forecast.map(f => ({
          timestamp: f.time,
          precipitation: f.precipProbability,
          temperature: f.temperature,
          windSpeed: f.windSpeed
        })),
        alerts: noaaData.alerts.map(alert => ({
          event: alert.event,
          headline: alert.headline,
          severity: alert.severity,
          urgency: alert.urgency,
          areas: alert.areas,
          expires: alert.expires
        })),
        location: noaaData.location,
        airQuality: null, // TODO: Add EPA AirNow API integration
      };

      return NextResponse.json(formattedData);
    } catch (fallbackErr: any) {
      console.error('NOAA fallback also failed:', fallbackErr?.message);
      return NextResponse.json({ error: 'Failed to fetch weather data from all sources.' }, { status: 500 });
    }
  }
}

// Map weather conditions to numeric codes (for compatibility)
function mapConditionToCode(condition: string): number {
  const codeMap: Record<string, number> = {
    'sunny': 0,
    'partly-cloudy': 2,
    'cloudy': 3,
    'foggy': 45,
    'rainy': 61,
    'stormy': 95,
    'snowy': 71,
    'windy': 1
  };
  return codeMap[condition] || 0;
}