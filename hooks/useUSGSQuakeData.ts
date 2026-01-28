import { useState, useEffect } from 'react';
import { fetchUSGSLatestQuake } from '@/lib/api.client';
import { EarthquakeData } from '@/lib/api';

const DATA_FETCH_INTERVAL_MS = 10 * 60 * 1000;

export const useUSGSQuakeData = () => {
  const [latestQuake, setLatestQuake] = useState<EarthquakeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLatestQuake = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUSGSLatestQuake();
        setLatestQuake(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getLatestQuake();
    const interval = setInterval(getLatestQuake, DATA_FETCH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { latestQuake, isLoading, error };
};
