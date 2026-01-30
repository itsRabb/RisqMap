# Deploying FEMA Shelters Supabase Edge Function

This guide explains how to deploy the FEMA shelter proxy as a Supabase Edge Function to bypass CORS restrictions.

## Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Supabase account and project created
3. NEXT_PUBLIC_SUPABASE_URL environment variable set

## Deployment Steps

### 1. Link your Supabase project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Deploy the FEMA shelters function

```bash
supabase functions deploy fema-shelters
```

### 3. Verify deployment

The function will be available at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/fema-shelters
```

### 4. Test the function

```bash
curl "https://YOUR_PROJECT_REF.supabase.co/functions/v1/fema-shelters?status=OPEN"
```

## Configuration

The Edge Function is already configured in `lib/shelters.ts` to use your Supabase URL:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const baseUrl = supabaseUrl 
  ? `${supabaseUrl}/functions/v1/fema-shelters`
  : '/api/fema-shelters'; // Fallback to Next.js API route
```

## Fallback Behavior

If the Supabase Edge Function is not available, the app automatically falls back to the Next.js API route at `/api/fema-shelters`, which provides the same functionality.

## Query Parameters

Both the Edge Function and API route support these parameters:

- `status`: 'OPEN', 'CLOSED', or 'ALL' (default: 'ALL')
- `state`: Two-letter state code (e.g., 'TX', 'FL')
- `geometry`: JSON string for spatial filtering
- `geometryType`: 'esriGeometryEnvelope' for bounding box
- `spatialRel`: 'esriSpatialRelIntersects' for spatial relationship

## Example Usage

### Get all open shelters:
```
GET /functions/v1/fema-shelters?status=OPEN
```

### Get shelters in Texas:
```
GET /functions/v1/fema-shelters?status=OPEN&state=TX
```

### Get shelters in a bounding box:
```
GET /functions/v1/fema-shelters?status=OPEN&geometry={"xmin":-95,"ymin":29,"xmax":-94,"ymax":30,"spatialReference":{"wkid":4326}}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects
```

## Monitoring

Check function logs in Supabase Dashboard:
1. Go to Edge Functions
2. Select `fema-shelters`
3. View logs tab

## Troubleshooting

### CORS errors persist
- Ensure NEXT_PUBLIC_SUPABASE_URL is set correctly
- Verify Edge Function is deployed: `supabase functions list`
- Check function logs for errors

### Function not found
- Redeploy: `supabase functions deploy fema-shelters`
- Verify project link: `supabase projects list`

### Fallback is being used
- The app automatically uses `/api/fema-shelters` if Edge Function unavailable
- This is normal and provides seamless functionality
