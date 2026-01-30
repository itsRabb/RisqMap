// src/components/dashboard/DashboardStats.tsx
'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Bell,
  Shield,
  Users,
  Activity, // Used for System Status (Monitoring Aktif)
  Clock, // Used for Recent Activity
  Waves, // Icon for water, might be used for pumps as well
  Gauge,
  ArrowUp,
  ArrowDown,
  Loader2, // Icon spinner
  CheckCircle, // Icon for status 'Online' atau 'Operate'
  XCircle, // Icon for status 'Not Operating' atau 'Damaged'
  AlertTriangle, // Icon for warning
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getTimeAgo } from '@/lib/utils';

// Import for API data
import { WaterLevelPost, PumpData } from '@/lib/api'; // === IMPORT NEW: PumpData ===

// Definisi props for DashboardStats
interface DashboardStatsProps {
  stats: {
    totalRegions: number;
    activeAlerts: number;
    floodZones: number;
    peopleAtRisk: number;
    weatherStations: number;
    lastUpdate: string;
  };
  percentChanges?: {
    totalRegions: number;
    activeAlerts: number;
    floodZones: number;
    peopleAtRisk: number;
    weatherStations: number;
  };
  // PROPS for DATA Public Works and Housing
  waterLevelPosts: WaterLevelPost[];
  loadingWaterLevel: boolean;
  waterLevelError: string | null;
  // === PROPS NEW for DATA FLOOD PUMP ===
  pumpStatusData: PumpData[];
  loadingPumpStatus: boolean;
  pumpStatusError: string | null;
  className?: string;
}

export function DashboardStats({
  stats,
  percentChanges,
  waterLevelPosts,
  loadingWaterLevel,
  waterLevelError,
  pumpStatusData, // Receiving flood pump data
  loadingPumpStatus, // Receiving flood pump loading status
  pumpStatusError, // Receiving flood pump error status
  className,
}: DashboardStatsProps) {
  const getStatusLabel = (status: string) => {
    if (!status) return '';
    if (status.toLowerCase().includes('danger')) return 'Danger';
    if (status.toLowerCase().includes('alert 3')) return 'Alert 3';
    if (status.toLowerCase().includes('alert 2')) return 'Alert 2';
    if (status.toLowerCase().includes('alert 1')) return 'Alert 1';
    if (status.toLowerCase().includes('normal')) return 'Normal';
    return status;
  };

  // === LOGIC for CALCULATING PUMP STATUS ===
  // Correctly classify pump statuses using normalized conditions
  const totalPumps = pumpStatusData.length;
  const activePumps = pumpStatusData.filter(
    (pump) =>
      (pump as any).building_condition &&
      (pump as any).building_condition.toLowerCase().includes('active')
  ).length;
  const pumpsInMaintenance = pumpStatusData.filter(
    (pump) =>
      (pump as any).building_condition &&
      (pump as any).building_condition.toLowerCase().includes('maintenance')
  ).length;
  const offlinePumps = pumpStatusData.filter(
    (pump) =>
      (pump as any).building_condition &&
      (pump as any).building_condition.toLowerCase().includes('offline')
  ).length;
  
  // Pumps needing attention = maintenance + offline
  const pumpsNeedingMaintenance = pumpsInMaintenance + offlinePumps;

  const getPumpStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('active'))
      return <Badge variant="success">Operating</Badge>;
    if (normalized.includes('maintenance'))
      return <Badge variant="warning">Maintenance</Badge>;
    if (normalized.includes('offline'))
      return <Badge variant="danger">Offline</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const statsConfig = [
    {
      title: 'Total Regions',
      value: stats.totalRegions,
      unit: '',
      icon: MapPin,
      color: 'text-blue-500',
      change: percentChanges?.totalRegions ? `${Math.abs(percentChanges.totalRegions)}%` : null,
      changeType: percentChanges?.totalRegions && percentChanges.totalRegions >= 0 ? 'up' : 'down',
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts,
      unit: '',
      icon: Bell,
      color: 'text-yellow-500',
      change: percentChanges?.activeAlerts ? `${Math.abs(percentChanges.activeAlerts)}%` : null,
      changeType: percentChanges?.activeAlerts && percentChanges.activeAlerts < 0 ? 'down' : 'up',
    },
    {
      title: 'Flood Zones',
      value: stats.floodZones,
      unit: '',
      icon: Shield,
      color: 'text-red-500',
      change: percentChanges?.floodZones ? `${Math.abs(percentChanges.floodZones)}%` : null,
      changeType: percentChanges?.floodZones && percentChanges.floodZones >= 0 ? 'up' : 'down',
    },
    {
      title: 'People at Risk',
      value: stats.peopleAtRisk >= 1000000 
        ? `${(stats.peopleAtRisk / 1000000).toFixed(1)}M`
        : stats.peopleAtRisk >= 1000
        ? `${(stats.peopleAtRisk / 1000).toFixed(1)}K`
        : stats.peopleAtRisk,
      unit: '',
      icon: Users,
      color: 'text-purple-500',
      change: percentChanges?.peopleAtRisk ? `${Math.abs(percentChanges.peopleAtRisk)}%` : null,
      changeType: percentChanges?.peopleAtRisk && percentChanges.peopleAtRisk < 0 ? 'down' : 'up',
    },
    {
      title: 'Weather Stations',
      value: stats.weatherStations,
      unit: '',
      icon: Activity,
      color: 'text-green-500',
      change: percentChanges?.weatherStations ? `${Math.abs(percentChanges.weatherStations)}%` : null,
      changeType: percentChanges?.weatherStations && percentChanges.weatherStations >= 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsConfig.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <item.icon className={cn('h-4 w-4 sm:h-5 sm:w-5', item.color)} />
                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                      {item.title}
                    </span>
                  </div>
                  {item.change && (
                    <Badge
                      variant={item.changeType === 'up' ? 'success' : 'danger'}
                      className="text-xs"
                    >
                      {item.change}
                    </Badge>
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                  <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 ml-1">
                    {item.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === SYSTEM STATUS SECTION: USING FLOOD PUMP DATA === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Pump System Status</span> {/* Title changed */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPumpStatus ? (
                <div className="text-center text-xs sm:text-sm text-muted-foreground flex items-center justify-center space-x-2 h-[120px]">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span>Loading pump status...</span>
                </div>
              ) : pumpStatusError ? (
                <div className="text-center text-xs sm:text-sm text-red-400 h-[120px] flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>Error: {pumpStatusError}</span>
                </div>
              ) : totalPumps > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Total Registered Pumps</span>
                    <Badge variant="secondary">{totalPumps}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Operating Pumps</span>
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {activePumps}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Non-Operating Pumps</span>
                    <Badge variant="secondary">
                      {offlinePumps}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Needing Maintenance</span>
                    <Badge variant="warning">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {pumpsNeedingMaintenance}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs sm:text-sm text-muted-foreground h-[120px] flex items-center justify-center">
                  <span>Select a region to view pump data</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* DISPLAYING WATER LEVEL DATA FROM Public Works and Housing */}
                {loadingWaterLevel && (
                  <div className="text-center text-sm text-muted-foreground flex items-center justify-center space-x-2">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span>Loading water level data...</span>
                  </div>
                )}
                {waterLevelError && (
                  <div className="text-center text-sm text-red-400">
                    Error: {waterLevelError}
                  </div>
                )}
                {!loadingWaterLevel &&
                  !waterLevelError &&
                  waterLevelPosts.length > 0 ? (
                  waterLevelPosts.slice(0, 3).map(
                    (
                      post, // Show up to 3 nearest water level posts
                    ) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />{' '}
                        {/* Blue color for water level */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Water Level {post.name}: {post.water_level || 'N/A'}{' '}
                            {post.unit || 'm'}
                            {post.status && ` (${getStatusLabel(post.status)})`}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {post.timestamp
                              ? getTimeAgo(new Date(post.timestamp), 'en')
                              : 'Time unavailable'}
                          </p>
                        </div>
                        {post.status && (
                          <Badge
                            variant={
                              post.status && typeof post.status === 'string' && (
                                post.status.toLowerCase().includes('danger') ||
                                post.status.toLowerCase().includes('critical') ||
                                post.status.toLowerCase().includes('emergency')
                              )
                                ? 'danger'
                                : post.status && typeof post.status === 'string' && (
                                  post.status.toLowerCase().includes('alert') ||
                                  post.status.toLowerCase().includes('warning') ||
                                  post.status.toLowerCase().includes('watch') ||
                                  post.status.toLowerCase().includes('advisory')
                                )
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            {getStatusLabel(post.status)}
                          </Badge>
                        )}
                      </div>
                    ),
                  )
                ) : !loadingWaterLevel &&
                  !waterLevelError &&
                  waterLevelPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Select a region to view water level data
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}