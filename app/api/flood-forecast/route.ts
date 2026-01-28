/**
 * Flood Forecast API Endpoint
 * Returns NOAA AHPS 7-day flood predictions
 */

import { NextResponse } from 'next/server';
import { 
  fetchMultipleAHPSForecasts, 
  getFloodForecastSummary,
  MAJOR_AHPS_GAGES 
} from '@/lib/noaa-flood-forecast';

// Cache for 30 minutes (NOAA updates every 6 hours)
export const revalidate = 1800;

export async function GET() {
  try {
    // Get all major AHPS gages
    const gageIds = Object.keys(MAJOR_AHPS_GAGES);
    
    // Fetch forecasts in parallel
    const [forecasts, summary] = await Promise.all([
      fetchMultipleAHPSForecasts(gageIds.slice(0, 10)), // Top 10 for performance
      getFloodForecastSummary()
    ]);
    
    // Filter to only show gages with active flood conditions or forecasts
    const activeForecasts = forecasts.filter(f => 
      f.currentStage >= f.actionStage || 
      f.forecast.some(p => p.stage >= f.actionStage)
    );
    
    return NextResponse.json({
      forecasts: activeForecasts,
      summary,
      lastUpdate: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error fetching flood forecasts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flood forecast data', details: error.message },
      { status: 500 }
    );
  }
}
