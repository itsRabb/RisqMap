/**
 * Flood Forecast Component
 * Displays 7-day NOAA AHPS flood predictions for major rivers
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FloodForecastData {
  gageId: string;
  name: string;
  state: string;
  currentStage: number;
  floodStage: number;
  forecast: Array<{
    timestamp: string;
    stage: number;
    floodCategory: 'none' | 'action' | 'minor' | 'moderate' | 'major';
  }>;
}

export function FloodForecast() {
  const [forecasts, setForecasts] = useState<FloodForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    totalGages: number;
    inFlood: number;
    predicted24h: number;
    predicted7d: number;
  } | null>(null);

  useEffect(() => {
    fetchFloodForecasts();
  }, []);

  async function fetchFloodForecasts() {
    try {
      const response = await fetch('/api/flood-forecast');
      const data = await response.json();
      setForecasts(data.forecasts || []);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching flood forecasts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Flood Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{summary.totalGages}</div>
            <p className="text-sm text-muted-foreground">Monitoring Stations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{summary.inFlood}</div>
            <p className="text-sm text-muted-foreground">Currently in Flood</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{summary.predicted24h}</div>
            <p className="text-sm text-muted-foreground">Forecast 24h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{summary.predicted7d}</div>
            <p className="text-sm text-muted-foreground">Forecast 7 Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Flood Forecasts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forecasts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active flood forecasts at this time.</p>
          ) : (
            <div className="space-y-4">
              {forecasts.map(forecast => {
                const trend = getTrend(forecast);
                const severity = getSeverity(forecast);
                
                return (
                  <div key={forecast.gageId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{forecast.name}</h3>
                        <p className="text-sm text-muted-foreground">{forecast.state}</p>
                      </div>
                      <Badge variant={severity.variant as any}>
                        {severity.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stage</p>
                        <p className="text-lg font-semibold">
                          {forecast.currentStage.toFixed(1)} ft
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Flood Stage</p>
                        <p className="text-lg font-semibold">
                          {forecast.floodStage.toFixed(1)} ft
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Trend</p>
                        <div className="flex items-center gap-1 text-lg font-semibold">
                          {trend.icon}
                          <span>{trend.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mini forecast chart */}
                    <div className="mt-4">
                      <div className="flex items-end gap-1 h-16">
                        {forecast.forecast.slice(0, 7).map((point, idx) => {
                          const heightPct = Math.min(
                            (point.stage / (forecast.floodStage * 1.5)) * 100,
                            100
                          );
                          const isAboveFlood = point.stage >= forecast.floodStage;
                          
                          return (
                            <div
                              key={idx}
                              className="flex-1 relative group cursor-pointer"
                            >
                              <div
                                className={`w-full rounded-t transition-all ${
                                  isAboveFlood ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ height: `${heightPct}%` }}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                {point.stage.toFixed(1)} ft
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Now</span>
                        <span>7 Days</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getTrend(forecast: FloodForecastData) {
  if (forecast.forecast.length < 2) {
    return { icon: <Minus className="h-4 w-4" />, label: 'Stable' };
  }
  
  const current = forecast.currentStage;
  const future = forecast.forecast[forecast.forecast.length - 1].stage;
  const diff = future - current;
  
  if (diff > 1) {
    return { icon: <TrendingUp className="h-4 w-4 text-red-500" />, label: 'Rising' };
  } else if (diff < -1) {
    return { icon: <TrendingDown className="h-4 w-4 text-green-500" />, label: 'Falling' };
  }
  
  return { icon: <Minus className="h-4 w-4" />, label: 'Stable' };
}

function getSeverity(forecast: FloodForecastData) {
  const current = forecast.currentStage;
  const floodStage = forecast.floodStage;
  
  if (current >= floodStage * 1.5) {
    return { label: 'Major Flood', variant: 'destructive' };
  } else if (current >= floodStage * 1.2) {
    return { label: 'Moderate Flood', variant: 'destructive' };
  } else if (current >= floodStage) {
    return { label: 'Minor Flood', variant: 'warning' };
  } else if (current >= floodStage * 0.9) {
    return { label: 'Near Flood Stage', variant: 'warning' };
  }
  
  return { label: 'Normal', variant: 'secondary' };
}
