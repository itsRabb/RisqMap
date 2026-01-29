'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import {
  Loader2,
  Wind,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Thermometer,
  RefreshCw,
  AlertTriangle,
  Gauge,
  MapPin,
  X,
} from 'lucide-react';
import { fetchWeatherFromServer } from '@/lib/api.client';

interface WeatherMapPopupProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
}

export default function WeatherMapPopup({ latitude, longitude, onClose }: WeatherMapPopupProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<any | null>(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherFromServer(latitude, longitude);
      const current = data.current || null;
      let humidity = 0;
      if (data?.hourly && (data as any).hourly.time && (data as any).hourly.relativehumidity_2m && current?.time) {
        const idx = (data as any).hourly.time.indexOf(current.time);
        if (idx >= 0) humidity = (data as any).hourly.relativehumidity_2m[idx] ?? 0;
      }

      const owId = mapOpenMeteoCodeToOWId(current?.weathercode);
      const mapped = {
        name: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        weather: [
          {
            id: owId,
            description: mapOpenMeteoCodeToDescription(current?.weathercode),
          },
        ],
        main: {
          temp: Number(current?.temperature ?? 0),
          feels_like: Number(current?.temperature ?? 0),
          humidity: Number(humidity ?? 0),
          pressure: 0,
        },
        wind: {
          speed: Number(current?.windspeed ?? 0),
        },
      };

      setWeather(mapped);
    } catch (err: any) {
      setError('Failed to fetch weather data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers for mapping Open-Meteo weathercode to legacy weather id/description
  function mapOpenMeteoCodeToOWId(code: number | undefined) {
    if (!code && code !== 0) return 800;
    if (code >= 95) return 200; // thunder
    if (code >= 80) return 500; // rain
    if (code >= 60) return 600; // snow-ish
    if (code >= 51) return 300; // drizzle
    if (code === 45 || code === 48) return 700; // fog
    if (code === 0) return 800; // clear
    if (code >= 1 && code <= 3) return 801; // partly cloudy
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

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

  const getWeatherIcon = (weatherId: number) => {
    const iconProps = {
      className: 'w-12 h-12 drop-shadow-lg transition-all duration-300 hover:scale-110',
    };
    if (weatherId >= 200 && weatherId < 300)
      return (
        <CloudLightning
          {...iconProps}
          className={`${iconProps.className} text-yellow-400 animate-pulse`}
        />
      );
    if (weatherId >= 300 && weatherId < 600)
      return (
        <CloudRain
          {...iconProps}
          className={`${iconProps.className} text-blue-400`}
        />
      );
    if (weatherId >= 600 && weatherId < 700)
      return (
        <CloudSnow
          {...iconProps}
          className={`${iconProps.className} text-blue-200`}
        />
      );
    if (weatherId >= 700 && weatherId < 800)
      return (
        <Cloud
          {...iconProps}
          className={`${iconProps.className} text-gray-400`}
        />
      );
    if (weatherId === 800)
      return (
        <Sun
          {...iconProps}
          className={`${iconProps.className} text-yellow-400 animate-spin`}
          style={{ animationDuration: '20s' }}
        />
      );
    return (
      <Cloud
        {...iconProps}
        className={`${iconProps.className} text-gray-300`}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading weather...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchWeatherData}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Retry
          </Button>
        </div>
      );
    }

    if (weather) {
      return (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {weather.name}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Weather Icon and Description */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold capitalize">
                {weather.weather[0].description}
              </p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              {getWeatherIcon(weather.weather[0].id)}
            </div>
          </div>

          {/* Temperature */}
          <div className="text-center py-2">
            <span className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {weather.main.temp.toFixed(0)}°
            </span>
            <p className="text-xs text-muted-foreground mt-1">Current temperature</p>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Feels like</span>
              </div>
              <p className="text-lg font-semibold">{weather.main.feels_like.toFixed(1)}°</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Wind</span>
              </div>
              <p className="text-lg font-semibold">{weather.wind.speed} m/s</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Humidity</span>
              </div>
              <p className="text-lg font-semibold">{weather.main.humidity}%</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Pressure</span>
              </div>
              <p className="text-lg font-semibold">{weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-80 backdrop-blur-md bg-background/95 border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Weather Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
}