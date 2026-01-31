'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  ArrowLeft,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { normalizeSeries, ChartRow } from '@/lib/utils';

// Helper to generate random data
const generateRandomData = (days: number) => {
  const data = [];
  const regions = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Miami',
    'Other',
  ];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    for (const region of regions) {
      data.push({
        date: date.toISOString(),
        region,
        laporan: Math.floor(Math.random() * 20) + 1,
        resolved: Math.floor(Math.random() * 15) + 1,
      });
    }
  }
  return data;
};

interface ChartData {
  line: ChartRow[];
  bar: ChartRow[];
  pie: ChartRow[];
}

const DATA_KEYS = ['amount', 'resolved'];

const StatisticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({ line: [], bar: [], pie: [] });
  const [floodReports, setFloodReports] = useState<any[]>([]);

  // Fetch real flood reports from database
  useEffect(() => {
    const fetchFloodReports = async () => {
      try {
        const response = await fetch('/api/report');
        if (response.ok) {
          const data = await response.json();
          setFloodReports(data);
        } else {
          console.error('Failed to fetch flood reports');
          setFloodReports([]);
        }
      } catch (error) {
        console.error('Error fetching flood reports:', error);
        setFloodReports([]);
      }
    };
    fetchFloodReports();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      const days = parseInt(
        selectedTimeRange.replace('d', '').replace('h', ''),
      );
      const isHours = selectedTimeRange.includes('h');
      const now = new Date();
      
      // Filter flood reports by time range
      const cutoff = isHours ? subDays(now, days / 24) : subDays(now, days);
      const dataToProcess = floodReports.filter((report) => 
        new Date(report.created_at) >= cutoff
      );

      // Process data for charts - group by date
      const line = normalizeSeries(
        dataToProcess
          .reduce((acc, curr) => {
            const day = format(parseISO(curr.created_at), 'yyyy-MM-dd');
            const existing = acc.find((item) => item.date === day);
            if (existing) {
              existing.amount += 1;
              existing.resolved += curr.verified_at ? 1 : 0;
            } else {
              acc.push({
                date: day,
                day: format(parseISO(curr.created_at), 'eee'),
                amount: 1,
                resolved: curr.verified_at ? 1 : 0,
              });
            }
            return acc;
          }, [] as ChartRow[])
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        DATA_KEYS,
      ) as ChartRow[];

      // Group by location/region
      const bar = normalizeSeries(
        dataToProcess.reduce((acc, curr) => {
          const location = curr.location || 'Unknown';
          const existing = acc.find((item) => item.name === location);
          if (existing) {
            existing.amount += 1;
          } else {
            acc.push({ name: location, amount: 1 });
          }
          return acc;
        }, [] as ChartRow[]),
        DATA_KEYS,
      ) as ChartRow[];

      console.log('[Chart] range=', selectedTimeRange, 'reports=', dataToProcess.length);
      if (line.length > 0) {
        console.table(line.slice(0, 3));
      }

      setChartData({ line, bar, pie: bar });
      setIsLoading(false);
    };

    fetchData();
  }, [selectedTimeRange, floodReports]); // Depend on floodReports

  const COLORS = [
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white p-3 rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg">
          <p className="font-bold text-cyan-600 dark:text-cyan-400">{label}</p>
          {dataItem.amount !== undefined && (
            <p className="text-sm">{`Reports: ${dataItem.amount}`}</p>
          )}
          {dataItem.resolved !== undefined && (
            <p className="text-sm">{`Resolved: ${dataItem.resolved}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header / Filter Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sticky top-20 z-10 shadow-sm">
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                Flood Statistics
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      >
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bar Chart: Most Vulnerable Locations */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 lg:col-span-1 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Most Vulnerable Regions
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {chartData.bar && chartData.bar.length > 0 ? (
                  <BarChart
                    data={chartData.bar}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Reports" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Flood Incident Trend */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 lg:col-span-2 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Flood Trend
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {Array.isArray(chartData.line) && chartData.line.length > 0 ? (
                  <LineChart
                    data={chartData.line}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Reports"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="#818cf8"
                      strokeWidth={2}
                      name="Resolved"
                    />
                  </LineChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Report Composition */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 lg:col-span-1 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Report Composition
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {Array.isArray(chartData.pie) && chartData.pie.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={chartData.pie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="name"
                    >
                      {chartData.pie.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Stacked Bar Chart: Daily and Completed Reports */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 lg:col-span-2 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Daily Resolved Reports
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {chartData.line && chartData.line.length > 0 ? (
                  <BarChart
                    data={chartData.line}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      stackId="a"
                      fill="#2dd4bf"
                      name="Total"
                    />
                    <Bar
                      dataKey="resolved"
                      stackId="a"
                      fill="#818cf8"
                      name="Resolved"
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
