// lib/noaa-alerts.ts - NOAA Weather Alerts API Integration
// Replaces FLOOD_MOCK_ALERTS with real-time government alerts

import { FloodAlert } from '@/lib/api';

interface NOAAAlertFeature {
  id: string;
  properties: {
    event: string;
    headline: string;
    description: string;
    severity: string;
    urgency: string;
    certainty: string;
    areaDesc: string;
    effective: string;
    ends: string | null;
    status: string;
    messageType: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | null;
  } | null;
}

interface NOAAAlertResponse {
  features: NOAAAlertFeature[];
}

// Major US states with high flood risk
const FLOOD_PRONE_STATES = [
  'LA', 'TX', 'FL', 'MS', 'SC', 'NC', 'VA', 'NY', 'NJ', 'CA',
  'MO', 'IA', 'IL', 'OH', 'PA', 'WV', 'TN', 'AR', 'OK', 'NE'
];

/**
 * Fetch real-time weather alerts from NOAA Weather API
 */
export async function fetchNOAAAlerts(
  stateCodes: string[] = FLOOD_PRONE_STATES,
  eventTypes: string[] = ['Flood', 'Flash Flood', 'Coastal Flood']
): Promise<FloodAlert[]> {
  try {
    console.log('[NOAA Alerts] Fetching real-time alerts...');
    
    // NOAA allows querying multiple states at once
    const stateParam = stateCodes.join(',');
    
    // Query active alerts for specified states
    const url = `https://api.weather.gov/alerts/active?area=${stateParam}&status=actual`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RisqMap/1.0 (flood-monitoring@risqmap.com)',
        'Accept': 'application/geo+json'
      },
      // 10 second timeout
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn(`[NOAA Alerts] API returned ${response.status}`);
      return [];
    }

    const data: NOAAAlertResponse = await response.json();
    
    if (!data.features || data.features.length === 0) {
      console.log('[NOAA Alerts] No active alerts found');
      return [];
    }

    // Filter for flood-related alerts
    const floodAlerts = data.features.filter(feature => {
      const event = feature.properties.event || '';
      return eventTypes.some(type => event.includes(type));
    });

    console.log(`[NOAA Alerts] Found ${floodAlerts.length} flood-related alerts`);

    // Transform to our FloodAlert format
    return transformNOAAAlerts(floodAlerts);
  } catch (error) {
    console.error('[NOAA Alerts] Error fetching alerts:', error);
    return [];
  }
}

/**
 * Transform NOAA alert format to FloodAlert format
 */
function transformNOAAAlerts(features: NOAAAlertFeature[]): FloodAlert[] {
  return features
    .slice(0, 10) // Limit to 10 most relevant alerts
    .map((feature, index) => {
      const props = feature.properties;
      
      // Determine severity level
      const level = mapSeverityToLevel(props.severity, props.urgency);
      
      // Extract coordinates (use first polygon point if available)
      let coordinates: [number, number] | undefined;
      if (feature.geometry?.coordinates?.[0]?.[0]) {
        const coords = feature.geometry.coordinates[0][0];
        coordinates = [coords[1], coords[0]] as [number, number]; // [lat, lon]
      }
      
      // Extract affected areas from description
      const affectedAreas = extractAffectedAreas(props.areaDesc);
      
      return {
        id: feature.id || `noaa-${Date.now()}-${index}`,
        regionId: sanitizeRegionId(affectedAreas[0] || props.areaDesc),
        level: level,
        title: props.event || 'Weather Alert',
        titleEn: props.event || 'Weather Alert',
        message: props.headline || props.description.substring(0, 200),
        messageEn: props.description,
        timestamp: props.effective || new Date().toISOString(),
        isActive: props.status === 'Actual',
        affectedAreas: affectedAreas,
        actions: extractActions(props.description),
        coordinates: coordinates,
      };
    });
}

/**
 * Map NOAA severity/urgency to our alert levels
 */
function mapSeverityToLevel(
  severity: string, 
  urgency: string
): 'info' | 'warning' | 'danger' | 'critical' {
  const sev = severity?.toLowerCase() || '';
  const urg = urgency?.toLowerCase() || '';
  
  // Critical: Extreme severity or immediate urgency
  if (sev === 'extreme' || urg === 'immediate') {
    return 'critical';
  }
  
  // Danger: Severe with expected urgency
  if (sev === 'severe' || urg === 'expected') {
    return 'danger';
  }
  
  // Warning: Moderate severity
  if (sev === 'moderate') {
    return 'warning';
  }
  
  // Info: Minor or future
  return 'info';
}

/**
 * Extract list of affected areas from NOAA description
 */
function extractAffectedAreas(areaDesc: string): string[] {
  if (!areaDesc) return [];
  
  // NOAA uses semicolons to separate areas
  const areas = areaDesc
    .split(';')
    .map(area => area.trim())
    .filter(area => area.length > 0)
    .slice(0, 5); // Limit to 5 areas
  
  return areas;
}

/**
 * Extract recommended actions from NOAA description
 */
function extractActions(description: string): string[] {
  const actions: string[] = [];
  
  // Common action keywords in NOAA alerts
  const actionPatterns = [
    /move to (higher ground|safety)/i,
    /avoid (low.lying areas|flooded roads|standing water)/i,
    /seek (shelter|safety)/i,
    /(evacuate|leave the area)/i,
    /turn around,? don'?t drown/i,
    /monitor (conditions|weather)/i,
  ];
  
  for (const pattern of actionPatterns) {
    const match = description.match(pattern);
    if (match) {
      actions.push(capitalizeFirst(match[0]));
    }
  }
  
  // Default actions if none found
  if (actions.length === 0) {
    actions.push(
      'Monitor local emergency services',
      'Follow official guidance',
      'Stay informed of conditions'
    );
  }
  
  return actions.slice(0, 3); // Limit to 3 actions
}

/**
 * Create a clean region ID from location name
 */
function sanitizeRegionId(location: string): string {
  return location
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fetch alerts with fallback to mock data if API fails
 */
export async function fetchAlertsWithFallback(): Promise<FloodAlert[]> {
  const realAlerts = await fetchNOAAAlerts();
  
  if (realAlerts.length > 0) {
    console.log(`✅ Using ${realAlerts.length} real NOAA alerts`);
    return realAlerts;
  }
  
  // Fallback to mock data if no real alerts
  console.log('⚠️ No NOAA alerts available, using fallback data');
  const { FLOOD_MOCK_ALERTS } = await import('@/lib/constants');
  return FLOOD_MOCK_ALERTS.slice(0, 3); // Limit fallback to 3
}
