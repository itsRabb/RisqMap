-- supabase/seed.sql

-- Make sure the extension is there
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buat tipe ENUM untuk status insiden kalau belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
        CREATE TYPE public.incident_status AS ENUM (
            'resolved',
            'ongoing',
            'monitoring'
        );
    END IF;
END$$;

-- Create ENUM type for alert levels if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_level') THEN
        CREATE TYPE public.alert_level AS ENUM (
            'Low',
            'Moderate',
            'High'
        );
    END IF;
END$$;

-- Create table historical_events if not exists
CREATE TABLE IF NOT EXISTS public.historical_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type text NOT NULL,
    location text NOT NULL,
    date timestamptz NOT NULL,
    description text,
    severity smallint NOT NULL CHECK (severity >= 1 AND severity <= 10),
    impact_areas text[],
    duration_hours integer,
    reported_losses bigint,
    casualties integer,
    evacuees integer,
    damage_level text,
    response_time_minutes integer,
    status public.incident_status NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create table alerts if not exists
CREATE TABLE IF NOT EXISTS public.alerts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    level public.alert_level NOT NULL,
    location text NOT NULL,
    reason text NOT NULL,
    details text,
    affected_areas text[],
    estimated_population integer,
    severity smallint CHECK (severity >= 1 AND severity <= 10),
    created_at timestamptz DEFAULT now() NOT NULL
);

-- NOTE: Tables are kept empty - no fake seed data
-- Real data sources:
--   - historical_events: Already populated with 1.4M NOAA Storm Events records
--   - alerts: Populated at runtime from NOAA weather alerts API
--   - flood_reports: Created by users through /flood-report page
