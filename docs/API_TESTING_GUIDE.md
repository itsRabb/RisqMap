# 🧪 API INTEGRATION TESTING GUIDE

## Quick Verification Checklist

### ✅ Pre-Test Setup
```bash
# 1. Install dependencies (if needed)
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to: http://localhost:3000
```

---

## 🔍 Test 1: USGS Water Levels (Dashboard)

### What to Check
1. **Navigate to Dashboard** (`http://localhost:3000`)
2. **Open Browser Console** (F12 → Console tab)
3. **Look for Log Message**:
   ```
   ✅ Loaded XX real water level stations from USGS
   ```
   - If you see this: **SUCCESS!** USGS API is working
   - If you see warning: API may be down, check Network tab

### Expected Results
- **Total Regions**: Should be ~15-20 (based on major USGS sites)
- **Active Alerts**: Will vary based on real flood conditions
- **Metrics update**: Refresh page, numbers may change (real data!)

### Network Tab Verification
1. Open **Network tab** in DevTools
2. Filter by: `waterservices.usgs.gov`
3. Should see request to:
   ```
   https://waterservices.usgs.gov/nwis/iv/?format=json&sites=...
   ```
4. **Status: 200 OK**
5. **Response**: JSON with `value.timeSeries` array

### Troubleshooting
- ❌ **No console log?** Check `app/dashboard/page.tsx` line 25-30
- ❌ **Empty array?** USGS API may be down, check https://waterservices.usgs.gov/rest/
- ❌ **Build error?** Run `npm run build` to see TypeScript errors

---

## 🔍 Test 2: NOAA Weather API

### What to Check
1. **Navigate to Weather page** (`/weather-forecast`)
2. **Enter location** or use geolocation
3. **Check Network tab**:
   - Request to `/api/weather?lat=...&lon=...`
   - Should call `api.weather.gov`

### Expected Results
- **Provider**: Should show "NOAA/NWS" (check console or response)
- **Forecast**: 7-day weather forecast displayed
- **Alerts**: If any severe weather, should show alert cards

### Network Tab Verification
1. Filter by: `weather.gov`
2. Should see requests to:
   ```
   https://api.weather.gov/points/{lat},{lon}
   https://api.weather.gov/gridpoints/{office}/{grid}/forecast
   https://api.weather.gov/alerts/active?point={lat},{lon}
   ```
3. **Status: 200 OK** for all
4. **User-Agent header**: Check request headers include `RisqMap/1.0`

### Fallback Test
1. **Test non-US location**: Try coordinates outside US (e.g., Tokyo: 35.6762, 139.6503)
2. **Expected**: Should fallback to Open-Meteo
3. **Check response**: `provider: "open-meteo (fallback)"`

### Troubleshooting
- ❌ **403 Forbidden?** Missing User-Agent header
- ❌ **Outside US?** NOAA only covers USA, fallback should work
- ❌ **No alerts?** That's fine! Means no severe weather (good thing!)

---

## 🔍 Test 3: NOAA Flood Forecast (Dashboard)

### What to Check
1. **Navigate to Dashboard** (`http://localhost:3000`)
2. **Scroll down** past main metrics
3. **Look for section**: "7-Day Flood Forecast"
4. **Should see**:
   - 4 summary cards (Total Gages, In Flood, Forecast 24h, Forecast 7d)
   - Detailed forecast cards (if any active)

### Expected Results
- **Total Gages**: ~10-13 (major river monitoring stations)
- **In Flood**: Will vary based on real conditions (could be 0!)
- **Forecast cards**: Only show if floods predicted/active

### Network Tab Verification
1. Filter by: `flood-forecast`
2. Should see request to:
   ```
   /api/flood-forecast
   ```
3. **Status: 200 OK**
4. **Response**: JSON with `forecasts` array and `summary` object

### Understanding Results
- **No forecasts?** Great news! No major floods predicted
- **Empty summary?** Check if AHPS endpoints are accessible
- **Loading spinner forever?** API may be timing out, check console errors

### Troubleshooting
- ❌ **Component not showing?** Check `components/layout/DashboardClientPage.tsx` imports
- ❌ **API 500 error?** NOAA AHPS endpoint may be down (unofficial endpoint)
- ❌ **No data in response?** Normal if no active flood conditions

---

## 🔍 Test 4: Full Integration Test

### Scenario: Monitor Major Flood Event
1. **Pick known flood-prone area**: 
   - New Orleans, LA (30.0, -90.0)
   - Houston, TX (29.76, -95.37)
   - Fargo, ND (46.88, -96.79)

2. **Check all data sources**:
   - Dashboard metrics update?
   - Flood forecast shows predictions?
   - Weather alerts active?
   - Water levels above normal?

3. **Cross-reference**:
   - Visit USGS website: https://waterwatch.usgs.gov/
   - Compare values with your dashboard
   - Should match within ~1 foot (different update times)

---

## 📊 API Response Samples

### USGS Water (Good Response)
```json
{
  "value": {
    "timeSeries": [
      {
        "sourceInfo": {
          "siteName": "Mississippi River at Vicksburg, MS",
          "siteCode": [{"value": "07289000"}],
          "geoLocation": {
            "geogLocation": {"latitude": 32.3, "longitude": -90.9}
          }
        },
        "values": [{
          "value": [{"value": "32.5", "dateTime": "2026-01-26T10:15:00"}]
        }]
      }
    ]
  }
}
```

### NOAA Weather (Good Response)
```json
{
  "properties": {
    "periods": [
      {
        "number": 1,
        "name": "Today",
        "temperature": 65,
        "temperatureUnit": "F",
        "windSpeed": "5 to 10 mph",
        "shortForecast": "Partly Cloudy"
      }
    ]
  }
}
```

### Flood Forecast (Good Response)
```json
{
  "forecasts": [
    {
      "gageId": "VCKM6",
      "name": "Vicksburg, MS",
      "currentStage": 32.5,
      "floodStage": 43.0,
      "forecast": [
        {"timestamp": "2026-01-27", "stage": 33.2, "floodCategory": "none"}
      ]
    }
  ],
  "summary": {
    "totalGages": 10,
    "inFlood": 2,
    "predicted24h": 1,
    "predicted7d": 3
  }
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Build Fails
```bash
Error: Cannot find module '@/lib/usgs-water'
```
**Solution**: 
- Make sure all new files are created in `lib/` folder
- Check file names match imports exactly
- Run `npm run build` to see full error

### Issue 2: CORS Errors
```
Access to fetch at 'https://waterservices.usgs.gov/...' blocked by CORS
```
**Solution**: 
- APIs should be called server-side (API routes, not client)
- Check you're using `/api/...` endpoints, not direct API calls
- USGS/NOAA should have CORS enabled (public APIs)

### Issue 3: No Data Returned
```
✅ Loaded 0 real water level stations from USGS
```
**Solution**: 
- Check USGS API status: https://waterservices.usgs.gov/rest/
- Verify site codes are valid in `lib/usgs-water.ts`
- Try single site: `fetchUSGSWaterLevels(['07289000'])`

### Issue 4: Flood Forecast Empty
```json
{"forecasts": [], "summary": null}
```
**Solution**: 
- Normal if no active floods! Try during flood season (spring)
- NOAA AHPS endpoint may be down (unofficial)
- Check individual gage: https://water.weather.gov/ahps2/hydrograph.php?gage=vckm6

### Issue 5: Weather Fallback Always Triggers
```
provider: "open-meteo (fallback)"
```
**Solution**: 
- Check User-Agent header in `app/api/weather/route.ts`
- Should be: `RisqMap/1.0 (contact@risqmap.com)`
- Try US coordinates first (NOAA is US-only)

---

## 🎯 Success Criteria

### Must Have
- ✅ Dashboard loads without errors
- ✅ Console shows USGS data loaded (even if 0)
- ✅ Weather page shows forecasts
- ✅ No TypeScript build errors
- ✅ Network requests return 200 OK

### Nice to Have
- ✅ Real flood data displays (depends on current conditions)
- ✅ Weather alerts show (depends on active weather)
- ✅ Flood forecast has active predictions (depends on season)
- ✅ Metrics change between page refreshes (real-time data)

---

## 🔧 Manual API Testing (Outside App)

### Test USGS Water API Directly
```bash
# PowerShell
$response = Invoke-WebRequest "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=07289000&parameterCd=00065&siteStatus=active"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### Test NOAA Weather API Directly
```bash
# PowerShell (New Orleans)
$response = Invoke-WebRequest -Uri "https://api.weather.gov/points/30,-90" -Headers @{"User-Agent"="RisqMap/1.0"}
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Test NOAA AHPS Directly
```bash
# Browser or curl
https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=vckm6&output=json
```

---

## 📈 Performance Testing

### Load Times (Expected)
- **Dashboard initial load**: 2-5 seconds (server-side fetch)
- **Dashboard cached load**: < 1 second (ISR revalidate 300s)
- **Weather page**: 1-3 seconds (API roundtrip)
- **Flood forecast**: 3-8 seconds (multiple AHPS calls)

### Optimization Tips
- ISR caching already enabled (300s on dashboard)
- Flood forecast cached 30 min (1800s)
- Consider implementing Redis cache for production
- USGS API has no rate limit, but be nice (don't hammer)

---

## 🎓 Understanding the Data

### Water Level Status Classification
- **Normal**: < 1.0m (3.3 ft) or below action stage
- **Alert 1**: 1.0-1.5m (3.3-4.9 ft)
- **Alert 3**: 1.5-2.0m (4.9-6.6 ft)
- **Alert 2**: 2.0-2.5m (6.6-8.2 ft)
- **Danger**: > 2.5m (8.2 ft) or above flood stage

### Flood Stage Definitions (NOAA)
- **Action Stage**: Prepare for possible flood
- **Flood Stage**: Minor flooding begins
- **Moderate Flood**: Significant property damage
- **Major Flood**: Extensive damage, evacuations

### USGS Site Codes
- Format: 8-digit number
- Example: `07289000` = Mississippi River @ Vicksburg
- Find more: https://waterdata.usgs.gov/nwis/rt

---

## 📝 Testing Checklist

```
[ ] npm run dev starts without errors
[ ] Dashboard loads and shows metrics
[ ] Console log confirms USGS data loaded
[ ] Network tab shows waterservices.usgs.gov calls
[ ] Weather page loads forecasts
[ ] Network tab shows api.weather.gov calls
[ ] Flood forecast section appears on dashboard
[ ] No React errors in console
[ ] No TypeScript errors in build
[ ] Metrics change on page refresh (real-time)
[ ] Mobile view works (responsive)
[ ] Dark mode works (if enabled)
```

---

## 🚀 Ready to Deploy?

### Pre-Deployment Checks
1. **Build succeeds**: `npm run build` completes without errors
2. **Environment variables**: None needed (all public APIs)
3. **API keys**: None required (all free government APIs)
4. **Rate limits**: None (but be respectful)
5. **CORS**: All APIs allow public access
6. **User-Agent**: Set for NOAA API (already done)

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

### Environment Variables (Optional)
```env
# None required for these APIs!
# All are public and free
```

---

## 🎉 You're Done!

If all tests pass, you have successfully integrated:
- ✅ USGS Water Services (10,000+ stations)
- ✅ NOAA Weather API (official US forecasts)
- ✅ NOAA AHPS Flood Forecasts (7-day predictions)

**Time spent**: < 30 minutes  
**Cost**: $0.00  
**Data sources**: 3 government APIs  
**Lines of code**: ~880  
**Mock data**: ELIMINATED 🎯  

Now go show it off! 🚀
