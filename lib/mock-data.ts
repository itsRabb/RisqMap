import { WaterLevelPost, PumpData } from '@/lib/api';
import { FloodAlert } from '@/types';

// Realistic US water monitoring infrastructure
const waterLevelStations = [
  { name: 'Mississippi River @ Vicksburg', location: 'Vicksburg, MS' },
  { name: 'Missouri River @ Kansas City', location: 'Kansas City, MO' },
  { name: 'Ohio River @ Cincinnati', location: 'Cincinnati, OH' },
  { name: 'Hudson River @ Albany', location: 'Albany, NY' },
  { name: 'Red River @ Fargo', location: 'Fargo, ND' },
  { name: 'Sacramento River @ Sacramento', location: 'Sacramento, CA' },
  { name: 'Potomac River @ Washington DC', location: 'Washington, DC' },
  { name: 'Colorado River @ Austin', location: 'Austin, TX' }
];

const pumpStations = [
  { name: 'New Orleans Pump Station 6', location: 'New Orleans, LA' },
  { name: 'Miami Beach Pump Station A', location: 'Miami Beach, FL' },
  { name: 'Houston Addicks Reservoir', location: 'Houston, TX' },
  { name: 'Norfolk Hague Pump Station', location: 'Norfolk, VA' },
  { name: 'Jersey City Hoboken Pump', location: 'Hoboken, NJ' },
  { name: 'Charleston Peninsula Pump', location: 'Charleston, SC' },
  { name: 'Galveston Seawall Pump 3', location: 'Galveston, TX' },
  { name: 'New York Coney Island Pump', location: 'Brooklyn, NY' }
];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min: number, max: number, decimals: number) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

// Exportable mock data generation functions

export function generateMockWaterLevels(count: number): WaterLevelPost[] {
  const data: WaterLevelPost[] = [];
  // Realistic status distribution: 70% normal, 15% alert3, 10% alert2, 5% danger
  const statusWeights = [
    { status: 'Normal', weight: 70 },
    { status: 'Alert 3', weight: 15 },
    { status: 'Alert 2', weight: 10 },
    { status: 'Danger', weight: 5 }
  ];
  
  const getWeightedStatus = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (const { status, weight } of statusWeights) {
      cumulative += weight;
      if (random < cumulative) return status;
    }
    return 'Normal';
  };
  
  // Use realistic stations, loop if needed
  for (let i = 0; i < count; i++) {
    const station = waterLevelStations[i % waterLevelStations.length];
    const status = getWeightedStatus();
    let water_level;
    switch (status) {
      case 'Danger': water_level = getRandomFloat(2.5, 4.0, 2); break;
      case 'Alert 2': water_level = getRandomFloat(2.0, 2.49, 2); break;
      case 'Alert 3': water_level = getRandomFloat(1.5, 1.99, 2); break;
      default: water_level = getRandomFloat(0.5, 1.49, 2);
    }
    data.push({
      id: String(i + 1),
      name: station.name,
      lat: getRandomFloat(25.0, 49.0, 4),
      lon: getRandomFloat(-124.0, -67.0, 4),
      water_level: water_level,
      unit: 'm',
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60).toISOString(),
      status: status,
    });
  }
  return data;
}

export function generateMockPumpStatus(count: number): PumpData[] {
  const data: PumpData[] = [];
  // Realistic condition distribution: 85% active, 10% maintenance, 5% offline
  const conditionWeights = [
    { condition: 'Active', weight: 85 },
    { condition: 'Maintenance', weight: 10 },
    { condition: 'Offline', weight: 5 }
  ];
  
  const getWeightedCondition = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (const { condition, weight } of conditionWeights) {
      cumulative += weight;
      if (random < cumulative) return condition;
    }
    return 'Active';
  };
  
  // Use realistic pump stations, limit to available unique stations
  const limitedCount = Math.min(count, pumpStations.length);
  for (let i = 0; i < limitedCount; i++) {
    const station = pumpStations[i];
    data.push({
      id: String(i + 1),
      infrastructure_name: station.name,
      infrastructure_type: 'Flood Pump Station',
      hydrological_type: getRandomElement(['Stormwater', 'Drainage Basin', 'Coastal Defense', 'River Management']),
      building_condition: getWeightedCondition(),
      latitude: getRandomFloat(25.0, 49.0, 4),
      longitude: getRandomFloat(-124.0, -67.0, 4),
      location: station.location,
      pump_status: [],
      updated_at: Date.now() - Math.random() * 1000 * 60 * 120,
    });
  }
  return data;
}

export function generateMockAlerts(): FloodAlert[] {
  const alertData = [
    {
      title: 'Mississippi River Flood Watch',
      message: 'River levels rising due to upstream rainfall. Residents in low-lying areas should monitor conditions.',
      location: 'Vicksburg, MS',
      level: 'warning' as const
    },
    {
      title: 'New Orleans Pump Station Alert',
      message: 'Pump Station 6 operating at reduced capacity. Potential localized flooding in adjacent neighborhoods.',
      location: 'New Orleans, LA',
      level: 'danger' as const
    },
    {
      title: 'Coastal Storm Surge Warning',
      message: 'High tide combined with offshore storm system may cause coastal flooding. Avoid low-lying coastal roads.',
      location: 'Charleston, SC',
      level: 'warning' as const
    },
    {
      title: 'Flash Flood Watch Active',
      message: 'Heavy rainfall forecast for next 6 hours. Potential for rapid onset flooding in urban areas.',
      location: 'Houston, TX',
      level: 'danger' as const
    },
    {
      title: 'River Level Advisory',
      message: 'Ohio River levels elevated but stable. Continue monitoring conditions.',
      location: 'Cincinnati, OH',
      level: 'info' as const
    }
  ];

  return alertData.slice(0, 3).map((alert, i) => ({
    id: (i + 1).toString() + Date.now(),
    regionId: alert.location.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    level: alert.level,
    title: alert.title,
    titleEn: alert.title,
    message: alert.message,
    messageEn: alert.message,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 5).toISOString(),
    isActive: true,
    affectedAreas: [alert.location],
    actions: ['Monitor local emergency services', 'Prepare evacuation routes', 'Stay informed'],
    coordinates: [getRandomFloat(25.0, 49.0, 4), getRandomFloat(-124.0, -67.0, 4)],
  }));
}