import { CloudSun, Sun, CloudRain, Cloud, Thermometer, Droplets, Wind, Eye, Gauge, Sunrise as SunriseIcon, Sunset as SunsetIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/src/context/LanguageContext';

interface WeatherSummaryCardProps {
  weatherSummary: {
    location: string;
    current: {
      temperature: number;
      condition: string;
      icon: string;
      humidity?: number;
      pressure?: number;
      windspeed?: number;
      visibility?: number;
    };
    forecast: Array<{
      time: string;
      temperature: number;
      condition: string;
    }>;
    sunrise?: string;
    sunset?: string;
  };
}

const getWeatherIcon = (iconName: string, size: string = "w-6 h-6") => {
  switch (iconName) {
    case 'cloud-sun':
      return <CloudSun className={`${size} text-blue-400`} />;
    case 'Bright':
      return <Sun className={`${size} text-yellow-400`} />;
    case 'Light Rain':
      return <CloudRain className={`${size} text-blue-500`} />;
    case 'Cloudy':
      return <Cloud className={`${size} text-gray-400`} />;
    default:
      return <CloudSun className={`${size} text-blue-400`} />;
  }
};

export function WeatherSummaryCard({ weatherSummary }: WeatherSummaryCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/50 backdrop-blur-lg rounded-xl shadow-lg dark:shadow-xl overflow-hidden text-slate-900 dark:text-white transition-all duration-300">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <Thermometer className="h-5 w-5 text-primary" />
          <span>{t('sidebar.weatherForecast')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          {weatherSummary.current && (
            <div className="flex items-center">
              {getWeatherIcon(weatherSummary.current.icon, "w-12 h-12")}
              <div className="ml-4">
                <p className="text-5xl font-bold text-slate-900 dark:text-white">{weatherSummary.current.temperature}°</p>
                <p className="text-md text-slate-600 dark:text-slate-300">{weatherSummary.current.condition}</p>
              </div>
            </div>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400 text-right">{weatherSummary.location}</p>
        </div>
        
        {/* Current Weather Details */}
        {weatherSummary.current && (
          <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            {weatherSummary.current.humidity != null && (
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{weatherSummary.current.humidity}%</p>
                </div>
              </div>
            )}
            {weatherSummary.current.pressure != null && (
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pressure</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{weatherSummary.current.pressure} hPa</p>
                </div>
              </div>
            )}
            {weatherSummary.current.windspeed != null && (
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-teal-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Wind</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{weatherSummary.current.windspeed} mph</p>
                </div>
              </div>
            )}
            {weatherSummary.current.visibility != null && (
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-cyan-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Visibility</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{weatherSummary.current.visibility} km</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Sunrise/Sunset */}
        {(weatherSummary.sunrise || weatherSummary.sunset) && (
          <div className="flex items-center justify-around mb-4 p-2 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-lg">
            {weatherSummary.sunrise && weatherSummary.sunrise !== 'N/A' && (
              <div className="flex items-center space-x-2">
                <SunriseIcon className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sunrise</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{weatherSummary.sunrise}</p>
                </div>
              </div>
            )}
            {weatherSummary.sunset && weatherSummary.sunset !== 'N/A' && (
              <div className="flex items-center space-x-2">
                <SunsetIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sunset</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{weatherSummary.sunset}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {weatherSummary.forecast && weatherSummary.forecast.length > 0 && (
          <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
            {weatherSummary.forecast.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">{item.time}</p>
                {getWeatherIcon(item.condition, "w-5 h-5")}
                <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{item.temperature}°</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
