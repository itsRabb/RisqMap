'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  Gauge,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/lib/api';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Open‑Meteo current shape (simplified)
interface OpenMeteoCurrent {
  temperature: number;
  windspeed: number;
  winddirection?: number;
  weathercode?: number;
  time: string;
}

interface CombinedWeatherData {
  current: OpenMeteoCurrent | null;
  daily: Array<{ dt: string; temp_max?: number; temp_min?: number; precipitation?: number }>;
  hourly?: Array<{ timestamp: string; precipitation: number }>;
}

interface WeatherLayers {
  clouds: boolean;
  precipitation: boolean;
  temperature: boolean;
  wind: boolean;
  pressure: boolean;
}

import { SelectedLocation } from '@/types/location';

/**
 * Props for the WeatherMap component.
 * @property apiKey This API key is intended for public client-side use (e.g., for tile map services).
 *                  It should be a `NEXT_PUBLIC_` prefixed environment variable and configured with appropriate domain restrictions
 *                  on the service provider's side (e.g., tile provider).
 */
interface WeatherMapProps {
  center: [number, number];
  zoom: number;
  weatherLayers: WeatherLayers;
  selectedLocation: SelectedLocation | null;
  currentWeatherData: CombinedWeatherData | null; // Use CombinedWeatherData
  className?: string;
  onToggleLayer: (layerType: keyof WeatherLayers) => void;
  apiKey?: string;
}

// Custom weather marker icon
const createWeatherIcon = (weathercode?: number) => {
  let emoji = '☁️';
  // Map Open‑Meteo weathercode to emoji (simplified)
  if (weathercode !== undefined && weathercode !== null) {
    if (weathercode === 0) emoji = '☀️';
    else if (weathercode === 1 || weathercode === 2 || weathercode === 3) emoji = '🌤️';
    else if (weathercode === 45 || weathercode === 48) emoji = '🌫️';
    else if (weathercode >= 51 && weathercode <= 67) emoji = '🌦️';
    else if (weathercode >= 71 && weathercode <= 77) emoji = '🌨️';
    else if (weathercode >= 80 && weathercode <= 82) emoji = '🌧️';
    else if (weathercode >= 95) emoji = '⛈️';
  }

  const svgString = `
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="14" fill="rgba(59, 130, 246, 0.9)" stroke="white" stroke-width="2"/>
      <text x="15" y="20" text-anchor="middle" fill="white" font-size="16">${emoji}</text>
    </svg>
  `;

  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));

  return new (L as any).Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Component to update map view
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const isCenterChanged =
      currentCenter.lat !== center[0] || currentCenter.lng !== center[1];
    const isZoomChanged = currentZoom !== zoom;

    if (isCenterChanged || isZoomChanged) {
      map.setView(center, zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [center, zoom, map]);

  return null;
}

// Map reset component
function MapReset({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  const resetView = () => {
    map.setView(center, zoom, {
      animate: true,
      duration: 0.5,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={resetView}
      className="absolute top-4 right-16 z-[1000] bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80"
    >
      <RotateCcw size={16} className="text-white" />
    </Button>
  );
}

// Weather layer tile component
function WeatherLayers({ layers }: { layers: WeatherLayers }) {
  const map = useMap();

  useEffect(() => {
    // Open‑Meteo does not provide raster tile overlays.
    // Legacy raster tile overlays have been removed.
    // Keep this component as a no-op for now. TODO: implement vector overlays
    // or another provider if raster overlays are required.
    return () => {};
  }, [layers, map]);

  return null;
}

export function WeatherMap({
  center,
  zoom,
  weatherLayers,
  selectedLocation,
  currentWeatherData,
  className,
  onToggleLayer,
}: WeatherMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<any | null>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative rounded-lg overflow-hidden shadow-lg',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className,
      )}
      style={{ height: isFullscreen ? '100vh' : '100%' }}
    >
      <MapContainer
        {...{
          center: center as any,
          zoom: zoom,
          scrollWheelZoom: true,
          className: "w-full h-full",
          ref: mapRef as any,
          zoomControl: false,
        } as any}
      >
        {/* Base tile layer */}
        <TileLayer
          {...{
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          } as any}
        />

        {/* Weather layers */}
        <WeatherLayers layers={weatherLayers} />

        {/* Map updater */}
        <MapUpdater center={center} zoom={zoom} />

        {/* Map reset button */}
        <MapReset center={DEFAULT_MAP_CENTER} zoom={DEFAULT_MAP_ZOOM} />

        {/* Location marker */}
        {selectedLocation?.latitude && selectedLocation?.longitude && (
          <Marker
            {...{
              position: [selectedLocation.latitude, selectedLocation.longitude],
              icon: createWeatherIcon(currentWeatherData?.current?.weathercode),
            } as any}
          >
            <Popup>
              <Card className="min-w-[250px] p-4 border-0 shadow-none">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">
                      {selectedLocation?.name || 'Unknown location'}
                    </h3>
                    <Badge variant="secondary">Live</Badge>
                  </div>

                  {currentWeatherData?.current ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {createWeatherIcon(currentWeatherData.current?.weathercode)?.options?.iconUrl ? (
                            <img src={createWeatherIcon(currentWeatherData.current?.weathercode).options.iconUrl} alt="icon" />
                          ) : (
                            '☁️'
                          )}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-blue-600">
                            {Math.round(currentWeatherData.current.temperature || 0)}
                            °
                          </div>
                          <div className="text-sm text-slate-600 capitalize">
                            {`Weather code: ${currentWeatherData.current.weathercode ?? 'N/A'}`}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <span>
                            Temperature: {Math.round(currentWeatherData.current.temperature || 0)}°
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Cloud className="w-4 h-4 text-gray-500" />
                          <span>
                            Wind: {Math.round(currentWeatherData.current.windspeed || 0)} km/h
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-green-500" />
                          <span>
                            Wind Dir: {Math.round(currentWeatherData.current.winddirection || 0)}°
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Gauge className="w-4 h-4 text-purple-500" />
                          <span>
                            Precip: {(() => {
                              // Attempt to find nearest hourly precipitation to current time
                              const now = currentWeatherData.current?.time;
                              if (!now || !currentWeatherData.hourly) return 'N/A';
                              const found = currentWeatherData.hourly.find(h => h.timestamp === now);
                              return found ? `${found.precipitation} mm` : 'N/A';
                            })()}
                          </span>
                        </div>
                      </div>
                      {/* No legacy raster provider rain field; precipitation shown above from Open‑Meteo hourly data when available */}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600">
                      Weather data not available
                    </div>
                  )}

                  <div className="text-xs text-slate-500 border-t pt-2">
                    Lat: {selectedLocation?.latitude?.toFixed(4) || 'N/A'}, Lng:{' '}
                    {selectedLocation?.longitude?.toFixed(4) || 'N/A'}
                  </div>
                </div>
              </Card>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Fullscreen toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-[1000] bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80"
      >
        {isFullscreen ? (
          <Minimize2 size={16} className="text-white" />
        ) : (
          <Maximize2 size={16} className="text-white" />
        )}
      </Button>

      {/* Weather layer toggles */}
      <div className="absolute top-4 right-20 z-[1000] flex flex-col space-y-2">
        {Object.entries(weatherLayers).map(([layerType, isActive]) => {
          const IconComponent = {
            clouds: Cloud,
            precipitation: CloudRain,
            temperature: Thermometer,
            wind: Wind,
            pressure: Gauge,
          }[layerType as keyof WeatherLayers];
          const label = {
            clouds: 'Clouds',
            precipitation: 'Precipitation',
            temperature: 'Temperature',
            wind: 'Wind',
            pressure: 'Pressure',
          }[layerType as keyof WeatherLayers];

          return (
            <Button
              key={layerType}
              variant="ghost"
              size="icon"
              onClick={() => onToggleLayer(layerType as keyof WeatherLayers)}
              className={cn(
                'bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80',
                isActive ? 'bg-blue-500/20 border-blue-500/30' : '',
              )}
              title={`Toggle ${label} Layer`}
            >
              {IconComponent && (
                <IconComponent size={16} className="text-white" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Active layers indicator */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Card className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-3">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-white">Active Layers:</h4>
            <div className="flex flex-wrap gap-1">
              {Object.entries(weatherLayers)
                .filter(([_, isActive]) => isActive)
                .map(([layerType, _]) => {
                  const layerNames = {
                    clouds: 'Clouds',
                    precipitation: 'Precipitation',
                    temperature: 'Temperature',
                    wind: 'Wind',
                    pressure: 'Pressure',
                  };
                  return (
                    <Badge
                      key={layerType}
                      variant="secondary"
                      className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30"
                    >
                      {layerNames[layerType as keyof typeof layerNames]}
                    </Badge>
                  );
                })}
              {Object.values(weatherLayers).every((v) => !v) && (
                <Badge variant="outline" className="text-xs text-slate-400">
                  No active layers
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
