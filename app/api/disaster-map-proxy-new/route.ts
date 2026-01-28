// app/api/disaster_map-proxy/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hazardType = searchParams.get('hazardType') || 'flood';
  const timeframe = searchParams.get('timeframe') || '24h';

  // Get API Key from environment variable if disaster_map.id requires it
  // Make sure you add disaster_map_API_KEY in your .env.local file
  // const disaster_map_API_KEY = process.env.disaster_map_API_KEY; // Commented out for 403 debugging

  const timeperiodMap: { [key: string]: number } = {
    '24h': 86400,
    '3d': 259200,
  };
  const timeperiod = timeperiodMap[timeframe] || 86400; // Default to 24h if timeframe is not recognized

  let apiUrl = `https://api.disaster_map.id/reports?disaster=${hazardType}&timeperiod=${timeperiod}&geoformat=geojson`;

  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store', // Ensure data is always fresh
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RisqMap/1.0', // Updated User-Agent
        // ...(disaster_map_API_KEY ? { Authorization: `Bearer ${disaster_map_API_KEY}` } : {}), // Commented out for 403 debugging
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Add guard for 403 "Missing Authentication Token"
      if (response.status === 403 && errorText.includes("Missing Authentication Token")) {
        console.error(`disaster_map 403 Error: Likely wrong path or method. URL: ${apiUrl}, Body: ${errorText}`);
        return NextResponse.json(
          {
            error: `disaster_map API 403: Likely wrong path or method. Please check URL and HTTP method.`,
            details: errorText,
            url: apiUrl
          },
          { status: 403 },
        );
      }

      return NextResponse.json(
        {
          error: `Failed to fetch from disaster_map.id: ${response.status} - ${errorText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error in Disaster Map proxy:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}