'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Zap, Clock, ShieldCheck, ShieldAlert, Shield, Activity, TrendingUp, AlertTriangle, ChevronsUpDown, Search, CircleDot, CircleOff, Wrench, XCircle, MapPin, Droplets, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WaterLevelPost, PumpData } from '@/lib/api';
import { getTimeAgo } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
// Removed Table components as we are using CSS Grid for layout
import { useVirtualizer } from '@tanstack/react-virtual';

// Props interface
interface InfrastructureStatusCardProps {
  waterLevelPosts: WaterLevelPost[];
  pumpStatusData: PumpData[];
}

// Helper functions
const getBadgeVariant = (status: string) => {
  if (!status) return 'default';
  const lowerStatus = status.toLowerCase();
  
  // Water level status colors (based on USGS flood stages)
  if (lowerStatus.includes('danger')) {
    return 'destructive'; // Red
  }
  if (lowerStatus.includes('alert 2')) {
    return 'destructive'; // Red
  }
  if (lowerStatus.includes('alert 3')) {
    return 'warning'; // Yellow-Orange
  }
  if (lowerStatus.includes('alert 1')) {
    return 'warning'; // Yellow
  }
  if (lowerStatus.includes('normal')) {
    return 'success'; // Green
  }
  
  // Pump status colors
  if (lowerStatus.includes('good') || lowerStatus.includes('online') || lowerStatus.includes('operational')) {
    return 'success'; // Green
  }
  if (lowerStatus.includes('under maintenance') || lowerStatus.includes('maintenance')) {
    return 'warning'; // Yellow
  }
  if (lowerStatus.includes('poor') || lowerStatus.includes('offline')) {
    return 'destructive'; // Red
  }
  
  return 'default'; // Default color if no match
};

const getStatusIcon = (status: string = '') => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('online') || lowerStatus.includes('active')) return <CircleDot className="h-3 w-3 text-emerald-500" />;
  if (lowerStatus.includes('offline')) return <CircleOff className="h-3 w-3 text-red-500" />;
  if (lowerStatus.includes('maintenance')) return <Wrench className="h-3 w-3 text-amber-500" />;
  return null;
};

const getWaterLevelIcon = (status: string = '') => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('danger') || lowerStatus.includes('watch out')) {
    return <AlertTriangle className="h-5 w-5 text-red-400" />;
  }
  if (lowerStatus.includes('alert II') || lowerStatus.includes('alert')) {
    return <TrendingUp className="h-5 w-5 text-amber-400" />;
  }
  return <Waves className="h-5 w-5 text-blue-400" />;
};

const getPumpStatusIcon = (status: string = '') => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'active') return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
  if (lowerStatus === 'standby') return <ShieldAlert className="h-4 w-4 text-amber-500" />;
  return <Shield className="h-4 w-4 text-gray-500" />;
};

const getPumpName = (pump: PumpData) => {
  return (pump as any).infrastructure_name || '';
};

const getPumpLocation = (pump: PumpData) => {
  return (pump as any).location || '';
};

const DetailPopup = ({ item, onClose }: { item: WaterLevelPost | PumpData, onClose: () => void }) => {
  const isWaterLevel = 'water_level' in item;

  let title: string;
  let lastUpdated: string;

  if (isWaterLevel) {
    title = item.name;
    lastUpdated = getTimeAgo(item.timestamp || new Date().toISOString()); // Provide default for timestamp
  } else {
    title = getPumpName(item as PumpData) || 'Unknown';
    lastUpdated = getTimeAgo(new Date((item as PumpData).updated_at || Date.now()).toISOString()); // Use updated_at for PumpData
  }

  const details = isWaterLevel
    ? [
      { label: "Water Level", value: `${item.water_level} ${item.unit}`, icon: <Waves className="w-4 h-4 text-slate-400" /> },
      { label: "Status", value: item.status, icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> },
      { label: "Sensor ID", value: item.id, icon: <Info className="w-4 h-4 text-slate-400" /> },
    ]
      : [
      { label: "Location", value: getPumpLocation(item as PumpData) || 'N/A', icon: <MapPin className="w-4 h-4 text-slate-400" /> },
      { label: "Pump System Status", value: (item as PumpData).building_condition || 'Unknown', icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> },
      { label: "Capacity", value: `${(item as PumpData).capacity_liters_per_second ?? (item as any).capacity_liter_per_second ?? 'N/A'} L/second`, icon: <Droplets className="w-4 h-4 text-slate-400" /> },
      { label: "Pump ID", value: (item as PumpData).id, icon: <Info className="w-4 h-4 text-slate-400" /> },
    ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isWaterLevel ? 'bg-sky-500/10 dark:bg-sky-500/20' : 'bg-amber-500/10 dark:bg-amber-500/20'}`}>
            {isWaterLevel ? <Waves className="h-8 w-8 text-sky-500 dark:text-sky-400" /> : <Zap className="h-8 w-8 text-amber-500 dark:text-amber-400" />}
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{isWaterLevel ? 'Monitoring Post' : 'Pump House'}</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/80">
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Main Details Card */}
      <Card className="bg-slate-100 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
            {details.map(({ label, value, icon }) => (
              <div key={label} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors">
                <div className="text-slate-600 dark:text-slate-400 mt-1">{icon}</div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  {label === 'Status' || label === 'Pump Status' ? (
                    <Badge variant={getBadgeVariant(value)} className="mt-1">{value}</Badge>
                  ) : (
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
        <p>Last Updated: {lastUpdated}</p>
      </div>
    </div>
  );
};

// Main component with new layout
export function InfrastructureStatusCard({ waterLevelPosts, pumpStatusData }: InfrastructureStatusCardProps) {
  // State for popup/modal
  const [selectedItem, setSelectedItem] = useState<WaterLevelPost | PumpData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // State for Water Level section
  const [waterLevelSearchTerm, setWaterLevelSearchTerm] = useState('');
  const [isWaterLevelExpanded, setIsWaterLevelExpanded] = useState(true);

  // State for Pump Status section
  const [pumpSearchTerm, setPumpSearchTerm] = useState('');
  const [isPumpExpanded, setIsPumpExpanded] = useState(true);

  // Filtered data for Water Level
  const filteredWaterLevelPosts = waterLevelPosts.filter(post =>
    post.name.toLowerCase().includes(waterLevelSearchTerm.toLowerCase()) ||
    post.status?.toLowerCase().includes(waterLevelSearchTerm.toLowerCase())
  );

  // Filtered data for Pump Status (safe: normalize fields and guard against undefined)
  const filteredPumpData = pumpStatusData.filter((pump) => {
    const name = getPumpName(pump) || '';
    const location = getPumpLocation(pump) || '';
    const condition = pump.building_condition ?? '';
    const term = pumpSearchTerm || '';
    return (
      name.toLowerCase().includes(term.toLowerCase()) ||
      condition.toLowerCase().includes(term.toLowerCase()) ||
      location.toLowerCase().includes(term.toLowerCase())
    );
  });

  // Virtualizer for Water Level Table
  const waterLevelParentRef = useRef<HTMLDivElement>(null);
  const waterLevelRowVirtualizer = useVirtualizer({
    count: filteredWaterLevelPosts.length,
    getScrollElement: () => waterLevelParentRef.current,
    estimateSize: () => 48, // Estimate row height in pixels
    overscan: 5, // Render 5 items above and below the visible area
  });

  // Virtualizer for Pump Status Table
  const pumpParentRef = useRef<HTMLDivElement>(null);
  const pumpRowVirtualizer = useVirtualizer({
    count: filteredPumpData.length,
    getScrollElement: () => pumpParentRef.current,
    estimateSize: () => 48, // Estimate row height in pixels
    overscan: 5, // Render 5 items above and below the visible area
  });

  const handleItemClick = (item: WaterLevelPost | PumpData) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  if (!waterLevelPosts || !pumpStatusData) {
    return null;
  }

  const collapsibleContentVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto", transition: { opacity: { duration: 0.3 }, height: { duration: 0.4 } } },
    exit: { opacity: 0, height: 0, transition: { opacity: { duration: 0.2 }, height: { duration: 0.3 } } },
  };

  return (
    <>
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm shadow-sm dark:shadow-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Critical Infrastructure</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click on any item for details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live Data</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Left Column: Water Level */}
            <Collapsible open={isWaterLevelExpanded} onOpenChange={setIsWaterLevelExpanded}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 cursor-pointer transition-colors border border-slate-300 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Waves className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Water Level Monitoring</h3>
                  </div>
                  <ChevronsUpDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
              </CollapsibleTrigger>
              <AnimatePresence>
                {isWaterLevelExpanded && (
                  <motion.div
                    key="water-level-content"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={collapsibleContentVariants}
                    className="overflow-hidden"
                  >
                    <CollapsibleContent className="pt-4">
                      <div className="mt-4 flex flex-col">
                        <div className="relative mb-4">
                          <Input
                            placeholder="Search water monitoring posts..."
                            value={waterLevelSearchTerm}
                            onChange={(e) => setWaterLevelSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        <div className="grid grid-cols-4 gap-4 px-2 pb-2 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                          <div className="whitespace-nowrap">Station</div>
                          <div className="whitespace-nowrap">Height</div>
                          <div className="whitespace-nowrap">Status</div>
                          <div className="whitespace-nowrap">Last Update</div>
                        </div>
                        <div
                          ref={waterLevelParentRef}
                          className="w-full h-[250px] overflow-y-auto custom-scrollbar rounded-lg border border-slate-200 dark:border-slate-700/50"
                        >
                          <div
                            style={{
                              height: `${waterLevelRowVirtualizer.getTotalSize()}px`,
                              width: '100%',
                              position: 'relative',
                            }}
                          >
                            {waterLevelRowVirtualizer.getVirtualItems().map((virtualItem) => {
                              const post = filteredWaterLevelPosts[virtualItem.index];
                              return (
                                <div
                                  key={virtualItem.key}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                  }}
                                  className="grid grid-cols-4 items-center gap-4 p-2 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                  onClick={() => handleItemClick(post)}
                                >
                                  <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap truncate">{post.name}</span>
                                  <span className="text-slate-700 dark:text-white whitespace-nowrap truncate">{post.water_level} {post.unit}</span>
                                  <div className="whitespace-nowrap">
                                    <Badge variant={getBadgeVariant(post.status)} className="flex items-center gap-1">
                                      {getStatusIcon(post.status)} {post.status}
                                    </Badge>
                                  </div>
                                  <span className="text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap truncate">{getTimeAgo(post.timestamp, 'en')}</span>
                                </div>
                              );
                            })}
                            {filteredWaterLevelPosts.length === 0 && (
                              <div className="grid grid-cols-4 text-center text-slate-500 dark:text-slate-400 py-4">
                                <div className="col-span-4 flex flex-col items-center justify-center">
                                  <Search className="h-6 w-6 mb-2" />
                                  Select a region to view water level data
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Collapsible>

            {/* Right Column: Pump Status */}
            <Collapsible open={isPumpExpanded} onOpenChange={setIsPumpExpanded}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 cursor-pointer transition-colors border border-slate-300 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pump Status</h3>
                  </div>
                  <ChevronsUpDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
              </CollapsibleTrigger>
              <AnimatePresence>
                {isPumpExpanded && (
                  <motion.div
                    key="pump-status-content"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={collapsibleContentVariants}
                    className="overflow-hidden"
                  >
                    <CollapsibleContent className="pt-4">
                      <div className="mt-4 flex flex-col">
                        <div className="relative mb-4">
                          <Input
                            placeholder="Search pump stations..."
                            value={pumpSearchTerm}
                            onChange={(e) => setPumpSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 px-2 pb-2 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                          <div className="whitespace-nowrap">Pump Name</div>
                          <div className="whitespace-nowrap">Location</div>
                          <div className="whitespace-nowrap">Status</div>
                        </div>
                        <div
                          ref={pumpParentRef}
                          className="w-full h-[250px] overflow-y-auto custom-scrollbar rounded-lg border border-slate-200 dark:border-slate-700/50"
                        >
                          <div
                            style={{
                              height: `${pumpRowVirtualizer.getTotalSize()}px`,
                              width: '100%',
                              position: 'relative',
                            }}
                          >
                            {pumpRowVirtualizer.getVirtualItems().map((virtualItem) => {
                              const pump = filteredPumpData[virtualItem.index];
                              return (
                                <div
                                    key={virtualItem.key}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: `${virtualItem.size}px`,
                                      transform: `translateY(${virtualItem.start}px)`,
                                    }}
                                    className="grid grid-cols-3 items-center gap-4 p-2 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                    onClick={() => handleItemClick(pump)}
                                  >
                                    <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap truncate">{getPumpName(pump) || 'Unknown'}</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap truncate">{getPumpLocation(pump) || 'N/A'}</span>
                                    <div className="whitespace-nowrap">
                                      <Badge variant={getBadgeVariant(pump.building_condition)} className="flex items-center gap-1">
                                        {getStatusIcon(pump.building_condition)} {pump.building_condition || 'Unknown'}
                                      </Badge>
                                    </div>
                                  </div>
                              );
                            })}
                            {filteredPumpData.length === 0 && (
                              <div className="grid grid-cols-3 text-center text-slate-500 dark:text-slate-400 py-4">
                                <div className="col-span-3 flex flex-col items-center justify-center">
                                  <Search className="h-6 w-6 mb-2" />
                                  Select a region to view pump data
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Collapsible>

          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Monitored Water Posts</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{waterLevelPosts.length}</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Registered Pumps</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{pumpStatusData.length}</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{pumpStatusData.filter(p => p.building_condition?.toLowerCase() === 'active').length}</p>
                <div className="text-sm text-slate-500 dark:text-slate-400">Active</div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Flood Zones</p>
                <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">{waterLevelPosts.filter(p => p.status?.toLowerCase().includes('standby')).length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isDetailOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >

              <DetailPopup item={selectedItem} onClose={() => setIsDetailOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >
    </>
  );
}