// Supabase Edge Function to proxy FEMA National Shelter System API
// This bypasses CORS restrictions by making the request server-side

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FEMA_API_BASE = "https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/MapServer/0/query";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Extract query parameters from the request
    const status = url.searchParams.get('status') || 'ALL';
    const state = url.searchParams.get('state');
    const geometry = url.searchParams.get('geometry');
    const geometryType = url.searchParams.get('geometryType');
    const spatialRel = url.searchParams.get('spatialRel');
    
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
    
    console.log('[FEMA Proxy] Fetching:', femaUrl);
    
    // Make request to FEMA API
    const response = await fetch(femaUrl);
    
    if (!response.ok) {
      throw new Error(`FEMA API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`[FEMA Proxy] Retrieved ${data.features?.length || 0} shelters`);
    
    // Return the data with CORS headers
    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[FEMA Proxy] Error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to fetch FEMA shelter data',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
