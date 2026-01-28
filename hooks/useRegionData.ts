// src/hooks/useRegionData.ts
import { useState, useEffect } from 'react';
import { fetchRegionsClient } from '@/lib/api.client'; // Import client-side fetchRegions
import { RegionData } from '@/lib/api'; // RegionData is still imported as named

interface UseRegionDataOptions {
  type:
    | 'provinces'
    | 'regencies'
    | 'districts'
    | 'villages'
    | 'states'
    | 'counties'
    | 'cities';
  parentCode?: number | string | null;
  enabled?: boolean; // To control when fetching is active
}

interface UseRegionDataResult {
  data: RegionData[];
  loading: boolean;
  error: string | null;
}

export function useRegionData({
  type,
  parentCode,
  enabled = true,
}: UseRegionDataOptions): UseRegionDataResult {
  const [data, setData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if 'enabled' and parentCode is valid if required
    if (
      !enabled ||
      (parentCode === null &&
        (type === 'regencies' || type === 'districts' || type === 'villages'))
    ) {
      setData([]); // Clear data if not enabled or parentCode is null
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // === FIX HERE: Call fetchRegions through the apiService alias ===
        const result = await fetchRegionsClient(
          type,
          parentCode || undefined,
        );
        console.log(
          `DEBUG useRegionData: Raw API response for type '${type}' and parent '${parentCode}':`,
          result,
        );
        setData(result);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
        setData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, parentCode, enabled]); // Dependencies for useEffect

  return { data, loading, error };
}
