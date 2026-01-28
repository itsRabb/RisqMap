/**
 * USGS Water Services API Integration
 * Real-time water level data from 10,000+ US monitoring stations
 * 
 * API Documentation: https://waterservices.usgs.gov/rest/
 * Data: Gage height (water level) from active streamgages
 * Update Frequency: Every 15 minutes
 * Rate Limit: None (public API)
 */

import { WaterLevelPost } from './api';

interface USGSSiteValue {
  value: string;
  qualifiers: string[];
  dateTime: string;
}

interface USGSTimeSeries {
  sourceInfo: {
    siteName: string;
    siteCode: Array<{ value: string; agencyCode: string }>;
    geoLocation: {
      geogLocation: {
        latitude: number;
        longitude: number;
      };
    };
    siteProperty?: Array<{
      name: string;
      value: string;
    }>;
  };
  variable: {
    variableName: string;
    unit: {
      unitCode: string;
    };
  };
  values: Array<{
    value: Array<USGSSiteValue>;
  }>;
}

interface USGSResponse {
  value: {
    timeSeries: USGSTimeSeries[];
  };
}

/**
 * Major US river monitoring stations - NATIONWIDE COVERAGE
 * Covering all 50 states with high-priority flood monitoring sites
 */
export const MAJOR_USGS_SITES = [
  // === MISSISSIPPI RIVER BASIN (10 states) ===
  '07289000', // Mississippi River at Vicksburg, MS
  '07374000', // Mississippi River at Baton Rouge, LA
  '07010000', // Mississippi River at St. Louis, MO
  '05331000', // Mississippi River at St. Paul, MN
  '07047970', // Mississippi River at Memphis, TN
  '07144100', // Arkansas River at Wichita, KS
  '05587450', // Mississippi River at Grafton, IL
  '05420500', // Mississippi River at Clinton, IA
  '05587500', // Mississippi River near Grafton, IL
  
  // === OHIO RIVER BASIN (6 states) ===
  '03255000', // Ohio River at Cincinnati, OH
  '03290500', // Ohio River at Louisville, KY
  '03612500', // Ohio River at Metropolis, IL
  '03303280', // Ohio River at Cannelton Dam, IN
  '03234500', // Scioto River at Columbus, OH
  '03049500', // Allegheny River at Pittsburgh, PA
  
  // === MISSOURI RIVER BASIN (7 states) ===
  '06893000', // Missouri River at Kansas City, MO
  '06610000', // Missouri River at Omaha, NE
  '06934500', // Missouri River at Hermann, MO
  '06214500', // Yellowstone River at Billings, MT
  '06185500', // Missouri River near Culbertson, MT
  '06342500', // Missouri River at Bismarck, ND
  '06486000', // Missouri River at Sioux City, IA
  
  // === ATLANTIC COAST (9 states) ===
  '02089500', // Neuse River at Kinston, NC
  '02175000', // Congaree River at Columbia, SC
  '02035000', // James River at Richmond, VA
  '01463500', // Delaware River at Trenton, NJ
  '01434000', // Delaware River at Port Jervis, NY
  '02231000', // St Johns River at Jacksonville, FL
  '02140991', // Catawba River at Rock Hill, SC
  '01578310', // Susquehanna River at Harrisburg, PA
  '01646500', // Potomac River at Washington DC
  '01104500', // Charles River at Waltham, MA
  
  // === TEXAS (8 major rivers) ===
  '08041000', // Sabine River near Ruliff, TX
  '08068500', // West Fork San Jacinto River near Humble, TX
  '08074000', // Buffalo Bayou at Houston, TX
  '08045000', // Trinity River at Fort Worth, TX
  '08057000', // Trinity River at Dallas, TX
  '08176500', // Guadalupe River at Victoria, TX
  '08211000', // Nueces River at Calallen, TX
  '08065000', // Trinity River near Crockett, TX
  
  // === CALIFORNIA (8 major rivers) ===
  '11447650', // Sacramento River at Sacramento, CA
  '11453000', // Sacramento River at Freeport, CA
  '11447500', // Sacramento River at Sacramento, CA
  '11425500', // Sacramento River at Verona, CA
  '11303500', // San Joaquin River near Vernalis, CA
  '11187000', // Kern River below Isabella Dam, CA
  '11074000', // Santa Ana River below Prado Dam, CA
  '11098000', // Los Angeles River at Long Beach, CA
  
  // === PACIFIC NORTHWEST (4 states) ===
  '14211720', // Willamette River at Portland, OR
  '14128910', // Columbia River at The Dalles, OR
  '12113000', // Green River at Auburn, WA
  '13010065', // Snake River at Flagg Ranch, WY
  '12340500', // Clark Fork at St. Regis, MT
  
  // === GREAT LAKES REGION (5 states) ===
  '04087000', // Milwaukee River at Milwaukee, WI
  '04177000', // St. Joseph River at Fort Wayne, IN
  '04127997', // Grand River at Grand Rapids, MI
  '04164100', // Clinton River at Mount Clemens, MI
  '03371650', // White River at Petersburg, IN
  
  // === FLORIDA (7 major rivers) ===
  '02296750', // Peace River at Arcadia, FL
  '02312600', // Suwannee River near Wilcox, FL
  '02303000', // Hillsborough River at Tampa, FL
  '02244040', // St. Johns River at Deland, FL
  '02296500', // Myakka River near Sarasota, FL
  '02323500', // Santa Fe River near Fort White, FL
  '02326550', // Ochlockonee River near Havana, FL
  
  // === SOUTHEAST (AL, GA, TN, AR, LA) ===
  '02361000', // Chattahoochee River at Columbus, GA
  '02218500', // Ocmulgee River at Macon, GA
  '02342500', // Chattahoochee River at Atlanta, GA
  '03574500', // Tennessee River at Chattanooga, TN
  '07047970', // Mississippi River at Memphis, TN
  '07263620', // Arkansas River at Little Rock, AR
  '07267000', // Red River at Alexandria, LA
  '02469761', // Alabama River at Claiborne, AL
  
  // === SOUTHWEST (AZ, NM, NV, UT, CO) ===
  '09510000', // Salt River at Roosevelt, AZ
  '09522000', // Colorado River at Yuma, AZ
  '09380000', // Colorado River at Lees Ferry, AZ
  '08330000', // Rio Grande at Albuquerque, NM
  '08313000', // Rio Grande at Otowi Bridge, NM
  '10172200', // Jordan River at Salt Lake City, UT
  '09380000', // Colorado River at Lees Ferry, AZ (Grand Canyon)
  '06754000', // South Platte River at Denver, CO
  
  // === NORTHEAST (ME, NH, VT, CT, RI) ===
  '01030500', // Penobscot River at West Enfield, ME
  '01054200', // Androscoggin River near Auburn, ME
  '01092000', // Merrimack River at Lowell, MA
  '01144000', // Connecticut River at White River Junction, VT
  '01193500', // Connecticut River at Hartford, CT
  
  // === PLAINS STATES (OK, KS, NE, SD) ===
  '07164500', // Arkansas River at Tulsa, OK
  '07151500', // Arkansas River at Derby, KS
  '06796000', // Platte River at Louisville, NE
  '06468250', // Big Sioux River at Akron, IA
  '06471000', // Big Sioux River at Brookings, SD
  
  // === ALASKA & HAWAII ===
  '15515500', // Yukon River at Eagle, AK
  '16400000', // Ala Wai Canal at Honolulu, HI
  
  // === ADDITIONAL HIGH-RISK AREAS ===
  '05474500', // Des Moines River at Des Moines, IA
  '03612500', // Ohio River at Metropolis, IL
  '06610000', // Missouri River at Omaha, NE
  '05465500', // Iowa River at Iowa City, IA
  '05531500', // Des Plaines River at Riverside, IL (Chicago area)
];

/**
 * Fetch real-time water levels from USGS for specific sites
 * Now supports batch fetching with multiple API calls for large site lists
 */
export async function fetchUSGSWaterLevels(
  siteNumbers?: string[]
): Promise<WaterLevelPost[]> {
  const sites = siteNumbers || MAJOR_USGS_SITES;
  
  // USGS API has URL length limits, so batch sites into groups of 50
  const BATCH_SIZE = 50;
  const batches: string[][] = [];
  for (let i = 0; i < sites.length; i += BATCH_SIZE) {
    batches.push(sites.slice(i, i + BATCH_SIZE));
  }
  
  const baseUrl = 'https://waterservices.usgs.gov/nwis/iv/';
  const allResults: WaterLevelPost[] = [];
  
  // Fetch all batches in parallel for performance
  const batchPromises = batches.map(async (batch) => {
    const sitesParam = batch.join(',');
    const params = new URLSearchParams({
      format: 'json',
      sites: sitesParam,
      parameterCd: '00065', // Gage height (water level)
      siteStatus: 'active'
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`, {
        headers: {
          'Accept': 'application/json',
        },
        // 30 second timeout
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        console.warn(`USGS API error for batch: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: USGSResponse = await response.json();
      
      if (!data.value?.timeSeries || data.value.timeSeries.length === 0) {
        return [];
      }

      return transformUSGSData(data.value.timeSeries);
    } catch (error) {
      console.error('Error fetching USGS batch:', error);
      return [];
    }
  });

  try {
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(batch => allResults.push(...batch));
    
    if (allResults.length === 0) {
      console.warn('No USGS water level data available from any batch');
    }
    
    return allResults;
  } catch (error) {
    console.error('Error fetching USGS water levels:', error);
    return [];
  }
}

/**
 * Fetch water levels by state code
 */
export async function fetchUSGSWaterLevelsByState(
  stateCodes: string[]
): Promise<WaterLevelPost[]> {
  const stateParam = stateCodes.join(',');
  
  const baseUrl = 'https://waterservices.usgs.gov/nwis/iv/';
  const params = new URLSearchParams({
    format: 'json',
    stateCd: stateParam,
    parameterCd: '00065',
    siteStatus: 'active',
    siteType: 'ST' // Stream sites only
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data: USGSResponse = await response.json();
    return transformUSGSData(data.value.timeSeries);
  } catch (error) {
    console.error('Error fetching USGS water levels by state:', error);
    return [];
  }
}

/**
 * Transform USGS API format to our WaterLevelPost format
 */
function transformUSGSData(timeSeries: USGSTimeSeries[]): WaterLevelPost[] {
  return timeSeries
    .filter(site => site.values[0]?.value?.length > 0)
    .map((site, index) => {
      const latestValue = site.values[0].value[0];
      const waterLevelFeet = parseFloat(latestValue.value);
      const waterLevelMeters = parseFloat((waterLevelFeet * 0.3048).toFixed(2)); // Convert feet to meters and round to 2 decimals
      
      // Extract flood stages from site properties
      const floodStage = extractFloodStage(site.sourceInfo.siteProperty, 'Flood stage');
      const actionStage = extractFloodStage(site.sourceInfo.siteProperty, 'Action stage');
      
      // Determine status based on flood stages
      const status = determineFloodStatus(waterLevelFeet, floodStage, actionStage);
      
      // Convert station name to title case (Delaware River at Trenton instead of DELAWARE RIVER AT TRENTON)
      const stationName = toTitleCase(site.sourceInfo.siteName);
      
      return {
        id: site.sourceInfo.siteCode[0].value,
        name: stationName,
        lat: site.sourceInfo.geoLocation.geogLocation.latitude,
        lon: site.sourceInfo.geoLocation.geogLocation.longitude,
        water_level: waterLevelMeters,
        unit: 'm',
        timestamp: latestValue.dateTime,
        status: status,
        // Store original feet value for reference
        metadata: {
          waterLevelFeet,
          floodStageFeet: floodStage,
          actionStageFeet: actionStage,
          source: 'USGS',
          siteCode: site.sourceInfo.siteCode[0].value
        }
      };
    });
}

/**
 * Convert string to title case (Delaware River at Trenton)
 * Preserves state abbreviations like MD, PA, OH, etc.
 */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      // Check if this is a state abbreviation (2 letters, uppercase in original, and near the end or after a comma)
      const isStateAbbr = word.length === 2 && 
                         (index === array.length - 1 || 
                          (index > 0 && array[index - 1].endsWith(',')));
      
      if (isStateAbbr) {
        return word.toUpperCase();
      }
      
      // Capitalize first letter of all other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Extract flood stage values from site properties
 */
function extractFloodStage(
  properties: Array<{ name: string; value: string }> | undefined,
  stageName: string
): number | undefined {
  if (!properties) return undefined;
  
  const stage = properties.find(p => p.name === stageName);
  if (!stage) return undefined;
  
  const value = parseFloat(stage.value);
  return isNaN(value) ? undefined : value;
}

/**
 * Determine flood status based on current level and thresholds
 */
function determineFloodStatus(
  currentLevelFeet: number,
  floodStageFeet?: number,
  actionStageFeet?: number
): string {
  // If we have official flood stages, use them
  if (floodStageFeet) {
    const majorFlood = floodStageFeet * 1.2; // 20% above flood stage
    const moderateFlood = floodStageFeet;
    const minorFlood = floodStageFeet * 0.9; // 90% of flood stage
    
    if (currentLevelFeet >= majorFlood) return 'Danger';
    if (currentLevelFeet >= moderateFlood) return 'Alert 2';
    if (currentLevelFeet >= minorFlood) return 'Alert 3';
  }
  
  // If we have action stage, use it
  if (actionStageFeet) {
    if (currentLevelFeet >= actionStageFeet * 1.5) return 'Alert 2';
    if (currentLevelFeet >= actionStageFeet) return 'Alert 3';
  }
  
  // Generic thresholds based on typical river levels
  // Most rivers have normal levels between 2-15 feet
  if (currentLevelFeet >= 25) return 'Danger';
  if (currentLevelFeet >= 20) return 'Alert 2';
  if (currentLevelFeet >= 15) return 'Alert 3';
  if (currentLevelFeet >= 10) return 'Alert 1';
  
  return 'Normal';
}

/**
 * Get USGS site information (for detailed views)
 */
export async function getUSGSSiteInfo(siteNumber: string) {
  const baseUrl = 'https://waterservices.usgs.gov/nwis/site/';
  const params = new URLSearchParams({
    format: 'json',
    sites: siteNumber,
    siteOutput: 'expanded'
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) throw new Error(`USGS API error: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching USGS site info:', error);
    return null;
  }
}

/**
 * US State codes for regional queries
 */
export const US_STATE_CODES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};
