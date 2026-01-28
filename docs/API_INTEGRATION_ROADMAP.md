# API Integration Roadmap - RisqMap US Adaptation

## Current State (Phase 1)

### ✅ Already Implemented
1. **USGS Earthquake Data** (`lib/api.client.ts`)
   - Endpoint: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
   - Updates: Real-time
   - Status: **PRODUCTION**

2. **Open-Meteo Weather API** (`hooks/useWeatherData.ts`)
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Data: Temperature, precipitation, wind, humidity
   - Updates: Hourly
   - Status: **PRODUCTION**

3. **Mock Data Generators** (`lib/mock-data.ts`)
   - Water level monitoring stations
   - Pump status infrastructure
   - Flood alerts
   - Status: **TEMPORARY** (replace with real APIs)

### 📊 Current Dashboard Metrics
All metrics now **dynamically calculated** from data sources (see `lib/metrics-calculator.ts`):
- ✅ Total Regions: Based on unique monitoring locations
- ✅ Active Alerts: Counts stations with alert/danger status
- ✅ Flood Zones: Geographic grid-based zone counting
- ✅ People at Risk: Population estimation from alert severity
- ✅ Weather Stations: Active monitoring infrastructure count
- ✅ Percentage Changes: Historical comparison with 7-day baseline

---

## Phase 2: Real-Time Water & Infrastructure Data

### Priority 1: USGS Water Services API
**Replace:** `generateMockWaterLevels()` in `lib/mock-data.ts`

**API Documentation:** https://waterservices.usgs.gov/rest/

#### Implementation Plan

```typescript
// lib/usgs-water.ts
export interface USGSWaterSite {
  siteCode: string;
  siteName: string;
  latitude: number;
  longitude: number;
  currentLevel: number;
  unit: string;
  timestamp: string;
  floodStage?: number;
  actionStage?: number;
}

export async function fetchUSGSWaterLevels(
  stateCodes?: string[]
): Promise<WaterLevelPost[]> {
  // USGS Instantaneous Values endpoint
  const baseUrl = 'https://waterservices.usgs.gov/nwis/iv/';
  
  // Parameters:
  // - format=json
  // - parameterCd=00065 (Gage height, feet)
  // - siteStatus=active
  // - stateCd=us (all US states, or specific state codes)
  
  const params = new URLSearchParams({
    format: 'json',
    parameterCd: '00065', // Gage height
    siteStatus: 'active',
    stateCd: stateCodes?.join(',') || 'us'
  });
  
  const response = await fetch(`${baseUrl}?${params}`);
  const data = await response.json();
  
  // Transform USGS format to WaterLevelPost format
  return data.value.timeSeries.map(site => ({
    id: site.sourceInfo.siteCode[0].value,
    name: site.sourceInfo.siteName,
    lat: site.sourceInfo.geoLocation.geogLocation.latitude,
    lon: site.sourceInfo.geoLocation.geogLocation.longitude,
    water_level: parseFloat(site.values[0].value[0].value),
    unit: 'ft', // USGS uses feet
    timestamp: site.values[0].value[0].dateTime,
    status: determineFloodStatus(
      parseFloat(site.values[0].value[0].value),
      site.sourceInfo.siteProperty
    )
  }));
}

function determineFloodStatus(
  currentLevel: number,
  siteProperties: any[]
): string {
  // Extract flood stages from site properties
  const floodStage = siteProperties.find(p => p.name === 'Flood stage')?.value;
  const actionStage = siteProperties.find(p => p.name === 'Action stage')?.value;
  
  if (floodStage && currentLevel >= parseFloat(floodStage)) return 'Danger';
  if (actionStage && currentLevel >= parseFloat(actionStage)) return 'Alert 2';
  if (currentLevel >= parseFloat(actionStage || floodStage) * 0.8) return 'Alert 3';
  return 'Normal';
}
```

**Key Sites to Monitor:**
- Mississippi River @ Vicksburg, MS: `07289000`
- Ohio River @ Cincinnati, OH: `03255000`
- Missouri River @ Kansas City, MO: `06893000`
- Sacramento River @ Sacramento, CA: `11447650`

**Files to Update:**
1. Create `lib/usgs-water.ts`
2. Update `app/dashboard/page.tsx`: Replace `generateMockWaterLevels()`
3. Update `hooks/useWaterLevelData.ts`: Use real USGS fetcher

---

### Priority 2: NOAA Flood Predictions
**Add to:** Flood alert system

**API Documentation:** https://api.water.noaa.gov/nwps/v1/docs/

#### Implementation Plan

```typescript
// lib/noaa-flood.ts
export interface NOAAFloodForecast {
  id: string;
  location: string;
  coordinates: [number, number];
  stage: number;
  forecast: {
    timestamp: string;
    predictedStage: number;
    floodCategory: 'none' | 'action' | 'minor' | 'moderate' | 'major';
  }[];
}

export async function fetchNOAAFloodForecasts(
  gageIds: string[]
): Promise<NOAAFloodForecast[]> {
  const baseUrl = 'https://api.water.noaa.gov/nwps/v1/';
  
  // Get forecasts for specific AHPS gages
  const forecasts = await Promise.all(
    gageIds.map(id => 
      fetch(`${baseUrl}gauges/${id}/stageflow/forecast`)
        .then(r => r.json())
    )
  );
  
  return forecasts.map(f => ({
    id: f.location.id,
    location: f.location.name,
    coordinates: [f.location.lat, f.location.lng],
    stage: f.observedStage.value,
    forecast: f.forecast.map(p => ({
      timestamp: p.validTime,
      predictedStage: p.value,
      floodCategory: determineCategory(p.value, f.floodStages)
    }))
  }));
}
```

**Major AHPS Gages:**
- New Orleans, LA: `NORL1`
- Houston, TX: `HGAT2`
- Fargo, ND: `FGON8`
- Pittsburgh, PA: `PTSP1`

---

## Phase 3: FEMA Flood Zones & Population Risk

### Priority 1: FEMA National Flood Hazard Layer (NFHL)
**Use for:** Accurate flood zone boundaries on map

**API:** ArcGIS REST Services
**URL:** https://hazards.fema.gov/gis/nfhl/rest/services/

#### Implementation Plan

```typescript
// lib/fema-nfhl.ts
export interface FEMAFloodZone {
  zoneCode: string; // e.g., 'AE', 'VE', 'X'
  zoneSubtype?: string;
  baseFloodElevation?: number;
  geometry: GeoJSON.Polygon;
  specialty: boolean; // Floodway, coastal high hazard
}

export async function queryFloodZones(
  bbox: [number, number, number, number]
): Promise<FEMAFloodZone[]> {
  const serviceUrl = 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query';
  
  const params = new URLSearchParams({
    geometry: JSON.stringify({
      xmin: bbox[0], ymin: bbox[1],
      xmax: bbox[2], ymax: bbox[3],
      spatialReference: { wkid: 4326 }
    }),
    geometryType: 'esriGeometryEnvelope',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: 'true',
    f: 'geojson'
  });
  
  const response = await fetch(`${serviceUrl}?${params}`);
  const geojson = await response.json();
  
  return geojson.features.map(f => ({
    zoneCode: f.properties.FLD_ZONE,
    zoneSubtype: f.properties.ZONE_SUBTY,
    baseFloodElevation: f.properties.STATIC_BFE,
    geometry: f.geometry,
    specialty: f.properties.FLOODWAY === 'FLOODWAY'
  }));
}
```

**Integration Points:**
1. `components/map/FloodMap.tsx`: Add FEMA zone overlay layer
2. `lib/metrics-calculator.ts`: Use real zone count instead of grid-based

---

### Priority 2: FEMA National Risk Index (NRI)
**Use for:** Expected Annual Loss & Population at Risk

**API:** CSV downloads + custom parsing
**URL:** https://hazards.fema.gov/nri/data-resources

#### Implementation Plan

```typescript
// lib/fema-nri.ts
export interface NRICountyData {
  stateCode: string;
  countyFIPS: string;
  countyName: string;
  population: number;
  buildingValue: number;
  riskRating: string;
  expectedAnnualLoss: {
    total: number;
    flooding: number;
    hurricane: number;
    tornado: number;
    earthquake: number;
  };
  socialVulnerability: number;
  communityResilience: number;
}

// NRI data is updated annually - cache locally
export async function loadNRIData(): Promise<Map<string, NRICountyData>> {
  // Download NRI CSV (updated yearly)
  const csvUrl = 'https://hazards.fema.gov/nri/Content/StaticDocuments/DataDownload/NRI_Table_Counties/NRI_Table_Counties.csv';
  
  const response = await fetch(csvUrl);
  const csvText = await response.text();
  
  // Parse CSV and create lookup by county FIPS
  const counties = parseCSV(csvText);
  return new Map(counties.map(c => [c.countyFIPS, c]));
}

export function calculatePopulationAtRisk(
  affectedCounties: string[],
  nriData: Map<string, NRICountyData>
): number {
  return affectedCounties.reduce((total, fips) => {
    const county = nriData.get(fips);
    return total + (county?.population || 0) * 0.1; // Assume 10% affected
  }, 0);
}
```

**Files to Update:**
1. Create `lib/fema-nri.ts`
2. Update `lib/metrics-calculator.ts`: Use NRI population data
3. Cache NRI data in Supabase for fast lookups

---

## Phase 4: Enhanced Weather & Alerts

### NOAA Weather API
**Replace:** Current Open-Meteo with official NOAA data

**API:** https://api.weather.gov/

#### Implementation Plan

```typescript
// lib/noaa-weather.ts
export async function fetchNOAAWeather(
  lat: number,
  lon: number
): Promise<CombinedWeatherData> {
  // Step 1: Get grid point
  const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
  const point = await fetch(pointUrl, {
    headers: { 'User-Agent': 'RisqMap (contact@risqmap.com)' }
  }).then(r => r.json());
  
  // Step 2: Fetch forecast
  const forecastUrl = point.properties.forecast;
  const forecast = await fetch(forecastUrl, {
    headers: { 'User-Agent': 'RisqMap (contact@risqmap.com)' }
  }).then(r => r.json());
  
  // Step 3: Get active alerts
  const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
  const alerts = await fetch(alertsUrl, {
    headers: { 'User-Agent': 'RisqMap (contact@risqmap.com)' }
  }).then(r => r.json());
  
  return {
    current: transformNOAACurrent(forecast.properties.periods[0]),
    forecast: forecast.properties.periods.map(transformForecastPeriod),
    alerts: alerts.features.map(transformAlert)
  };
}
```

**Advantages over Open-Meteo:**
- Official US government data
- Integrated alert system
- Detailed text forecasts
- No rate limits for personal use

---

## Phase 5: Fire Data Integration (New Tab)

### NASA FIRMS (Fire Information for Resource Management System)
**Purpose:** Active fire detection and monitoring

**API:** https://firms.modaps.eosdis.nasa.gov/api/

#### Implementation Plan

```typescript
// lib/nasa-firms.ts
export interface ActiveFire {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number; // Kelvin
  scan: number; // km²
  track: number; // km²
  acq_date: string;
  acq_time: string;
  satellite: 'MODIS' | 'VIIRS';
  confidence: 'low' | 'nominal' | 'high';
  frp: number; // Fire Radiative Power (MW)
}

export async function fetchActiveFires(
  bbox: [number, number, number, number],
  days: number = 7
): Promise<ActiveFire[]> {
  const apiKey = process.env.NASA_FIRMS_API_KEY;
  const baseUrl = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
  
  // VIIRS has higher resolution than MODIS
  const url = `${baseUrl}/${apiKey}/VIIRS_NOAA20_NRT/${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}/${days}`;
  
  const response = await fetch(url);
  const csv = await response.text();
  
  return parseFireCSV(csv);
}
```

**UI Implementation:**
1. Create `/app/fire-monitoring/page.tsx`
2. Add fire layer to map with heat intensity colors
3. Show active fires in sidebar with containment status
4. Alert when fires within X miles of user location

### NIFC Fire Perimeters
**Purpose:** Wildfire boundaries and incident information

**API:** https://data-nifc.opendata.arcgis.com/

```typescript
// lib/nifc-fires.ts
export interface WildfirePerimeter {
  incidentName: string;
  acres: number;
  containment: number; // percentage
  geometry: GeoJSON.Polygon;
  discoveryDate: string;
  controlDate?: string;
  irwinID: string;
}

export async function fetchWildfirePerimeters(
  state?: string
): Promise<WildfirePerimeter[]> {
  const url = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Perimeters/FeatureServer/0/query';
  
  const params = new URLSearchParams({
    where: state ? `POOState='${state}'` : '1=1',
    outFields: '*',
    f: 'geojson'
  });
  
  const response = await fetch(`${url}?${params}`);
  const data = await response.json();
  
  return data.features.map(transformPerimeter);
}
```

---

## Phase 6: RisqMap Property-Level Integration

**Project:** `RisqMap/` subfolder
**Purpose:** Property-specific hazard scoring (freemium feature)

### Current RisqMap APIs (Already Implemented)
Located in `RisqMap/src/lib/`:
- ✅ `floodApi.ts`: FEMA flood zones + elevation analysis
- ✅ `fireApi.ts`: Wildfire risk using SILVIS WUI data
- ✅ `earthquakeApi.ts`: USGS seismic hazard maps
- ✅ `tornadoApi.ts`: Historical tornado tracks
- ✅ `heatApi.ts`: Heat island effect analysis
- ✅ `windApi.ts`: Wind exposure modeling
- ✅ `hailApi.ts`: Hail frequency data
- ✅ `winterApi.ts`: Winter storm patterns
- ✅ `airQualityApi.ts`: EPA air quality index

### Integration Strategy
1. **Move RisqMap features to main app navigation**
   - Add "Property Scan" tab to main nav
   - Implement freemium model: 1 free scan, $X for detailed report
   
2. **Share data sources between flood monitoring & property scans**
   - Use same FEMA API for both dashboards
   - Consolidate USGS earthquake data
   
3. **Create unified risk scoring**
   - Dashboard: Regional flood risk (0-100)
   - Property Scan: Multi-hazard score (8 hazards combined)

---

## Implementation Timeline

### Week 1-2: USGS Water Data
- [ ] Implement `lib/usgs-water.ts`
- [ ] Replace mock water level data
- [ ] Test with major river systems
- [ ] Update dashboard metrics

### Week 3-4: NOAA Flood Forecasts
- [ ] Implement `lib/noaa-flood.ts`
- [ ] Add forecast visualization to map
- [ ] Create prediction timeline component

### Week 5-6: FEMA Flood Zones
- [ ] Implement `lib/fema-nfhl.ts`
- [ ] Add zone overlay to map
- [ ] Update zone counting in metrics

### Week 7-8: FEMA NRI Population Data
- [ ] Download and parse NRI dataset
- [ ] Cache in Supabase
- [ ] Update people-at-risk calculation

### Week 9-10: NOAA Weather Integration
- [ ] Replace Open-Meteo with NOAA API
- [ ] Add severe weather alerts
- [ ] Integrate with dashboard

### Week 11-12: Fire Monitoring Tab
- [ ] Create fire monitoring page
- [ ] Integrate NASA FIRMS
- [ ] Add NIFC perimeters
- [ ] Implement fire alerts

### Week 13+: RisqMap Integration
- [ ] Move property scan to main app
- [ ] Implement freemium model
- [ ] Consolidate shared APIs
- [ ] Launch unified platform

---

## API Keys Required

| Service | Key Required | Cost | Rate Limit |
|---------|-------------|------|------------|
| USGS Water Services | ❌ No | Free | None |
| USGS Earthquakes | ❌ No | Free | None |
| NOAA Weather | ❌ No | Free | None |
| NOAA Flood | ❌ No | Free | None |
| FEMA NFHL | ❌ No | Free | 1000 req/hr |
| FEMA NRI | ❌ No | Free | Download only |
| Open-Meteo | ❌ No | Free | 10,000 req/day |
| NASA FIRMS | ✅ Yes | Free | 10,000 req/day |
| Google Gemini | ✅ Yes | $0.001/1K chars | 60 req/min |

**Get API Keys:**
- NASA FIRMS: https://firms.modaps.eosdis.nasa.gov/api/
- Google Gemini: Already configured in `.env.local`

---

## Data Refresh Intervals

| Data Type | Refresh Rate | Cache Strategy |
|-----------|-------------|----------------|
| USGS Water Levels | 15 minutes | Edge cache, 5min TTL |
| Earthquake Data | 1 minute | Client polling |
| Weather Forecast | 1 hour | ISR revalidation |
| NOAA Flood Forecasts | 6 hours | Database cache |
| FEMA Flood Zones | Static | CDN cache forever |
| FEMA NRI Data | Yearly | Database cache |
| Active Fires | 12 hours | Edge cache |

---

## Migration Checklist

- [x] Create metrics calculator service
- [x] Implement percentage change logic
- [x] Fix pump status classifications
- [x] Update mock data distributions
- [ ] Test dashboard with current mock data
- [ ] Implement USGS water data fetcher
- [ ] Replace water level mocks with real API
- [ ] Add NOAA flood forecast integration
- [ ] Implement FEMA zone overlay
- [ ] Cache NRI population data
- [ ] Create fire monitoring tab
- [ ] Integrate RisqMap property scans
- [ ] Launch production with all real APIs

---

## Contact & Support

**Questions about implementation?**
- USGS Water Data: https://waterservices.usgs.gov/contact/
- NOAA Support: https://weather-gov.github.io/api/
- FEMA NFHL: https://www.fema.gov/about/organization/regions
- NASA FIRMS: firms-support@earthdata.nasa.gov

**Project Maintainer:** RisqMap Development Team
**Documentation:** See `/docs` folder for detailed guides
