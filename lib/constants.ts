// Continental United States bounds (SW, NE)
export const USA_BOUNDS: [[number, number], [number, number]] = [
  [24.396308, -124.848974], // Southwest
  [49.384358, -66.885444], // Northeast
];

// Default to Chicago - major flood monitoring hub with TARP infrastructure
export const DEFAULT_MAP_CENTER: [number, number] = [41.8781, -87.6298]; // Chicago, IL
export const DEFAULT_MAP_ZOOM = 10; // Zoom level to see city details

export const FLOOD_RISK_COLORS = {
  low: '#10B981', // Green
  medium: '#F59E0B', // Amber
  high: '#EF4444', // Red
  critical: '#7C2D12', // Dark Red
};

export const WEATHER_CONDITIONS = {
  sunny: {
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
    icon: 'sun',
  },
  cloudy: {
    color: '#64748B',
    gradient: 'from-gray-400 to-gray-600',
    icon: 'cloud',
  },
  rainy: {
    color: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600',
    icon: 'cloud-rain',
  },
  stormy: {
    color: '#6B21A8',
    gradient: 'from-purple-600 to-purple-800',
    icon: 'zap',
  },
  foggy: {
    color: '#9CA3AF',
    gradient: 'from-gray-300 to-gray-500',
    icon: 'cloud-fog',
  },
};

export const ALERT_LEVELS = {
  info: {
    color: '#06B6D4',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-900',
    icon: 'info',
  },
  warning: {
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    icon: 'alert-triangle',
  },
  danger: {
    color: '#EF4444',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    icon: 'alert-circle',
  },
  critical: {
    color: '#7C2D12',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-950',
    icon: 'shield-alert',
  },
};

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.6,
      type: 'spring',
      damping: 15,
    },
  },
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

export const MAP_LAYERS = {
  street: {
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri',
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
  },
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: 'layout-dashboard' },
  { id: 'map', label: 'Flood Map', href: '/map', icon: 'map' },
  { id: 'weather', label: 'Weather', href: '/weather', icon: 'cloud' },
  { id: 'alerts', label: 'Alerts', href: '/alerts', icon: 'bell' },
  {
    id: 'statistics',
    label: 'Statistics',
    href: '/statistics',
    icon: 'bar-chart',
  },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' },
];

export const US_REGIONS = [
  { id: 'new_york', name: 'New York, NY', coordinates: [40.7128, -74.0060] },
  { id: 'los_angeles', name: 'Los Angeles, CA', coordinates: [34.0522, -118.2437] },
  { id: 'chicago', name: 'Chicago, IL', coordinates: [41.8781, -87.6298] },
  { id: 'houston', name: 'Houston, TX', coordinates: [29.7604, -95.3698] },
  { id: 'phoenix', name: 'Phoenix, AZ', coordinates: [33.4484, -112.0740] },
  { id: 'philadelphia', name: 'Philadelphia, PA', coordinates: [39.9526, -75.1652] },
  { id: 'san_antonio', name: 'San Antonio, TX', coordinates: [29.4241, -98.4936] },
  { id: 'san_diego', name: 'San Diego, CA', coordinates: [32.7157, -117.1611] },
  { id: 'dallas', name: 'Dallas, TX', coordinates: [32.7767, -96.7970] },
  { id: 'san_jose', name: 'San Jose, CA', coordinates: [37.3382, -121.8863] },
];

export const WEATHER_MOCK_DATA = {
  id: 'weather-newyork',
  regionId: 'new_york',
  temperature: 72, // Fahrenheit sample
  humidity: 60,
  windSpeed: 8,
  windDirection: 'SE',
  pressure: 1013,
  visibility: 10,
  uvIndex: 6,
  condition: 'cloudy' as const,
  description: 'Partly cloudy with chance of rain',
  icon: 'cloud',
  timestamp: new Date().toISOString(),
};

export const WEATHER_STATIONS_GLOBAL_MOCK = [
  {
    id: 'ws-newyork',
    name: 'NYC Weather Station',
    coordinates: [40.7128, -74.0060],
    temperature: 72,
    humidity: 60,
    windSpeed: 8,
    pressure: 1013,
    description: 'Partly Cloudy',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'ws-losangeles',
    name: 'Los Angeles Weather Station',
    coordinates: [34.0522, -118.2437],
    temperature: 78,
    humidity: 50,
    windSpeed: 6,
    pressure: 1010,
    description: 'Sunny',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'ws-chicago',
    name: 'Chicago Weather Station',
    coordinates: [41.8781, -87.6298],
    temperature: 65,
    humidity: 70,
    windSpeed: 10,
    pressure: 1012,
    description: 'Cloudy',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'ws-houston',
    name: 'Houston Weather Station',
    coordinates: [29.7604, -95.3698],
    temperature: 80,
    humidity: 70,
    windSpeed: 12,
    pressure: 1009,
    description: 'Humid',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'ws-phoenix',
    name: 'Phoenix Weather Station',
    coordinates: [33.4484, -112.0740],
    temperature: 90,
    humidity: 20,
    windSpeed: 5,
    pressure: 1015,
    description: 'Hot',
    timestamp: new Date().toISOString(),
  },
];

export const FLOOD_MOCK_ALERTS = [
  {
    id: '1',
    regionId: 'california',
    level: 'critical' as const,
    title: 'Flash Flooding & Debris Flow - California Hills',
    message:
      'Heavy convective storms caused rapid runoff and debris flows in hillside communities. Evacuations advised for low-lying roads.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isActive: true,
    affectedAreas: ['Los Angeles County', 'San Bernardino', 'Riverside'],
    actions: ['Avoid canyon roads', 'Follow evacuation orders'],
    coordinates: [34.2, -118.4] as [number, number],
  },
  {
    id: '2',
    regionId: 'mississippi',
    level: 'danger' as const,
    title: 'Mississippi River Flooding - Riverine Rise',
    message:
      'Prolonged upstream rain and dam releases are causing the Mississippi River to rise above flood stage. Monitor levee conditions.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isActive: true,
    affectedAreas: ['Baton Rouge', 'New Orleans', 'Vicksburg'],
    actions: ['Prepare to sandbag', 'Move valuables to higher ground'],
    coordinates: [30.45, -91.15] as [number, number],
  },
  {
    id: '3',
    regionId: 'texas',
    level: 'warning' as const,
    title: 'Urban Flash Flooding - Houston',
    message:
      'Intense thunderstorms produced extreme rainfall rates, causing rapid urban flooding and roadway inundation across the metro area.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    isActive: true,
    affectedAreas: ['Harris County', 'Pasadena', 'Baytown'],
    actions: ['Avoid flooded roads', 'Do not drive through standing water'],
    coordinates: [29.76, -95.37] as [number, number],
  },
  {
    id: '4',
    regionId: 'new_york',
    level: 'warning' as const,
    title: 'Coastal Tidal Flooding & Ponding - NYC',
    message:
      'Astronomical tides combined with onshore wind increase risk of tidal flooding in coastal neighborhoods.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isActive: true,
    affectedAreas: ['Lower Manhattan', 'Battery Park', 'Red Hook'],
    actions: ['Avoid coastal roads', 'Monitor local NWS statements'],
    coordinates: [40.71, -74.01] as [number, number],
  },
  {
    id: '5',
    regionId: 'florida',
    level: 'warning' as const,
    title: 'Coastal Flooding & Storm Surge - Miami',
    message: 'Tropical moisture and strong onshore winds raising coastal water levels, localized flooding expected.',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    isActive: true,
    affectedAreas: ['Miami Beach', 'Downtown Miami'],
    actions: ['Avoid low-lying coastal areas', 'Follow city advisories'],
    coordinates: [25.77, -80.19] as [number, number],
  },
  {
    id: '6',
    regionId: 'illinois',
    level: 'warning' as const,
    title: 'River Flood Watch - Chicago Tributaries',
    message: 'Persistent rainfall causing tributaries to rise; localized street flooding and basement flooding reported.',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    isActive: true,
    affectedAreas: ['Chicago', 'Evanston', 'Oak Park'],
    actions: ['Secure basement utilities', 'Avoid underpasses'],
    coordinates: [41.88, -87.63] as [number, number],
  },
];

export const FLOOD_ZONES_MOCK = [
  {
    id: 'zone-1',
    regionId: 'new-orleans',
    name: 'Lakeview',
    riskLevel: 'high' as const,
    coordinates: [
      [29.99, -90.08],
      [29.99, -90.06],
      [29.97, -90.06],
      [29.97, -90.08],
    ] as [number, number][],
    area: 2.5,
    population: 45000,
    lastUpdate: new Date().toISOString(),
  },
];

export const EVACUATION_LOCATIONS_MOCK = [
  {
    id: 1,
    name: 'Brooklyn Community Sports Complex',
    address: '121 1st Ave, Brooklyn, NY',
    latitude: 40.714,
    longitude: -73.989,
    capacity_current: 150,
    capacity_total: 200,
    facilities: ['Tents', 'Community Kitchen', 'Sanitation', 'Medical Station'],
    contact_person: 'Mr. John',
    contact_phone: '+1-212-555-0123',
    last_updated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'Queens Community School Shelter',
    address: '25 Maple St, Queens, NY',
    latitude: 40.723,
    longitude: -73.95,
    capacity_current: 80,
    capacity_total: 100,
    facilities: ['Classrooms', 'Sanitation', 'Clean Water'],
    contact_person: 'Ms. Smith',
    contact_phone: '+1-212-555-0456',
    last_updated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'Harris County Community Center',
    address: '6010 N Shepherd Dr, Houston, TX',
    latitude: 29.7604,
    longitude: -95.3698,
    capacity_current: 250,
    capacity_total: 400,
    facilities: ['Gymnasium', 'Community Kitchen', 'Medical Station'],
    contact_person: 'Ms. Angela',
    contact_phone: '+1-713-555-0199',
    last_updated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    name: 'New Orleans Convention Center Annex',
    address: '900 Convention Center Blvd, New Orleans, LA',
    latitude: 29.9511,
    longitude: -90.0702,
    capacity_current: 500,
    capacity_total: 1000,
    facilities: ['Shelter Halls', 'Sanitation', 'Medical Aid'],
    contact_person: 'Mr. Allen',
    contact_phone: '+1-504-555-0110',
    last_updated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    name: 'Miami-Dade Convention Center',
    address: '10901 N Miami Ave, Miami, FL',
    latitude: 25.7933,
    longitude: -80.1445,
    capacity_current: 600,
    capacity_total: 1200,
    facilities: ['Conference Halls', 'Sanitation', 'Medical Aid'],
    contact_person: 'Ms. Rivera',
    contact_phone: '+1-305-555-0147',
    last_updated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    name: 'Los Angeles Convention Center Shelter',
    address: '1201 S Figueroa St, Los Angeles, CA',
    latitude: 34.0407,
    longitude: -118.2692,
    capacity_current: 800,
    capacity_total: 1500,
    facilities: ['Exhibit Halls', 'Sanitation', 'Medical Aid'],
    contact_person: 'LA Shelter Ops',
    contact_phone: '+1-213-555-0166',
    last_updated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    name: 'McCormick Place Emergency Hall',
    address: '2301 S King Dr, Chicago, IL',
    latitude: 41.8517,
    longitude: -87.6176,
    capacity_current: 900,
    capacity_total: 2000,
    facilities: ['Large Halls', 'Medical Support', 'Sanitation'],
    contact_person: 'Chicago EM',
    contact_phone: '+1-312-555-0190',
    last_updated: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    name: 'Dallas Convention Center',
    address: '650 S Griffin St, Dallas, TX',
    latitude: 32.7767,
    longitude: -96.7970,
    capacity_current: 400,
    capacity_total: 1000,
    facilities: ['Halls', 'Medical', 'Food Services'],
    contact_person: 'Dallas EM',
    contact_phone: '+1-214-555-0133',
    last_updated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    name: 'Seattle Center Shelter',
    address: '305 Harrison St, Seattle, WA',
    latitude: 47.6215,
    longitude: -122.3509,
    capacity_current: 200,
    capacity_total: 500,
    facilities: ['Gym', 'Sanitation', 'Medical'],
    contact_person: 'Seattle Relief',
    contact_phone: '+1-206-555-0188',
    last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    name: 'Boston Convention & Exhibition Center',
    address: '415 Summer St, Boston, MA',
    latitude: 42.3467,
    longitude: -71.0414,
    capacity_current: 350,
    capacity_total: 800,
    facilities: ['Exhibit Halls', 'Medical', 'Sanitation'],
    contact_person: 'Boston EM',
    contact_phone: '+1-617-555-0177',
    last_updated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
];
