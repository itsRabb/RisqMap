import React from 'react';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Waves,
  ArrowUp,
  ArrowDown,
  Minus,
  Siren,
  CalendarDays,
} from 'lucide-react';
import { Button } from '../ui/Button'; // Path adjusted to shadcn standard
import { Badge } from '../ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { cn } from '@/lib/utils'; // Assuming you have the cn utility from shadcn

// Data type for component props
interface FloodReportPopupProps {
  report: {
    id: string;
    locationName: string;
    waterLevel: number;
    timestamp: string;
    trend: 'rising' | 'falling' | 'stable';
    severity: 'low' | 'moderate' | 'high';
    imageUrl?: string;
    // NEW FEATURE: Adding historical data for mini chart
    historicalData?: { time: string; level: number }[];
  };
  // NEW FEATURE: Adding handler for "View Details" button
  onViewDetailsClick?: (reportId: string) => void;
}

// --- PROFESSIONAL REFACTOR: Data-Driven Configuration ---
// This is cleaner than switch/case functions inside JSX

const SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    className: 'bg-green-600 hover:bg-green-700 text-white',
    icon: Waves,
  },
  moderate: {
    label: 'Moderate',
    className: 'bg-orange-500 hover:bg-orange-600 text-white',
    icon: Waves,
  },
  high: {
    label: 'High',
    className: 'bg-red-600 hover:bg-red-700 text-white',
    icon: Siren,
  },
};

const TREND_CONFIG = {
  rising: {
    label: 'Rising',
    className: 'text-red-500',
    icon: ArrowUp,
  },
  falling: {
    label: 'Falling',
    className: 'text-green-500',
    icon: ArrowDown,
  },
  stable: {
    label: 'Stable',
    className: 'text-gray-500',
    icon: Minus,
  },
};

// --- NEW FEATURE: Mini Trend Chart Component ---
// Internal component to keep file organized
const MiniTrendChart: React.FC<{ data: { time: string; level: number }[] }> = ({
  data,
}) => (
  <div className="w-full h-20 my-2 -ml-2">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <defs>
          {/* Gradient for the area under the line */}
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {/* Custom tooltip on chart hover */}
        <RechartsTooltip
          contentStyle={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '0.5rem',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
          labelFormatter={(label) => format(new Date(label), 'HH:mm')}
          formatter={(value: number) => [`${value} cm`, 'Height']}
        />
        <Area
          type="monotone"
          dataKey="level"
          stroke="#8884d8"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#chartGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// --- Main Component ---
const FloodReportPopup: React.FC<FloodReportPopupProps> = ({
  report,
  onViewDetailsClick,
}) => {
  // Getting configuration based on report data
  const severityInfo =
    SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.moderate;
  const trendInfo = TREND_CONFIG[report.trend] || TREND_CONFIG.stable;
  const parsedTimestamp = new Date(report.timestamp);

  return (
    <TooltipProvider>
      <div className="w-64 space-y-2">
        {/* Report Image */}
        {report.imageUrl && (
          <div className="overflow-hidden rounded-md">
            <Image
              src={report.imageUrl}
              alt={`Flood reports in ${report.locationName}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover aspect-video transition-transform hover:scale-105"
              priority // Prioritize loading visible images
            />
          </div>
        )}

        {/* Location Title */}
        <h3 className="font-bold text-base leading-tight">
          {report.locationName}
        </h3>

        {/* --- MODERN LOOK: Using Badge & Tooltip --- */}

        {/* Detail Status (Height, Severity, Trend) */}
        <div className="flex flex-col space-y-2 text-sm">
          {/* Height & Severity */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-2xl text-primary">
              {report.waterLevel} cm
            </span>
            <Badge
              className={cn('pointer-events-none', severityInfo.className)}
            >
              <severityInfo.icon className="w-3 h-3 mr-1" />
              {severityInfo.label}
            </Badge>
          </div>

          {/* Trends */}
          <div className={cn('flex items-center', trendInfo.className)}>
            <trendInfo.icon className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{trendInfo.label}</span>
          </div>
        </div>

        {/* --- ADVANCED FEATURE: Mini Trend Chart --- */}
        {report.historicalData && report.historicalData.length > 0 && (
          <MiniTrendChart data={report.historicalData} />
        )}

        {/* Timestamp with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-xs text-muted-foreground cursor-default">
              <CalendarDays className="w-3 h-3 mr-1.5" />
              <span>
                {formatDistanceToNow(parsedTimestamp, {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {/* Show exact time on hover */}
            <p>
              {format(parsedTimestamp, "EEEE, dd MMMM yyyy 'at' HH:mm", {
                locale: enUS,
              })}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewDetailsClick?.(report.id)}
        >
          View Report Details
        </Button>
      </div>
    </TooltipProvider>
  );
};

export default FloodReportPopup;
