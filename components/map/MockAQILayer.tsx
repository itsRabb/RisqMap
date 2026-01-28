// WE NEED USA DATA TO SIMULATE AQI BECAUSE WE'RE BUILDING A PROPERTY RISK FOR UNITED STATES

// @ts-nocheck
import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import * as L from 'leaflet';
import { cn } from '@/lib/utils';
import { Wind, Gauge, MapPin, Info, ArrowUpRight } from 'lucide-react';

// --- MOCK DATA ---
export interface MockAQIPoint {
    id: string;
    name: string;
    lat: number;
    lon: number;
    aqi: number;
}

const MOCK_DATA: MockAQIPoint[] = [
    { id: 'nyc', name: 'New York, NY', lat: 40.7128, lon: -74.0060, aqi: 65 },
    { id: 'la', name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437, aqi: 75 },
    { id: 'chi', name: 'Chicago, IL', lat: 41.8781, lon: -87.6298, aqi: 55 },
    { id: 'hou', name: 'Houston, TX', lat: 29.7604, lon: -95.3698, aqi: 70 },
    { id: 'phx', name: 'Phoenix, AZ', lat: 33.4484, lon: -112.0740, aqi: 95 },
    { id: 'phi', name: 'Philadelphia, PA', lat: 39.9526, lon: -75.1652, aqi: 60 },
    { id: 'sd', name: 'San Diego, CA', lat: 32.7157, lon: -117.1611, aqi: 50 },
    { id: 'dal', name: 'Dallas, TX', lat: 32.7767, lon: -96.7970, aqi: 58 },
    { id: 'sj', name: 'San Jose, CA', lat: 37.3382, lon: -121.8863, aqi: 45 },
];

export const getAQIAnalytics = (aqi: number) => {
    // Estimate PM2.5 roughly from AQI
    const pm25 = Math.round(aqi * 0.4);

    if (aqi <= 50) return {
        label: 'Good',
        status: 'good',
        description: 'Air quality is considered satisfactory.',
        // #22C55E with opacity
        colors: {
            bg: 'bg-[#22C55E]/80',
            solid: 'bg-[#22C55E]',
            text: 'text-[#22C55E]',
            border: 'border-[#22C55E]/30',
            glow: 'shadow-[#22C55E]/40'
        },
        pm25
    };
    if (aqi <= 100) return {
        label: 'Moderate',
        status: 'moderate',
        description: 'Air quality is acceptable; some pollutants may be a concern for sensitive groups.',
        // #EAB308
        colors: {
            bg: 'bg-[#EAB308]/80',
            solid: 'bg-[#EAB308]',
            text: 'text-[#EAB308]',
            border: 'border-[#EAB308]/30',
            glow: 'shadow-[#EAB308]/40'
        },
        pm25
    };
    if (aqi <= 150) return {
        label: 'Unhealthy for Sensitive Groups',
        status: 'unhealthy',
        description: 'Members of sensitive groups may experience health effects; reduce prolonged outdoor exertion.',
        // #F97316
        colors: {
            bg: 'bg-[#F97316]/85',
            solid: 'bg-[#F97316]',
            text: 'text-[#F97316]',
            border: 'border-[#F97316]/30',
            glow: 'shadow-[#F97316]/40'
        },
        pm25
    };
    return {
        label: 'Hazardous',
        status: 'hazardous',
        description: 'Health warnings of emergency conditions. Avoid outdoor activity.',
        // #EF4444
        colors: {
            bg: 'bg-[#EF4444]/90',
            solid: 'bg-[#EF4444]',
            text: 'text-[#EF4444]',
            border: 'border-[#EF4444]/30',
            glow: 'shadow-[#EF4444]/40'
        },
        pm25
    };
};

const createAQIIcon = (aqi: number) => {
    const { colors } = getAQIAnalytics(aqi);
    const shouldPulse = aqi > 100;

    // "Soft Circle" design with white outline and glass feel
    return (L as any).divIcon({
        className: 'custom-aqi-marker',
        html: `
            <div class="relative flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-110">
                ${shouldPulse ? `<div class="absolute -inset-3 rounded-full ${colors.solid} opacity-20 animate-pulse"></div>` : ''}
                <div class="absolute -inset-0.5 rounded-full bg-white opacity-20 group-hover:opacity-40 blur-sm transition-opacity"></div>
                <div class="relative flex flex-col items-center justify-center w-9 h-9 rounded-full ${colors.bg} backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-[1.5px] border-white/80 ${colors.glow} ring-1 ring-black/5">
                    <span class="text-[10px] font-black text-white leading-none">${aqi}</span>
                </div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

// --- HERO COMPONENT: AQI DETAIL CARD (Liquid Glass Style) ---
export function AQIDetailCard({ point, onClose }: { point: MockAQIPoint; onClose?: () => void }) {
    const analytics = getAQIAnalytics(point.aqi);

    return (
        <div className="relative w-[240px] overflow-hidden rounded-2xl font-sans group">
            {/* Liquid Glass Base - Darkened for Contrast */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" />

            {/* RisqMap Gradient Tint (Subtle Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-50 pointer-events-none" />

            {/* Refraction Highlight (Edge) */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    background: 'linear-gradient(120deg, rgba(255,255,255,0.12), transparent 40%)',
                    borderRadius: 'inherit'
                }}
            />

            <div className="relative p-4 z-10">
                {/* Header: Location */}
                <div className="flex flex-col mb-3">
                    <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-md truncate">{point.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] uppercase font-medium text-cyan-100/70 tracking-wider">USA</span>
                        <span className="text-[9px] px-1.5 py-px rounded-full bg-cyan-500/20 border border-cyan-400/20 text-cyan-200 font-mono shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                            LIVE
                        </span>
                    </div>
                </div>

                {/* Main Hero: Compact Big AQI */}
                <div className="flex items-end justify-between mb-5">
                    <div className="flex flex-col">
                        <span className="text-5xl font-thin text-white tracking-tighter leading-none filter drop-shadow-lg">
                            {point.aqi}
                            <span className="text-lg font-light text-white/50 align-top ml-0.5">°</span>
                        </span>
                        <span className="text-[10px] font-medium text-cyan-100/60 mt-1 tracking-widest uppercase">
                            US AQI
                        </span>
                    </div>

                    <div className="flex flex-col items-end text-right">
                        <div className={`mb-2 p-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-lg backdrop-blur-md ${analytics.colors.glow}`}>
                            <ArrowUpRight size={16} className="text-white drop-shadow-md" />
                        </div>
                        <h2 className={`text-base font-bold ${analytics.colors.text} filter drop-shadow-md tracking-tight`}>
                            {analytics.label}
                        </h2>
                    </div>
                </div>

                {/* Stacked Glass Details Lists (Compact) */}
                <div className="flex flex-col gap-2">

                    {/* Item 1: PM 2.5 */}
                    <div className="group/item relative flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2.5 relative z-10">
                            <Gauge size={14} className="text-cyan-200/80 drop-shadow" />
                            <span className="text-xs text-slate-200 font-medium">PM 2.5</span>
                        </div>
                        <div className="flex items-baseline gap-0.5 relative z-10">
                            <span className="text-sm font-bold text-white drop-shadow-md">{analytics.pm25}</span>
                            <span className="text-[9px] text-white/60">µg</span>
                        </div>
                        {/* Progress Bar Line */}
                        <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full rounded-b-xl overflow-hidden">
                            <div
                                className={`h-full ${analytics.colors.solid} shadow-[0_0_8px_currentColor]`}
                                style={{ width: `${Math.min(analytics.pm25, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Item 2: Wind */}
                    <div className="group/item relative flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2.5 relative z-10">
                            <Wind size={14} className="text-cyan-200/80 drop-shadow" />
                            <span className="text-xs text-slate-200 font-medium">Angin</span>
                        </div>
                        <div className="flex items-baseline gap-0.5 relative z-10">
                            <span className="text-sm font-bold text-white drop-shadow-md">5.4</span>
                            <span className="text-[9px] text-white/60">km/h</span>
                        </div>
                    </div>

                    {/* Item 3: Status */}
                    <div className="group/item relative flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="flex items-center gap-2.5 relative z-10">
                            <Info size={14} className="text-cyan-200/80 drop-shadow" />
                            <span className="text-xs text-slate-200 font-medium">Info</span>
                        </div>
                        <span className="text-[10px] font-medium text-white/90 text-right leading-tight max-w-[100px]">
                            {analytics.description}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- MAIN LAYER COMPONENT ---
interface MockAQILayerProps {
    visible: boolean;
    onPointSelect?: (point: MockAQIPoint) => void;
}

export function MockAQILayer({ visible, onPointSelect }: MockAQILayerProps) {
    if (!visible) return null;

    return (
        <>
            {MOCK_DATA.map((point) => (
                // @ts-ignore
                <Marker
                    key={point.id}
                    position={[point.lat, point.lon] as [number, number]}
                    icon={createAQIIcon(point.aqi)}
                    eventHandlers={{
                        click: (e) => {
                            if (onPointSelect) {
                                L.DomEvent.stopPropagation(e); // Prevent map click
                                onPointSelect(point);
                            }
                        },
                        mouseover: (e) => e.target.openTooltip(),
                        mouseout: (e) => e.target.closeTooltip()
                    }}
                >
                    <Tooltip
                        direction="bottom"
                        offset={[0, 20]}
                        opacity={1}
                        className="bg-transparent border-none shadow-none !p-0"
                    >
                        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white border border-white/10 shadow-xl tracking-wide">
                            {point.name}
                        </div>
                    </Tooltip>
                </Marker>
            ))}
        </>
    );
}
