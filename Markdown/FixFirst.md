# FixFirst.md: Mock/Fake Data to Address in V1

This file lists all mock or fake data in the RisqMap V1 project. For each, I suggest easy changes using free resources (e.g., public APIs, local data, or simple logic). Focus on quick wins to improve realism without complexity.

## 1. Mock Weather Data (e.g., in `lib/mock-data.ts` or components)
**Current Issue**: Static/fake weather forecasts, temperatures, and alerts.
**Easy Fix**: Use Open-Meteo API (free, no key needed).
- **How**: Replace mock data with API calls: `fetch('https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&hourly=temperature_2m')`.
- **Implementation**: Add a utility function in `lib/fetch-utils.ts` to fetch real data. Update components to use it instead of mocks.
- **Benefit**: Real-time, accurate weather without cost.

## 2. Fake Flood Reports (e.g., in `components/data-sensor/FloodReportList.tsx`)
**Current Issue**: Hardcoded sample reports.
**Easy Fix**: Already using Supabase flood_reports table - ensure real submissions are verified.
- **How**: Reports are stored in Supabase (table: flood_reports with fields like id, user_id, location_name, etc.). No change needed.
- **Implementation**: Verify that the form submits to Supabase and data is fetched from there.
- **Benefit**: Real user reports are already supported.

## 3. Placeholder Map Data (e.g., in `components/map/`)
**Current Issue**: Fake markers or static overlays.
**Easy Fix**: Integrate free map tiles and real geolocation.
- **How**: Use Leaflet's free tile providers (e.g., OpenStreetMap). Add real geolocation via `navigator.geolocation`.
- **Implementation**: Update map configs to use real tiles. Add a button to center on user's location.
- **Benefit**: Interactive, real-world maps.

## 4. Mock AI Responses (e.g., in chatbot or analysis components)
**Current Issue**: Fake AI-generated tips or predictions.
**Easy Fix**: Use simple logic or public datasets for basic responses.
- **How**: Create a lookup table of pre-written responses based on inputs (e.g., if flood risk >5, show "Consider elevating your home").
- **Implementation**: Replace API calls with a local function that returns canned responses. Later, integrate a free AI API if needed.
- **Benefit**: Consistent, helpful responses without external deps.

## 5. Fake User Profiles/Stats (e.g., in dashboard)
**Current Issue**: Static user data or placeholders.
**Easy Fix**: Use Supabase for real user data (already set up).
- **How**: Fetch from Supabase tables instead of mocks.
- **Implementation**: Update queries to use real DB data. Ensure auth is working.
- **Benefit**: Personalized experience.

## 6. Placeholder API Responses (e.g., in `lib/api.ts`)
**Current Issue**: Fake JSON responses for testing.
**Easy Fix**: Implement real API calls with fallbacks.
- **How**: Use try/catch to fetch real data; on error, show cached/mock data.
- **Implementation**: Wrap API functions with error handling. Add a "Offline Mode" toggle.
- **Benefit**: Graceful degradation.

## General Tips
- **Test Locally**: After changes, run `npm run dev` and check console for errors.
- **Version Control**: Commit changes incrementally.
- **Prioritize**: Start with weather/maps for immediate impact.
- **No Cost**: All suggestions use free tools/APIs or existing code.