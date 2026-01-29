'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { fetchWeatherFromServer } from '@/lib/api.client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import dynamic from 'next/dynamic';

const WeatherMap = dynamic(
  () => import('@/components/weather/WeatherMap').then((mod) => mod.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-800 flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    ),
  },
);
import {
  Search,
  MapPin,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  Loader2,
  Filter,
  Layers,
  Activity,
  Globe,
  Compass,
  Zap,
  TrendingUp,
  AlertTriangle,
  Wifi,
  Sun,
  CloudSun,
  Moon,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  Snowflake,
  Sunrise,
  Sunset,
  LocateFixed,
  RefreshCw,
  Leaf,
  Expand,
  Minimize,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

import { SelectedLocation } from '@/types/location';
import { useLanguage } from '@/src/context/LanguageContext';

// Read public API key available at build time for client usage.
// Set `NEXT_PUBLIC_WEATHER_API_KEY` in your environment if you need map/weather tiles requiring a key.
const API_KEY = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WEATHER_API_KEY : undefined;

// --- Helper Functions
const getWeatherIcon = (iconCode: string, size = 8) => {
  const props = { className: `w-${size} h-${size} text-white` };
  switch (iconCode) {
    case '01d':
      return <Sun {...props} />;
    case '01n':
      return <Moon {...props} />;
    case '02d':
      return <CloudSun {...props} />;
    case '02n':
      return <CloudMoon {...props} />;
    case '03d':
    case '03n':
      return <Cloud {...props} />;
    case '04d':
    case '04n':
      return <Cloud {...props} />;
    case '09d':
    case '09n':
      return <CloudDrizzle {...props} />;
    case '10d':
    case '10n':
      return <CloudRain {...props} />;
    case '11d':
    case '11n':
      return <Zap {...props} />;
    case '13d':
    case '13n':
      return <Snowflake {...props} />;
    case '50d':
    case '50n':
      return <CloudFog {...props} />;
    default:
      return <Cloud {...props} />;
  }
};
const formatDay = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
  });
};

// --- Data & Komponen Statis ---
// Local components removed (RegionDropdown, Region, regionData) to use shared ones.

const MapUpdater = ({
  center,
  zoom,
}: {
  center: any;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};


// --- Display Components (Changes) ---
interface WeatherDisplayProps {
  data: {
    current: any;
    daily: any[];
  } | null;
  loading: boolean;
  error: string | null;
}

const WeatherDisplay = ({ data, loading, error }: WeatherDisplayProps) => {
  const { t, lang } = useLanguage();

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        <CardContent>
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-slate-400">{t('weather.loadingData')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        <CardContent>
          <Alert
            variant="destructive"
            className="flex items-center space-x-3 p-4 rounded-xl border bg-red-900/20 border-red-500/50 text-red-400"
          >
            <AlertTriangle className="w-5 h-5" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // ✅ FIX: Check data.current which now comes from the 2.5/weather endpoint
  if (!data || !data.current) {
    return (
      <Card className="border-slate-600/30 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        <CardContent>
          <div className="text-center py-8">
            <Cloud className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {t('weather.selectLocation')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current } = data;
      // ✅ FIX: Convert celcius to Fahrenheit
  const tempF = current.main?.temp ? (current.main.temp * 9/5) + 32 : null;
  const feelsLikeF = current.main?.feels_like ? (current.main.feels_like * 9/5) + 32 : null;

  return (
    <Card className="bg-gradient-to-br from-white/60 to-slate-50/60 dark:from-slate-800/60 dark:to-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>{t('weather.currentWeather')}</span>
          <Badge
            variant="success"
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-green-600/20 text-green-400 border-green-500/30"
          >
            {t('weather.live')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              {getWeatherIcon(current.weather?.[0]?.icon || '', 10)}
            </div>
            <div>
              <div className="text-5xl font-bold text-slate-900 dark:text-white mb-1">
                {Math.round(current.main?.temp || 0)}°  
              </div>
              <div className="text-slate-300 capitalize">
                {current.weather?.[0]?.description || t('weather.unknown')}
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {t('weather.feelsLike')} {Math.round(current.main?.feels_like || 0)}°
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/20 flex items-center space-x-3">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('weather.humidity')}</span>
              <div className="font-semibold text-slate-900 dark:text-white">
                {current.main?.humidity ?? 'N/A'}%
              </div>
            </div>
          </div>
          <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/20 flex items-center space-x-3">
            <Wind className="w-5 h-5 text-green-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('weather.wind')}</span>
              <div className="font-semibold text-slate-900 dark:text-white">
                {current.wind?.speed !== undefined
                  ? `${current.wind.speed.toFixed(1)} m/s`
                  : 'N/A'}
              </div>
            </div>
          </div>
          <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/20 flex items-center space-x-3">
            <Gauge className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('weather.pressure')}</span>
              <div className="font-semibold text-slate-900 dark:text-white">
                {current.main?.pressure ?? 'N/A'} hPa
              </div>
            </div>
          </div>
          <div className="bg-slate-100/50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/20 flex items-center space-x-3">
            <Eye className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('weather.visibility')}</span>
              <div className="font-semibold text-slate-900 dark:text-white">
                {current.visibility !== undefined
                  ? `${(current.visibility / 1000).toFixed(1)} km`
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-around text-center text-sm">
          <div className="flex items-center space-x-2">
            <Sunrise className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{t('weather.sunrise')}</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {current.sys?.sunrise
                  ? new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  : 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sunset className="w-6 h-6 text-orange-500" />
            <div>
              <div className="text-xs text-slate-400">{t('weather.sunset')}</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {current.sys?.sunset
                  ? new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DailyForecastProps {
  data: {
    current: any;
    daily: any[];
  } | null;
  loading: boolean;
  error: string | null; // Added error prop
}

const DailyForecast = ({
  data,
  loading,
  error, // Destructure error prop
}: DailyForecastProps) => {
  const { t, lang } = useLanguage();

  // ✅ FIX: Check data.daily which now comes from endpoint 2.5/forecast
  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        <CardContent>
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-slate-400">{t('weather.loadingForecast')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        <CardContent>
          <Alert
            variant="destructive"
            className="flex items-center space-x-3 p-4 rounded-xl border bg-red-900/20 border-red-500/50 text-red-400"
          >
            <AlertTriangle className="w-5 h-5" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.daily) return null;

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          {/* ✅ FIX: Title becomes 5 days old */}
          <span>{t('weather.forecast5Days')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* ✅ FIX: Iterate data from new structure */}
        {data.daily.map((day: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-colors"
          >
            <span className="font-medium text-slate-700 dark:text-slate-300 w-1/4">
              {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'short',
              })}
            </span>
            <div className="w-1/4 flex justify-center">
              {getWeatherIcon(day.weather?.[0]?.icon || '', 6)}
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 w-1/4 text-center capitalize">
              {day.weather?.[0]?.description || 'N/A'}
            </span>
            <span className="font-mono text-sm text-slate-900 dark:text-white w-1/4 text-right">
              {((day.main?.temp_max ?? day.temp?.max ?? day.temp_max) !== undefined)
                ? `${Math.round(day.main?.temp_max ?? day.temp?.max ?? day.temp_max)}°`
                : 'N/A'}{' '}
              /{' '}
              {((day.main?.temp_min ?? day.temp?.min ?? day.temp_min) !== undefined)
                ? `${Math.round(day.main?.temp_min ?? day.temp?.min ?? day.temp_min)}°`
                : 'N/A'}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};



export default function WeatherForecastPage() {
  const { t, lang } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>({
    name: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    districtName: 'New York'
  });
  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>([
    40.7128, -74.0060,
  ]);
  const [currentMapZoom, setCurrentMapZoom] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchLocationError, setSearchLocationError] = useState<string | null>(
    null,
  );

  // `rawWeatherData` holds the Open‑Meteo CombinedWeatherData shape.
  const [rawWeatherData, setRawWeatherData] = useState<null | any>(null);
  // `legacyWeatherData` is a conservative adapter that matches the old OpenWeather-like UI shape.
  const [legacyWeatherData, setLegacyWeatherData] = useState<null | {
    current: any;
    daily: any;
    airQuality?: any;
  }>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(true);
  interface WeatherLayers {
    clouds: boolean;
    precipitation: boolean;
    temperature: boolean;
    wind: boolean;
    pressure: boolean;
  }

  const [weatherLayers, setWeatherLayers] = useState<WeatherLayers>({
    clouds: true,
    precipitation: false,
    temperature: false,
    wind: false,
    pressure: false,
  });

  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMapFullscreen) {
        setIsMapFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapFullscreen]);

  useEffect(() => {
    if (isMapFullscreen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMapFullscreen]);

  useEffect(() => {
    if (selectedLocation) {
      const fetchWeatherData = async () => {
        setLoadingWeather(true);
        setWeatherError(null);
        setRawWeatherData(null);
        setLegacyWeatherData(null);

        try {
          // Use the centralized server adapter (Open‑Meteo) to fetch combined weather data
          const om = await fetchWeatherFromServer(selectedLocation.latitude, selectedLocation.longitude);

          function mapOpenMeteoCodeToOWId(code: number | undefined) {
            if (code === undefined || code === null) return 800;
            if (code >= 95) return 200;
            if (code >= 80) return 500;
            if (code >= 60) return 600;
            if (code >= 51) return 300;
            if (code === 45 || code === 48) return 700;
            if (code === 0) return 800;
            if (code >= 1 && code <= 3) return 801;
            return 801;
          }

          function mapOpenMeteoCodeToDescription(code: number | undefined) {
            const map: { [k: number]: string } = {
              0: 'Clear sky',
              1: 'Mainly clear',
              2: 'Partly cloudy',
              3: 'Overcast',
              45: 'Fog',
              48: 'Rime fog',
              51: 'Light drizzle',
              53: 'Moderate drizzle',
              55: 'Dense drizzle',
              61: 'Slight rain',
              63: 'Moderate rain',
              65: 'Heavy rain',
              80: 'Rain showers',
              95: 'Thunderstorm',
            };
            return map[Number(code)] || 'Unknown';
          }

          const mappedCurrent = om.current
            ? {
                main: {
                  temp: Number(om.current.temperature ?? 0),
                  feels_like: Number(om.current.temperature ?? 0), // Open‑Meteo doesn't provide feels_like
                  humidity: undefined, // Not available in this endpoint; UI will show 'N/A'
                  pressure: undefined,
                },
                weather: [
                  {
                    id: mapOpenMeteoCodeToOWId(om.current.weathercode),
                    description: mapOpenMeteoCodeToDescription(om.current.weathercode),
                    icon: undefined,
                  },
                ],
                wind: {
                  speed: Number(om.current.windspeed ?? 0),
                  deg: Number(om.current.winddirection ?? 0),
                },
                dt: om.current.time ? Math.floor(new Date(om.current.time).getTime() / 1000) : undefined,
              }
            : null;

          const mappedDaily = Array.isArray(om.daily)
            ? om.daily.map((d: any) => ({
                dt: d.dt ? Math.floor(new Date(d.dt).getTime() / 1000) : undefined,
                temp: { max: d.temp_max ?? undefined, min: d.temp_min ?? undefined },
                precipitation: d.precipitation,
              }))
            : [];

          const mapped = { current: mappedCurrent, daily: mappedDaily, hourly: om.hourly || [] };

          setRawWeatherData(om);
          setLegacyWeatherData(mapped as any);
          setCurrentMapCenter([selectedLocation.latitude, selectedLocation.longitude]);
          setCurrentMapZoom(12);
        } catch (error: any) {
          console.error('Error fetching weather data:', error);
          const errorMessage =
            error.response?.data?.error ||
            t('weather.errors.fetchFailed');
          setWeatherError(errorMessage);
        } finally {
          setLoadingWeather(false);
        }
      };

      fetchWeatherData();
    }
  }, [selectedLocation, lang]);

  const handleRegionSelect = (location: SelectedLocation) => {
    setSelectedLocation(location);
    console.log('Selected location via RegionDropdown:', location);
  };

  const handleSearchLocation = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setSearchLocationError(t('weather.errors.searchEmpty'));
      return;
    }

    if (trimmedQuery.length < 2) {
      setSearchLocationError(
        t('weather.errors.searchShort'),
      );
      return;
    }

    if (trimmedQuery.length > 100) {
      setSearchLocationError(
        t('weather.errors.searchLong'),
      );
      return;
    }

    // Only allow letters, numbers, spaces, commas, periods, and hyphens
    const validCharactersRegex = /^[a-zA-Z0-9\s,.-]*$/;
    if (!validCharactersRegex.test(trimmedQuery)) {
      setSearchLocationError(
        t('weather.errors.searchInvalid'),
      );
      return;
    }

    // Use Nominatim (OpenStreetMap) for geocoding (no API key required)

    setIsSearchingLocation(true);
    setSearchLocationError(null);
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: trimmedQuery, format: 'json', addressdetails: 1, limit: 1, countrycodes: 'us' },
      });
      if (response.data && response.data.length > 0) {
        const r = response.data[0];
        const name = r.display_name || trimmedQuery;
        const lat = parseFloat(r.lat);
        const lon = parseFloat(r.lon);
        const newLocation: SelectedLocation = {
          name: name,
          latitude: lat,
          longitude: lon,
          districtName: name,
        };
        setSelectedLocation(newLocation);
        console.log('Selected location via search:', newLocation);
        setSearchQuery('');
      } else {
        setSearchLocationError(t('weather.errors.locationNotFound').replace('{query}', trimmedQuery));
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      setSearchLocationError(t('weather.errors.searchFailed'));
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSearchingLocation(true);
            navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
              params: { lat: latitude, lon: longitude, format: 'json', addressdetails: 1 },
            });
            const name = response.data?.display_name || 'Current Location';
            setSelectedLocation({
              name: name,
              latitude: latitude,
              longitude: longitude,
              districtName: name,
            });
          } catch (error) {
            setSearchLocationError(t('weather.errors.getLocationFailed'));
            setSelectedLocation({
              name: 'Current Location',
              latitude: latitude,
              longitude: longitude,
              districtName: 'Current Location',
            });
          } finally {
            setIsSearchingLocation(false);
          }
        },
        (error) => {
          setSearchLocationError(
            t('weather.errors.geolocationFailed'),
          );
          setIsSearchingLocation(false);
        },
      );
    } else {
      setSearchLocationError(t('weather.errors.geolocationUnsupported'));
    }
  };

  const toggleWeatherLayer = (layerName: string) => {
    setWeatherLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName as keyof WeatherLayers],
    }));
  };

  const weatherLayerConfigs = [
    {
      key: 'clouds',
      label: t('weather.layers.clouds'),
      icon: Cloud,
      color: 'text-gray-400',
      description: t('weather.layers.cloudCover'),
    },
    {
      key: 'precipitation',
      label: t('weather.layers.precipitation'),
      icon: CloudRain,
      color: 'text-blue-400',
      description: t('weather.layers.rainIntensity'),
    },
    {
      key: 'temperature',
      label: t('weather.layers.temperature'),
      icon: Thermometer,
      color: 'text-red-400',
      description: t('weather.layers.tempDistribution'),
    },
    {
      key: 'wind',
      label: t('weather.layers.wind'),
      icon: Wind,
      color: 'text-green-400',
      description: t('weather.layers.windSpeed'),
    },
    {
      key: 'pressure',
      label: t('weather.layers.pressure'),
      icon: Gauge,
      color: 'text-purple-400',
      description: t('weather.layers.atmPressure'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg">
                <CloudSun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-600 dark:from-white dark:via-blue-100 dark:to-cyan-100 bg-clip-text text-transparent">
                  {t('weather.pageTitle')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs hidden md:block">
                  {t('weather.pageSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="success"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-green-600/20 text-green-400 border-green-500/30"
              >
                <Wifi className="w-3 h-3 mr-1.5" />
                {t('weather.statusOnline')}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  selectedLocation && handleRegionSelect(selectedLocation)
                }
                className="w-10 h-10 inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 bg-transparent hover:bg-slate-700/30 text-slate-300 hover:text-white p-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loadingWeather ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
                  <Search className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span>{t('weather.searchLocation')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Input
                    placeholder={t('weather.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleSearchLocation()
                    }
                    disabled={isSearchingLocation}
                    className="pl-4 w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                  {isSearchingLocation && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSearchLocation}
                    disabled={isSearchingLocation || !searchQuery.trim()}
                    className="w-full inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 px-4 py-2 text-sm"
                  >
                    <Search className="w-4 h-4 mr-2" /> {t('weather.searchButton')}
                  </Button>
                  <Button
                    onClick={handleGetCurrentLocation}
                    variant="outline"
                    size="icon"
                    disabled={isSearchingLocation}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 border border-slate-600 bg-transparent hover:bg-slate-700/30 text-slate-300 hover:text-white p-2"
                  >
                    <LocateFixed className="w-4 h-4" />
                  </Button>
                </div>
                {searchLocationError && (
                  <Alert
                    variant="destructive"
                    className="p-4 rounded-xl border bg-red-900/20 border-red-500/50 text-red-400"
                  >
                    <AlertDescription className="text-sm">
                      {searchLocationError}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>



            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <span>{t('weather.mapLayers')}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700/30 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent className="space-y-3">
                      {weatherLayerConfigs.map((layer) => (
                        <div
                          key={layer.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-700/20 border border-slate-200/50 dark:border-slate-600/20"
                        >
                          <div className="flex items-center space-x-3">
                            <layer.icon className={`w-4 h-4 ${layer.color}`} />
                            <div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                {layer.label}
                              </span>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {layer.description}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={
                              weatherLayers[layer.key as keyof WeatherLayers]
                            }
                            onCheckedChange={() =>
                              toggleWeatherLayer(layer.key)
                            }
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={
              isMapFullscreen
                ? 'fixed inset-0 z-50 w-screen h-screen bg-slate-900'
                : 'lg:col-span-5'
            }
          >
            <Card
              className={`h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl ${isMapFullscreen ? 'rounded-none' : 'rounded-2xl'}`}
            >
              <CardHeader className="bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2 truncate">
                    <Globe className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <span className="truncate">
                      {selectedLocation?.name || t('weather.interactiveMap')}
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                <Button
                  onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                  variant="outline"
                  size="icon"
                  className="absolute top-[78px] left-[10px] z-[1000] w-8 h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-lg"
                  aria-label={
                    isMapFullscreen
                      ? t('weather.exitFullscreen')
                      : t('weather.enterFullscreen')
                  }
                >
                  {isMapFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Expand className="w-4 h-4" />
                  )}
                </Button>
                <div
                  className={`${isMapFullscreen ? 'h-screen' : 'h-[500px] lg:h-[calc(100vh-140px)]'} bg-slate-900`}
                >
                  <WeatherMap
                    key={isMapFullscreen ? 'fullscreen' : 'normal'}
                    center={currentMapCenter}
                    zoom={currentMapZoom}
                    weatherLayers={weatherLayers}
                    selectedLocation={selectedLocation}
                    apiKey={API_KEY}
                    onToggleLayer={toggleWeatherLayer}
                    currentWeatherData={rawWeatherData}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-6"
          >
            <WeatherDisplay
              data={legacyWeatherData}
              loading={loadingWeather}
              error={weatherError}
            />
            <DailyForecast
              data={legacyWeatherData}
              loading={loadingWeather}
              error={weatherError}
            />
            {legacyWeatherData?.airQuality && (
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-500 dark:text-white" />
                    {/* Fix: use airQuality.title directly if it is root, OR check i18 structure. */}
                    <span>{t('airQuality.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Wind className="w-12 h-12 text-slate-900 dark:text-white" />
                      <div className="ml-4">
                        <p className="text-5xl font-bold text-slate-900 dark:text-white">
                          AQI: {legacyWeatherData.airQuality.aqi}
                        </p>
                        <p className="text-md text-slate-500 dark:text-gray-300">
                          {t('airQuality.level')}: {t(`airQuality.${legacyWeatherData.airQuality.level}`)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400 text-right">
                      {t('airQuality.mainPollutant')}: {legacyWeatherData.airQuality.pollutant}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-200 border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                    {t('airQuality.recommendation')}: {t(`airQuality.${legacyWeatherData.airQuality.recommendation}`)}
                  </p>
                </CardContent>
              </Card>
            )}
            {selectedLocation && (
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
                    <Compass className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                    <span>{t('weather.locationInfo')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700/30">
                    <span className="text-slate-500 dark:text-slate-400">{t('weather.latitude')}</span>
                    <span className="text-slate-900 dark:text-white font-medium font-mono">
                      {selectedLocation.latitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500 dark:text-slate-400">{t('weather.longitude')}</span>
                    <span className="text-slate-900 dark:text-white font-medium font-mono">
                      {selectedLocation.longitude.toFixed(4)}°
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
