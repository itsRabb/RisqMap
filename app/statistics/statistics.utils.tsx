// FILE: statistics/statistics.utils.tsx
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { HistoricalIncident, ChartDataPoint } from './statistics.types';

// Function to process raw incidents into chart-ready monthly aggregates
export const generateChartData = (
  incidents: HistoricalIncident[],
): ChartDataPoint[] => {
  const monthlyData: { [key: string]: { incidents: number; severitySum: number; count: number; resolved: number; ongoing: number; losses: number; } } = {};
  incidents.forEach((incident) => {
    const date = new Date(incident.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { incidents: 0, severitySum: 0, count: 0, resolved: 0, ongoing: 0, losses: 0 };
    }
    monthlyData[monthYear].incidents++;
    monthlyData[monthYear].severitySum += incident.severity;
    monthlyData[monthYear].count++;
    if (incident.status === 'resolved') monthlyData[monthYear].resolved++;
    if (incident.status === 'ongoing') monthlyData[monthYear].ongoing++;
    monthlyData[monthYear].losses += incident.reported_losses || 0;
  });
  const sortedMonths = Object.keys(monthlyData).sort();
  return sortedMonths.map((monthYear) => {
    const data = monthlyData[monthYear];
    const [year, month] = monthYear.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('en-US', { month: 'short' });
    return {
      name: `${monthName} ${year.slice(2)}`,
      incidents: data.incidents,
      severity: data.count === 0 ? 0 : parseFloat((data.severitySum / data.count).toFixed(1)),
      resolved: data.resolved,
      ongoing: data.ongoing,
      losses: data.losses,
    };
  });
};

// Mapping class Tailwind for dynamic colors
export const colorClasses: { [key: string]: { bg: string; text: string } } = {
  blue: { bg: 'from-blue-500/20 to-blue-600/10 group-hover:from-blue-500/30 group-hover:to-blue-600/20', text: 'text-blue-400' },
  orange: { bg: 'from-orange-500/20 to-orange-600/10 group-hover:from-orange-500/30 group-hover:to-orange-600/20', text: 'text-orange-400' },
  red: { bg: 'from-red-500/20 to-red-600/10 group-hover:from-red-500/30 group-hover:to-red-600/20', text: 'text-red-400' },
  green: { bg: 'from-green-500/20 to-green-600/10 group-hover:from-green-500/30 group-hover:to-green-600/20', text: 'text-green-400' },
  purple: { bg: 'from-purple-500/20 to-purple-600/10 group-hover:from-purple-500/30 group-hover:to-purple-600/20', text: 'text-purple-400' },
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10 group-hover:from-cyan-500/30 group-hover:to-cyan-600/20', text: 'text-cyan-400' },
};

// Function to get change icon
export const getChangeIcon = (changeType: string) => {
  if (changeType === 'increase') return <ArrowUpRight className="w-4 h-4" />;
  if (changeType === 'decrease') return <ArrowDownRight className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

// Function to get change color
export const getChangeColor = (changeType: string) => {
  if (changeType === 'increase') return 'text-emerald-400';
  if (changeType === 'decrease') return 'text-rose-400';
  return 'text-slate-400';
};