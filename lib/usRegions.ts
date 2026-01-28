// Minimal US regions dataset used as a fallback/static source.
// Exports a list of states (as `province_*` fields for backward compatibility)
// and functions to lookup counties/cities (currently return empty arrays,
// can be extended with external geocoding later).

export const STATES = [
  { province_code: 'AL', province_name: 'Alabama', province_latitude: 32.806671, province_longitude: -86.791130 },
  { province_code: 'AK', province_name: 'Alaska', province_latitude: 61.370716, province_longitude: -152.404419 },
  { province_code: 'AZ', province_name: 'Arizona', province_latitude: 33.729759, province_longitude: -111.431221 },
  { province_code: 'AR', province_name: 'Arkansas', province_latitude: 34.969704, province_longitude: -92.373123 },
  { province_code: 'CA', province_name: 'California', province_latitude: 36.116203, province_longitude: -119.681564 },
  { province_code: 'CO', province_name: 'Colorado', province_latitude: 39.059811, province_longitude: -105.311104 },
  { province_code: 'CT', province_name: 'Connecticut', province_latitude: 41.597782, province_longitude: -72.755371 },
  { province_code: 'DE', province_name: 'Delaware', province_latitude: 39.318523, province_longitude: -75.507141 },
  { province_code: 'FL', province_name: 'Florida', province_latitude: 27.766279, province_longitude: -81.686783 },
  { province_code: 'GA', province_name: 'Georgia', province_latitude: 33.040619, province_longitude: -83.643074 },
  { province_code: 'HI', province_name: 'Hawaii', province_latitude: 21.094318, province_longitude: -157.498337 },
  { province_code: 'ID', province_name: 'Idaho', province_latitude: 44.240459, province_longitude: -114.478828 },
  { province_code: 'IL', province_name: 'Illinois', province_latitude: 40.349457, province_longitude: -88.986137 },
  { province_code: 'IN', province_name: 'Indiana', province_latitude: 39.849426, province_longitude: -86.258278 },
  { province_code: 'IA', province_name: 'Iowa', province_latitude: 42.011539, province_longitude: -93.210526 },
  { province_code: 'KS', province_name: 'Kansas', province_latitude: 38.526600, province_longitude: -96.726486 },
  { province_code: 'KY', province_name: 'Kentucky', province_latitude: 37.668140, province_longitude: -84.670067 },
  { province_code: 'LA', province_name: 'Louisiana', province_latitude: 31.169546, province_longitude: -91.867805 },
  { province_code: 'ME', province_name: 'Maine', province_latitude: 44.693947, province_longitude: -69.381927 },
  { province_code: 'MD', province_name: 'Maryland', province_latitude: 39.063946, province_longitude: -76.802101 },
  { province_code: 'MA', province_name: 'Massachusetts', province_latitude: 42.230171, province_longitude: -71.530106 },
  { province_code: 'MI', province_name: 'Michigan', province_latitude: 43.326618, province_longitude: -84.536095 },
  { province_code: 'MN', province_name: 'Minnesota', province_latitude: 45.694454, province_longitude: -93.900192 },
  { province_code: 'MS', province_name: 'Mississippi', province_latitude: 32.741646, province_longitude: -89.678696 },
  { province_code: 'MO', province_name: 'Missouri', province_latitude: 38.456085, province_longitude: -92.288368 },
  { province_code: 'MT', province_name: 'Montana', province_latitude: 46.921925, province_longitude: -110.454353 },
  { province_code: 'NE', province_name: 'Nebraska', province_latitude: 41.125370, province_longitude: -98.268082 },
  { province_code: 'NV', province_name: 'Nevada', province_latitude: 38.313515, province_longitude: -117.055374 },
  { province_code: 'NH', province_name: 'New Hampshire', province_latitude: 43.452492, province_longitude: -71.563896 },
  { province_code: 'NJ', province_name: 'New Jersey', province_latitude: 40.298904, province_longitude: -74.521011 },
  { province_code: 'NM', province_name: 'New Mexico', province_latitude: 34.840515, province_longitude: -106.248482 },
  { province_code: 'NY', province_name: 'New York', province_latitude: 42.165726, province_longitude: -74.948051 },
  { province_code: 'NC', province_name: 'North Carolina', province_latitude: 35.630066, province_longitude: -79.806419 },
  { province_code: 'ND', province_name: 'North Dakota', province_latitude: 47.528912, province_longitude: -99.784012 },
  { province_code: 'OH', province_name: 'Ohio', province_latitude: 40.388783, province_longitude: -82.764915 },
  { province_code: 'OK', province_name: 'Oklahoma', province_latitude: 35.565342, province_longitude: -96.928917 },
  { province_code: 'OR', province_name: 'Oregon', province_latitude: 44.572021, province_longitude: -122.070938 },
  { province_code: 'PA', province_name: 'Pennsylvania', province_latitude: 40.590752, province_longitude: -77.209755 },
  { province_code: 'RI', province_name: 'Rhode Island', province_latitude: 41.680893, province_longitude: -71.511780 },
  { province_code: 'SC', province_name: 'South Carolina', province_latitude: 33.856892, province_longitude: -80.945007 },
  { province_code: 'SD', province_name: 'South Dakota', province_latitude: 44.299782, province_longitude: -99.438828 },
  { province_code: 'TN', province_name: 'Tennessee', province_latitude: 35.747845, province_longitude: -86.692345 },
  { province_code: 'TX', province_name: 'Texas', province_latitude: 31.054487, province_longitude: -97.563461 },
  { province_code: 'UT', province_name: 'Utah', province_latitude: 40.150032, province_longitude: -111.862434 },
  { province_code: 'VT', province_name: 'Vermont', province_latitude: 44.045876, province_longitude: -72.710686 },
  { province_code: 'VA', province_name: 'Virginia', province_latitude: 37.769337, province_longitude: -78.169968 },
  { province_code: 'WA', province_name: 'Washington', province_latitude: 47.400902, province_longitude: -121.490494 },
  { province_code: 'WV', province_name: 'West Virginia', province_latitude: 38.491226, province_longitude: -80.954453 },
  { province_code: 'WI', province_name: 'Wisconsin', province_latitude: 44.268543, province_longitude: -89.616508 },
  { province_code: 'WY', province_name: 'Wyoming', province_latitude: 42.755966, province_longitude: -107.302490 },
];

export function getStates() {
  return STATES;
}

// Fetch counties for a given state using Nominatim (on-demand).
export async function fetchCountiesForState(stateCode: string) {
  const state = STATES.find((s) => s.province_code === stateCode);
  if (!state) return [] as any[];
  const stateName = state.province_name;
  const url = `https://nominatim.openstreetmap.org/search?country=United+States&state=${encodeURIComponent(
    stateName,
  )}&format=json&limit=300&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'RisqMap/1.0 (you@example.com)' },
  });
  const data = (await res.json()) as any[];
  // Filter for items that include county in address, and map to county-like shape
  const counties = data
    .filter((i) => i.address && (i.address.county || i.type === 'county'))
    .map((i) => ({
      city_code: i.osm_id,
      city_name: i.address.county || i.display_name,
      city_latitude: Number(i.lat),
      city_longitude: Number(i.lon),
    }));
  // Deduplicate by name
  const unique: any[] = [];
  const seen = new Set();
  for (const c of counties) {
    if (!seen.has(c.city_name)) {
      seen.add(c.city_name);
      unique.push(c);
    }
  }
  return unique;
}

// Fetch cities/localities for a given county (countyName expected) using Nominatim
export async function fetchCitiesForCounty(countyName: string, stateCode?: string) {
  let stateName = '';
  if (stateCode) {
    const state = STATES.find((s) => s.province_code === stateCode);
    stateName = state ? state.province_name : '';
  }
  // Build query e.g. "CountyName, StateName, USA" or just county
  const q = stateName ? `${countyName}, ${stateName}, United States` : `${countyName}, United States`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=500&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'RisqMap/1.0 (you@example.com)' },
  });
  const data = (await res.json()) as any[];
  // Filter to place types that represent populated places
  const placeTypes = new Set(['city', 'town', 'village', 'hamlet', 'locality', 'borough', 'suburb']);
  const cities = data
    .filter((i) => i.address && (placeTypes.has(i.type) || i.class === 'place'))
    .map((i) => ({
      sub_district_code: i.osm_id,
      sub_district_name: i.display_name,
      sub_district_latitude: Number(i.lat),
      sub_district_longitude: Number(i.lon),
      sub_district_geometry: null,
    }));
  // Deduplicate by name
  const unique: any[] = [];
  const seen = new Set();
  for (const c of cities) {
    if (!seen.has(c.sub_district_name)) {
      seen.add(c.sub_district_name);
      unique.push(c);
    }
  }
  return unique;
}
