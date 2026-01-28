'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import Image from 'next/image';

const classifyWaterLevel = (waterLevel: number): string => {
  if (waterLevel <= 10) {
    return 'Ankle-deep';
  } else if (waterLevel <= 40) {
    return 'Knee-deep';
  } else if (waterLevel <= 70) {
    return 'Thigh-deep';
  } else if (waterLevel <= 100) {
    return 'Waist-deep';
  } else {
    return 'Above waist';
  }
};

import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const classifyWaterLevelString = (waterLevelString: string): string => {
  switch (waterLevelString) {
    case 'angle-length':
      return 'Ankle-deep';
    case 'knee-length':
      return 'Knee-deep';
    case 'thigh-length':
      return 'Thigh-deep';
    case 'waist-length':
      return 'Waist-deep';
    case 'above-waist':
      return 'Above waist';
    default:
      return 'Unknown';
  }
};

interface FloodReport {
  id: string;
  reporter_name: string | null;
  location: string;
  water_level: string;
  created_at: string;
  description: string | null;
  photo_url: string | null;
}

const FloodReportList: React.FC = () => {
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('flood_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10); // Take the 10 latest reports

        if (error) {
          throw error;
        }

        setReports(data as FloodReport[]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mt-8"><CardContent>Loading reports...</CardContent></Card>;
  }

  if (error) {
    return <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mt-8"><CardContent>Error: {error}</CardContent></Card>;
  }

  const filteredReports = reports.filter(report => {
    if (filter === 'all') {
      return true;
    }
    return classifyWaterLevelString(report.water_level) === filter;
  });
return (
    <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Latest Flood Reports</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Water Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Ankle-deep">Ankle-deep</SelectItem>
            <SelectItem value="Knee-deep">Knee-deep</SelectItem>
            <SelectItem value="Thigh-deep">Thigh-deep</SelectItem>
            <SelectItem value="Waist-deep">Waist-deep</SelectItem>
            <SelectItem value="Above waist">Above waist</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {filteredReports.length === 0 ? (
          <p>No flood reports at the moment.</p>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                <p className="text-lg font-semibold">Location: {report.location}</p>
                <p>Reporter: {report.reporter_name || 'Anonymous'}</p>
                <p>Brief Description: {report.description || 'No description'}</p>
                <p>Water Level: {classifyWaterLevelString(report.water_level)}</p>
                <p>Report Time: {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm')}</p>
                {report.photo_url && (
                                    <div className="relative w-48 h-48 mt-2"> {/* Added a relative parent with fixed size */}
                                        <Image src={report.photo_url} alt="Report Photo" fill className="object-cover rounded-md" unoptimized />
                                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FloodReportList;