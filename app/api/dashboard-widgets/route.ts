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
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const resp = await fetch(omUrl, { next: { revalidate: 0 } });
    const data = await resp.json();

    const current = data.current_weather ?? null;
    const daily = data.daily ?? null;

    weatherSummary = {
      location: locationName || (data?.timezone ?? 'Unknown'),
      current: {
        temperature: current ? Math.round(current.temperature) : null,
        condition: current ? `weathercode:${current.weathercode}` : null,
        icon: null,
      },
      forecast: (daily && daily.time)
        ? daily.time.slice(0, 3).map((t: string, i: number) => ({ time: t, temperature: Math.round(daily.temperature_2m_max[i] ?? 0), condition: `weathercode:${current?.weathercode ?? 'N/A'}` }))
        : [],
    };

  } catch (error) {
    console.error('Error fetching dashboard widgets (Open‑Meteo):', error);
    return NextResponse.json({ error: 'Failed to fetch weather or air quality data.' }, { status: 500 });
  }

  return NextResponse.json({ weatherSummary, airQuality });
}