import { useState, useCallback } from 'react';
import type { CombinedWeatherData } from '@/lib/api';
import { fetchWeatherFromServer } from '@/lib/api.client';

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<CombinedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const data: CombinedWeatherData = await fetchWeatherFromServer(latitude, longitude);
        setWeatherData(data);
      } catch (err: any) {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { weatherData, isLoading, error, fetchWeather };
};
