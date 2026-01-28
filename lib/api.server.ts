// src/lib/api.server.ts
'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { RegionData } from './api'; // Import RegionData from the shared api.ts (for interfaces)
import { UserFriendlyError } from './error-utils'; // ADDED: Import UserFriendlyError
import { getStates, fetchCountiesForState, fetchCitiesForCounty } from './usRegions';

export async function getRegionDataServer(
  type: string,
  parentCode?: string | number | null,
): Promise<RegionData[]> {
  // Guard: hard-fail if supabaseServiceRole is not available (i.e., called from client)
  if (typeof window !== 'undefined' || !supabaseAdmin) {
    const errorMessage = `ERROR: getRegionDataServer called from client-side or supabaseServiceRole not initialized. Module: lib/api.ts, Runtime: ${typeof window !== 'undefined' ? 'client' : 'unknown'}`;
    console.error(errorMessage);
    throw new UserFriendlyError('Server error while fetching region data.', new Error(errorMessage)); // Use UserFriendlyError
  }
  console.log(
    `getRegionData called with type='${type}' and parentCode='${parentCode}'`,
  );

  if (!type) {
    throw new UserFriendlyError('Invalid region type.', new Error('Missing required parameter: type')); // Use UserFriendlyError
  }

  // New behavior: if requesting US-centric types ('states','counties','cities')
  // return static dataset from `lib/usRegions.ts` for immediate US readiness.
  let tableName: string | null = null;
  let selectColumns: string | null = null;
  let whereColumn: string | null = null;

  // Support legacy names by mapping them to server DB flow.
  if (type === 'states' || type === 'provinces') {
    // Serve static US states list (mapped to province_* fields).
    const states = getStates();
    return states as RegionData[];
  }

  if (type === 'counties' || type === 'regencies') {
    if (!parentCode) return [];
    // parentCode may be state code (e.g., 'CA') or numeric; support both.
    try {
      const counties = await fetchCountiesForState(String(parentCode));
      return counties as RegionData[];
    } catch (err) {
      console.error('Error fetching counties from Nominatim:', err);
      return [];
    }
  }

  if (type === 'cities' || type === 'districts') {
    if (!parentCode) return [];
    try {
      // parentCode here may be county name or osm id; prefer county name when possible.
      const countyIdentifier = String(parentCode);
      const cities = await fetchCitiesForCounty(countyIdentifier);
      return cities as RegionData[];
    } catch (err) {
      console.error('Error fetching cities from Nominatim:', err);
      return [];
    }
  }

  // Fallback: legacy database-backed logic for older tables

  if (
    (type === 'regencies' || type === 'districts' || type === 'villages') &&
    (parentCode === undefined || parentCode === null || String(parentCode).toLowerCase() === 'undefined')
  ) {
    const errorMessage = `ERROR: Missing parent_code for type: ${type}. Received: ${parentCode}. This function should not be called with undefined/null parentCode for this type.`;
    console.error(errorMessage);
    throw new UserFriendlyError('Parent region code not found.', new Error(errorMessage)); // Use UserFriendlyError
  }

  let query = supabaseAdmin.from(tableName!).select(selectColumns!);

  const sortColumn =
    selectColumns.split(',')[1]?.trim() ||
    selectColumns.split(',')[0]?.trim();
  if (sortColumn) {
    query = query.order(sortColumn, { ascending: true });
  }

  if (whereColumn && parentCode) {
    query = query.eq(whereColumn, parentCode);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data from Supabase:', error.message);
    throw new UserFriendlyError('Failed to fetch region data from the database.', error); // Use UserFriendlyError
  }

  return (data as RegionData[]) || [];
}


export async function fetchRegionsServer(
  type: 'provinces' | 'regencies' | 'districts' | 'villages' | 'states' | 'counties' | 'cities',
  parentCode?: number | string,
): Promise<RegionData[]> {
  try {
    const data = await getRegionDataServer(type, parentCode);
    return data;
  } catch (error: any) {
    console.error(`API Error in fetchRegionsServer: ${error.message}`);
    throw error; // Re-throw UserFriendlyError
  }
}