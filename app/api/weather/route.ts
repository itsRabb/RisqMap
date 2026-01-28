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
    // 🚀 NOW USING OFFICIAL NOAA/NWS WEATHER API!
    // Official US government weather data with forecasts and alerts
    const noaaData = await fetchNOAAWeather(parseFloat(lat), parseFloat(lon));
    
    // Transform NOAA data to match our existing format
    const formattedData = {
      provider: 'NOAA/NWS',
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
  } catch (err: any) {
    console.error('NOAA Weather API error:', err?.message || err);
    
    // Fallback to Open-Meteo if NOAA fails (coordinates outside US, etc.)
    try {
      const axios = await import('axios');
      const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,precipitation,relativehumidity_2m&timezone=auto`;
      const omRes = await axios.default.get(omUrl);

      const current = omRes.data.current_weather ?? null;
      const daily = (omRes.data.daily && omRes.data.daily.time)
        ? omRes.data.daily.time.map((t: any, i: number) => ({
            dt: t,
            temp_max: omRes.data.daily.temperature_2m_max?.[i],
            temp_min: omRes.data.daily.temperature_2m_min?.[i],
            precipitation: omRes.data.daily.precipitation_sum?.[i]
          }))
        : [];

      const hourly = (omRes.data.hourly && omRes.data.hourly.time)
        ? omRes.data.hourly.time.map((t: any, i: number) => ({ 
            timestamp: t, 
            precipitation: omRes.data.hourly.precipitation?.[i] ?? 0 
          }))
        : [];

      return NextResponse.json({
        provider: 'open-meteo (fallback)',
        current,
        daily,
        hourly,
        alerts: [],
        airQuality: null,
      });
    } catch (fallbackErr: any) {
      console.error('Open-Meteo fallback also failed:', fallbackErr?.message);
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