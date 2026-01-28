// lib/pump-stations.ts
/**
 * Real Pump Station Data Integration
 * Fetches actual infrastructure from Supabase database
 * Status is currently mock but infrastructure locations are real
 */

import { createClient } from '@/lib/supabase/server';

export interface PumpStation {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  pumpType: 'stormwater' | 'drainage_basin' | 'coastal_defense' | 'river_management';
  status: 'operational' | 'pumping' | 'standby' | 'maintenance' | 'offline' | 'no_data';
  capacityGpm?: number;
  operator?: string;
  contactInfo?: string;
  dashboardUrl?: string;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
}

/**
 * Fetch real pump stations from database
 * Falls back to mock data if database unavailable
 */
export async function fetchPumpStations(options?: {
  city?: string;
  state?: string;
  status?: PumpStation['status'];
  limit?: number;
}): Promise<PumpStation[]> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('pump_stations')
      .select('*')
      .order('city', { ascending: true });

    // Apply filters
    if (options?.city) {
      query = query.eq('city', options.city);
    }
    if (options?.state) {
      query = query.eq('state', options.state);
    }
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching pump stations from database:', error);
      return getFallbackPumpStations(options?.limit || 50);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No pump stations in database, using fallback');
      return getFallbackPumpStations(options?.limit || 50);
    }

    // Transform snake_case to camelCase
    const stations: PumpStation[] = data.map((station: any) => ({
      id: station.id,
      code: station.code,
      name: station.name,
      city: station.city,
      state: station.state,
      latitude: station.latitude,
      longitude: station.longitude,
      pumpType: station.pump_type,
      status: station.status,
      capacityGpm: station.capacity_gpm,
      operator: station.operator,
      contactInfo: station.contact_info,
      dashboardUrl: station.dashboard_url,
      notes: station.notes,
      lastUpdated: station.last_updated,
      createdAt: station.created_at,
    }));

    console.log(`✅ Fetched ${stations.length} real pump stations from database`);
    return stations;

  } catch (error) {
    console.error('❌ Failed to fetch pump stations:', error);
    return getFallbackPumpStations(options?.limit || 50);
  }
}

/**
 * Get pump stations for specific cities (e.g., New Orleans, Miami, Houston)
 */
export async function fetchPumpStationsByCity(city: string): Promise<PumpStation[]> {
  return fetchPumpStations({ city });
}

/**
 * Get pump stations with specific status (e.g., offline, maintenance)
 */
export async function fetchPumpStationsByStatus(status: PumpStation['status']): Promise<PumpStation[]> {
  return fetchPumpStations({ status });
}

/**
 * Fallback pump stations when database is unavailable
 * These are still real locations, just with mock status
 */
function getFallbackPumpStations(limit: number = 50): PumpStation[] {
  const mockStatuses: PumpStation['status'][] = ['operational', 'pumping', 'standby', 'maintenance', 'offline'];
  
  const fallbackStations: PumpStation[] = [
    {
      id: '1',
      code: 'DPS-01',
      name: 'Drainage Pump Station 01',
      city: 'New Orleans',
      state: 'LA',
      latitude: 29.9704,
      longitude: -90.1069,
      pumpType: 'drainage_basin',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'SWBNO',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      code: 'DPS-06',
      name: 'Drainage Pump Station 06',
      city: 'New Orleans',
      state: 'LA',
      latitude: 29.9889,
      longitude: -90.1131,
      pumpType: 'drainage_basin',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'SWBNO',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      code: 'MIA-STA-A',
      name: 'Stormwater Pump Station A',
      city: 'Miami Beach',
      state: 'FL',
      latitude: 25.7907,
      longitude: -80.1300,
      pumpType: 'stormwater',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'Miami Beach Public Works',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      code: 'HTX-BRAYS',
      name: 'Brays Bayou Pump Station',
      city: 'Houston',
      state: 'TX',
      latitude: 29.6960,
      longitude: -95.4089,
      pumpType: 'drainage_basin',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'Harris County Flood Control',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      code: 'NFK-HAGUE',
      name: 'Hague Pump Station',
      city: 'Norfolk',
      state: 'VA',
      latitude: 36.8508,
      longitude: -76.2859,
      pumpType: 'coastal_defense',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'Norfolk Public Works',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      code: 'CHS-PENN-01',
      name: 'Peninsula Drainage Pump 1',
      city: 'Charleston',
      state: 'SC',
      latitude: 32.7765,
      longitude: -79.9311,
      pumpType: 'drainage_basin',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'Charleston Water System',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      code: 'NYC-CONEY',
      name: 'Coney Island Pump Station',
      city: 'Brooklyn',
      state: 'NY',
      latitude: 40.5755,
      longitude: -73.9707,
      pumpType: 'coastal_defense',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'NYC DEP',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      code: 'GAL-SW-01',
      name: 'Galveston Seawall Pump 1',
      city: 'Galveston',
      state: 'TX',
      latitude: 29.2983,
      longitude: -94.7917,
      pumpType: 'coastal_defense',
      status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
      operator: 'City of Galveston',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  return fallbackStations.slice(0, limit);
}

/**
 * Transform pump station data for dashboard display
 * Converts PumpStation to PumpData interface for metrics calculation
 */
export function transformPumpStationForDisplay(station: PumpStation) {
  return {
    id: station.id,
    infrastructure_name: station.name,
    latitude: station.latitude,
    longitude: station.longitude,
    building_condition: station.status === 'operational' || station.status === 'pumping' || station.status === 'standby' 
      ? 'Good' 
      : station.status === 'maintenance' 
      ? 'Under Maintenance' 
      : 'Poor',
    hydrological_type: station.pumpType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    infrastructure_type: 'Pump Station',
    province: station.state,
    city_regency: station.city,
    location: `${station.city}, ${station.state}`,
    capacity_liters_per_second: station.capacityGpm ? Math.round(station.capacityGpm * 0.06309) : undefined,
    pump_status: [{
      status: station.status,
      code: station.code,
      operator: station.operator,
      dashboard_url: station.dashboardUrl,
    }],
    updated_at: new Date(station.lastUpdated).getTime(),
  };
}

/**
 * Get summary statistics for pump stations
 */
export async function getPumpStationStats() {
  const stations = await fetchPumpStations();
  
  const stats = {
    total: stations.length,
    operational: stations.filter(s => s.status === 'operational' || s.status === 'pumping' || s.status === 'standby').length,
    offline: stations.filter(s => s.status === 'offline' || s.status === 'maintenance').length,
    noData: stations.filter(s => s.status === 'no_data').length,
    byCity: {} as Record<string, number>,
    byType: {} as Record<string, number>,
  };

  // Count by city
  stations.forEach(station => {
    const cityKey = `${station.city}, ${station.state}`;
    stats.byCity[cityKey] = (stats.byCity[cityKey] || 0) + 1;
  });

  // Count by type
  stations.forEach(station => {
    stats.byType[station.pumpType] = (stats.byType[station.pumpType] || 0) + 1;
  });

  return stats;
}
