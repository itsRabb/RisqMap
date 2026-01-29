import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const locationName = searchParams.get('locationName'); // To display in UI

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required.' }, { status: 400 });
  }

  let weatherSummary = {};
  let airQuality = null;

  try {
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,pressure_msl,windspeed_10m,winddirection_10m,visibility&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=iso8601&timezone=America%2FChicago`;
    const resp = await fetch(omUrl, { next: { revalidate: 0 } });
    const data = await resp.json();

    // Get current hour data (index 0)
    const hourly = data.hourly;
    const currentIdx = 0;
    const current = hourly ? {
      temperature: hourly.temperature_2m?.[currentIdx],
      weathercode: hourly.weathercode?.[currentIdx],
      humidity: hourly.relativehumidity_2m?.[currentIdx],
      pressure: hourly.pressure_msl?.[currentIdx],
      windspeed: hourly.windspeed_10m?.[currentIdx],
      visibility: hourly.visibility?.[currentIdx]
    } : null;
    const daily = data.daily ?? null;

    // Map weather codes to human-readable descriptions
    const getWeatherDescription = (code: number) => {
      if (!code) return 'Unknown';
      if (code === 0) return 'Clear sky';
      if (code <= 3) return 'Partly cloudy';
      if (code <= 48) return 'Foggy';
      if (code <= 67) return 'Rainy';
      if (code <= 77) return 'Snowy';
      if (code <= 82) return 'Rain showers';
      if (code <= 86) return 'Snow showers';
      if (code <= 99) return 'Thunderstorm';
      return 'Unknown';
    };

    const getWeatherIcon = (code: number) => {
      if (!code) return 'cloud-sun';
      if (code === 0) return 'Bright';
      if (code <= 3) return 'cloud-sun';
      if (code <= 48) return 'Cloudy';
      if (code <= 99) return 'Light Rain';
      return 'cloud-sun';
    };

    weatherSummary = {
      location: locationName || (data?.timezone ?? 'Unknown'),
      current: {
        temperature: current ? Math.round(current.temperature) : null,
        condition: current ? getWeatherDescription(current.weathercode) : 'N/A',
        icon: current ? getWeatherIcon(current.weathercode) : 'cloud-sun',
        humidity: current?.humidity ? Math.round(current.humidity) : null,
        pressure: current?.pressure ? Math.round(current.pressure) : null,
        windspeed: current?.windspeed ? Math.round(current.windspeed) : null,
        visibility: current?.visibility ? Math.round(current.visibility / 1000) : null, // Convert to km
      },
      forecast: (daily && daily.time && daily.sunrise && daily.sunset)
        ? daily.time.slice(0, 3).map((t: string, i: number) => ({
            time: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }),
            temperature: Math.round(daily.temperature_2m_max[i] ?? 0),
            condition: getWeatherIcon(current?.weathercode ?? 0)
          }))
        : [],
      sunrise: daily?.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      sunset: daily?.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    };

  } catch (error) {
    console.error('Error fetching dashboard widgets (Open‑Meteo):', error);
    return NextResponse.json({ error: 'Failed to fetch weather or air quality data.' }, { status: 500 });
  }

  return NextResponse.json({ weatherSummary, airQuality });
}