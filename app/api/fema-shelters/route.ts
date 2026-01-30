// Next.js API route to proxy FEMA National Shelter System API
// Fallback if Supabase Edge Functions aren't available

import { NextResponse } from 'next/server';

const FEMA_API_BASE = 'https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/MapServer/0/query';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const status = searchParams.get('status') || 'ALL';
    const state = searchParams.get('state');
    const geometry = searchParams.get('geometry');
    const geometryType = searchParams.get('geometryType');
    const spatialRel = searchParams.get('spatialRel');
    
    // Build FEMA API query parameters
    const femaParams = new URLSearchParams({
      outFields: '*',
      returnGeometry: 'true',
      f: 'geojson',
    });
    
    // Build WHERE clause
    const whereClauses: string[] = ['1=1'];
    
    if (status !== 'ALL') {
      whereClauses.push(`shelter_status='${status}'`);
    }
    
    if (state) {
      whereClauses.push(`state='${state}'`);
    }
    
    femaParams.set('where', whereClauses.join(' AND '));
    
    // Add spatial filtering if provided
    if (geometry) {
      femaParams.set('geometry', geometry);
    }
    if (geometryType) {
      femaParams.set('geometryType', geometryType);
    }
    if (spatialRel) {
      femaParams.set('spatialRel', spatialRel);
    }
    
    const femaUrl = `${FEMA_API_BASE}?${femaParams.toString()}`;
    
    console.log('[FEMA Proxy API] Fetching:', femaUrl);
    
    // Make request to FEMA API
    const response = await fetch(femaUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`FEMA API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`[FEMA Proxy API] Retrieved ${data.features?.length || 0} shelters`);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('[FEMA Proxy API] Error:', error);
    
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch FEMA shelter data',
      },
      { status: 500 }
    );
  }
}
