import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const start = searchParams.get('start'); // Unix timestamp
  const end = searchParams.get('end');   // Unix timestamp

  if (!lat || !lon || !start || !end) {
    return NextResponse.json({ error: 'Missing latitude, longitude, start, or end parameters' }, { status: 400 });
  }

  try {
    // Use Open‑Meteo archive API to fetch hourly precipitation between start & end dates.
    // Convert unix timestamps to YYYY-MM-DD
    const startDate = new Date(Number(start) * 1000).toISOString().slice(0, 10);
    const endDate = new Date(Number(end) * 1000).toISOString().slice(0, 10);
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=precipitation&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Open‑Meteo API error:', data);
      return NextResponse.json({ error: data.reason || 'Failed to fetch weather history data' }, { status: response.status });
    }

    // Map hourly.time[] & hourly.precipitation[] to timestamped rain objects (unix seconds)
    const times: string[] = data.hourly?.time || [];
    const prec: number[] = data.hourly?.precipitation || [];
    const rainfallData = times.map((t: string, i: number) => ({
      timestamp: Math.floor(new Date(t).getTime() / 1000),
      rain: prec[i] ?? 0,
    }));

    return NextResponse.json(rainfallData);
  } catch (error) {
    console.error('Error in /api/weather-history:', error);
    return NextResponse.json({ error: `Internal server error: ${(error as Error).message}` }, { status: 500 });
  }
}