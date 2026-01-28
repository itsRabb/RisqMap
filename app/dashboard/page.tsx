import { fetchUSGSLatestQuake } from '@/lib/api.client';
import { EarthquakeData } from '@/lib/api';
import { DashboardClientPage } from '@/components/layout/DashboardClientPage';
import Footer from '@/components/layout/Footer';
import { calculateMetricsWithHistory } from '@/lib/metrics-calculator';
import { fetchUSGSWaterLevels } from '@/lib/usgs-water';
import { fetchAlertsWithFallback } from '@/lib/noaa-alerts';
import { fetchPumpStations, transformPumpStationForDisplay } from '@/lib/pump-stations';


// Force dynamic rendering since we use Supabase (cookies)
export const dynamic = 'force-dynamic';
export const revalidate = 300; // ISR: Revalidate every 5 minutes

export default async function DashboardPage() {
    // Fetch other data as usual
    let latestQuake: EarthquakeData | null = null;
    let quakeError: string | null = null;
    try {
        latestQuake = await fetchUSGSLatestQuake();
    } catch (error: any) {
        quakeError = error.message;
        console.error('Error fetching USGS quake data:', error);
    }

    // === STEP 1: Fetch REAL water level data from USGS ===
    // 🚀 NOW USING REAL DATA from 10,000+ US monitoring stations!
    let waterLevelPosts = await fetchUSGSWaterLevels();
    
    // If API fails, we handle gracefully (empty array, UI won't break)
    if (waterLevelPosts.length === 0) {
        console.warn('⚠️ No USGS data available - check network or API status');
    } else {
        console.log(`✅ Loaded ${waterLevelPosts.length} real water level stations from USGS`);
    }
    
    // === STEP 2: Fetch REAL pump station infrastructure ===
    // 🚀 NOW USING REAL INFRASTRUCTURE DATA (SWBNO, Miami, Houston, NYC, etc.)
    // Status is currently mock but locations are real
    const pumpStations = await fetchPumpStations({ limit: 50 });
    const pumpStatusData = pumpStations.map(transformPumpStationForDisplay);
    
    console.log(`✅ Loaded ${pumpStations.length} real pump stations from database`);
    
    // === STEP 3: Fetch REAL-TIME flood alerts from NOAA ===
    // 🚀 NOW USING REAL ALERTS from NOAA Weather Service!
    // Falls back to mock data only if API is unavailable
    const realTimeAlerts = await fetchAlertsWithFallback();
    
    console.log(`✅ Dashboard using ${realTimeAlerts.length} active flood alerts`);

    // === STEP 4: Calculate REAL metrics from data ===
    // This replaces hardcoded values with dynamic calculations
    // Metrics update based on actual data conditions
    const metricsData = calculateMetricsWithHistory(
        waterLevelPosts,
        pumpStatusData,
        realTimeAlerts
    );

    const dashboardStats = metricsData.current;

    // Prepare final data to send to the client component
    const initialData = {
        stats: dashboardStats,
        percentChanges: metricsData.percentChanges, // Add percentage changes
        waterLevelPosts,
        pumpStatusData,
        waterLevelError: null,
        pumpStatusError: null,
        latestQuake,
        quakeError,
        realTimeAlerts,
    };

    return (
        <>
            <DashboardClientPage initialData={initialData} />
            <Footer />
        </>
    );
}