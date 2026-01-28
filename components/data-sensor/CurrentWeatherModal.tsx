'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Loader2, AlertCircle, Cloud, Droplets, Wind, Thermometer, Eye, Clock } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { format } from 'date-fns';
import { useLanguage } from '@/src/context/LanguageContext';

const CurrentWeatherModal = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { weatherData, isLoading, error, fetchWeather } = useWeatherData();

  useEffect(() => {
    if (isOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (geoError) => {
            console.error("Error getting geolocation:", geoError);
            alert("Failed to get your location. Make sure GPS is enabled and grant location permissions.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  }, [isOpen, fetchWeather]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start text-left">
          <Cloud className="mr-2 h-4 w-4" />
          {t('currentWeather.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('currentWeather.title')}</DialogTitle>
          <DialogDescription>
            {t('currentWeather.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-3" />
              <p className="text-gray-400">{t('currentWeather.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-400">{t('currentWeather.error').replace('{error}', error)}</p>
            </div>
          ) : weatherData ? (
            <div className="space-y-4">
              <div className="text-center">
                {(() => {
                  const cur: any = weatherData.current || {};
                  const temp = cur.main?.temp ?? cur.temperature ?? cur.temp ?? 0;
                  const desc = cur.weather?.[0]?.description ?? cur.description ?? '';
                  return (
                    <>
                      <p className="text-gray-400 text-sm">{t('currentWeather.location').replace('{name}', cur.name ?? '')}</p>
                      <div className="text-5xl font-bold text-white mt-2">{Math.round(temp)}°</div>
                      <p className="text-gray-400 text-lg">{desc}</p>
                    </>
                  );
                })()}
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Droplets className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-white">{((weatherData.current as any).main?.humidity ?? (weatherData.current as any).relativehumidity_2m ?? (weatherData.current as any).humidity) ?? 'N/A'}%</p>
                  <p className="text-xs text-gray-400">{t('currentWeather.humidity')}</p>
                </div>
                <div>
                  <Wind className="h-6 w-6 text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-white">{((weatherData.current as any).wind?.speed ?? (weatherData.current as any).windspeed) ?? 'N/A'} m/s</p>
                  <p className="text-xs text-gray-400">{t('currentWeather.wind')}</p>
                </div>
                <div>
                  <Thermometer className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-white">{((weatherData.current as any).main?.pressure ?? (weatherData.current as any).pressure) ?? 'N/A'} hPa</p>
                  <p className="text-xs text-gray-400">{t('currentWeather.pressure')}</p>
                </div>
                <div>
                  <Eye className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-white">{((weatherData.current as any).visibility ? (weatherData.current as any).visibility / 1000 : (weatherData.current as any).visibility_km ?? 'N/A')} km</p>
                  <p className="text-xs text-gray-400">{t('currentWeather.visibility')}</p>
                </div>
                <div>
                  <Clock className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-white">{(weatherData.current as any).sys?.sunrise ? format(new Date((weatherData.current as any).sys.sunrise * 1000), 'HH:mm') : 'N/A'}</p>
                  <p className="text-xs text-gray-400">{t('currentWeather.sunrise')}</p>
                </div>
                <div>
                  <Clock className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-white">{(weatherData.current as any).sys?.sunset ? format(new Date((weatherData.current as any).sys.sunset * 1000), 'HH:mm') : 'N/A'}</p>
                  <p className="text-xs text-gray-400">{t('currentWeather.sunset')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">{t('currentWeather.unavailable')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CurrentWeatherModal;
