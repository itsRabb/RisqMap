-- supabase/seed.sql

-- Pastikan extension ada
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

-- Buat tipe ENUM untuk level peringatan kalau belum ada
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

-- Buat tabel historical_incidents kalau belum ada
CREATE TABLE IF NOT EXISTS public.historical_incidents (
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

-- Buat tabel alerts kalau belum ada
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


-- Hapus data lama biar tidak double
TRUNCATE TABLE public.historical_incidents, public.alerts RESTART IDENTITY CASCADE;

-- Historical incidents (US-focused examples only)
INSERT INTO public.historical_incidents (type, location, date, description, severity, impact_areas, duration_hours, reported_losses, casualties, evacuees, damage_level, response_time_minutes, status)
VALUES
('Flood','Hudson River, New York','2024-01-15T08:00:00Z','Severe flooding along the Hudson River caused by prolonged heavy rainfall and upstream runoff. Water levels reached over 2 meters in several locations.',9,ARRAY['Harlem','Upper West Side','Washington Heights'],48,5000000000,2,1250,'Severe',45,'resolved'),
('Earthquake','San Bernardino, CA','2023-11-20T14:30:00Z','Magnitude 6.5 earthquake strongly felt in San Bernardino County, causing light structural damage and localized outages.',7,ARRAY['San Bernardino','Rialto'],NULL,1000000000,0,450,'Minor',30,'resolved'),
('Landslide','Palisades, New Jersey','2024-03-01T06:00:00Z','A landslide closed a primary route after an overnight storm. No fatalities reported but traffic remains disrupted.',6,ARRAY['Palisades Park','Edgewater'],72,500000000,0,120,'Moderate',60,'resolved'),
('Flood','Mississippi River, New Orleans, LA','2024-01-15T08:00:00Z','Severe flooding along the Mississippi River due to heavy upstream rainfall and reservoir releases. Water levels reached 2 meters at several monitoring points.',9,ARRAY['French Quarter','Bywater','Lower Ninth Ward'],48,5000000000,2,1250,'Severe',45,'resolved'),
('Landslide','Santa Cruz Mountains, CA','2024-03-01T06:00:00Z','A landslide closed a mountain roadway after an overnight storm. No fatalities reported, but traffic was heavily disrupted.',6,ARRAY['Felton','Scotts Valley'],72,500000000,0,120,'Moderate',60,'resolved');

-- Alerts (US-focused examples only)
INSERT INTO public.alerts (level, location, reason, severity, affected_areas, estimated_population)
VALUES
('High', 'Hudson Weir', 'Water Surface Level observed at 210 cm (Alert Level 1), trend rising.', 9, ARRAY['Harlem', 'Washington Heights', 'Upper Manhattan'], 14850),
('Moderate', 'Manhattan Water Gate', 'Water height observed at 850 cm (Alert Level 3), discharge rising from upstream.', 7, ARRAY['Lower Manhattan', 'Tribeca', 'SoHo'], 8230),
('Low', 'Upstream Monitoring Post', 'Water Surface Level 150 cm (Alert Level 4), currently stable.', 4, ARRAY['Queens', 'Brooklyn'], 2477),
('Moderate', 'Bronx Tributary', 'Significant increase in water discharge following local upstream rain.', 6, ARRAY['Fordham', 'Belmont'], 6150),
('High', 'Placer Reservoir', 'Pumps activated to manage inflow from upstream reservoirs.', 8, ARRAY['North Auburn', 'Loomis', 'Lincoln'], 11780),
('Low', 'Cedar Creek', 'Strong flow but within safe limits; monitoring continues.', 3, ARRAY['Cedar Creek', 'Maple Ridge'], 1520),
('High', 'Gowanus Canal', 'Localized overflow starting to inundate adjacent streets, traffic disrupted.', 9, ARRAY['Gowanus', 'Carroll Gardens', 'Red Hook'], 11240),
('Moderate', 'Jamaica Bay Lowlands', 'Water height increased 50cm in the last hour; residents advised to be cautious.', 7, ARRAY['Far Rockaway', 'Breezy Point', 'Broad Channel'], 7490),
('High', 'Hudson Bridge Upstream', 'Heavy upstream rainfall; river discharge sharply increased to Alert Level 2.', 8, ARRAY['Yonkers', 'New Rochelle', 'Mount Vernon'], 9300),
('Low', 'East River Tributary', 'Alert Level 4, water level 310 cm. Conditions currently under control.', 2, ARRAY['Long Island City', 'Astoria'], 3100),
('Moderate', 'Suwannee River Basin', 'Significant river flow increases observed after local storms in the upstream area.', 6, ARRAY['Branford', 'Fanning Springs'], 6150),
('High', 'San Lorenzo River', 'River overflow starting to inundate local roads, traffic disrupted.', 9, ARRAY['Santa Cruz', 'Soquel', 'Capitola'], 11240),
('Moderate', 'Palo Alto Hills', 'Water level rose 50 cm in the last hour; residents advised to stay alert.', 7, ARRAY['Palo Alto', 'Los Altos', 'Mountain View'], 7490),
('High', 'Golden Gate Bridge Approach', 'Heavy upstream rainfall increased discharge to alert level 2.', 8, ARRAY['Presidio', 'Marina', 'Fisherman''s Wharf'], 9300),
('Low', 'Sacramento River', 'Status nominal; monitoring continues.', 2, ARRAY['West Sacramento', 'Natomas'], 3100),
('Moderate', 'Coyote Creek, San Jose', 'Creek overflow observed at several low-lying points.', 6, ARRAY['Almaden', 'Willow Glen', 'Downtown San Jose'], 5650),
('High', 'West Flood Canal', 'Water gate opened to lower upstream discharge; monitor downstream areas.', 8, ARRAY['Western Waterfront', 'Embarcadero', 'Mission Bay'], 13200);

--
-- Optional: Import recent historical events from NRI table if present.
-- This block conditionally copies a conservative set of fields from `nri_table_censustracts` into
-- `historical_incidents`. It uses minimal mapping and sets neutral/default values for fields that
-- require manual interpretation (damage strings like '1.00K' are not parsed here).
-- Review and refine mapping before enabling for production. The table name may vary; adjust if necessary.
--
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'historical_events'
    ) THEN
        -- Conservative import mapping from uploaded `historical_events` CSV.
        -- CSV headers expected: id,EVENT_ID,EVENT_TYPE,BEGIN_DATE_TIME,STATE,CZ_NAME,BEGIN_LAT,BEGIN_LON,
        -- INJURIES_DIRECT,INJURIES_INDIRECT,DEATHS_DIRECT,DEATHS_INDIRECT,DAMAGE_PROPERTY,DAMAGE_CROPS,
        -- MAGNITUDE,MAGNITUDE_TYPE,FLOOD_CAUSE,TOR_F_SCALE,TOR_LENGTH,TOR_WIDTH,EPISODE_NARRATIVE,created_at
        -- Mapping notes:
        --  - `type` <- EVENT_TYPE
        --  - `location` <- STATE, CZ_NAME
        --  - `date` <- BEGIN_DATE_TIME
        --  - `description` <- EPISODE_NARRATIVE
        --  - `severity` derived heuristically from EVENT_TYPE (tornado/hurricane=9, earthquake/flood=8, thunderstorm/hail=6, else=5)
        --  - `reported_losses` attempts to parse DAMAGE_PROPERTY and DAMAGE_CROPS (supports 'K' and 'M' suffixes)
        --  - `casualties` <- DEATHS_DIRECT + DEATHS_INDIRECT
        --  - `impact_areas` <- array with CZ_NAME
        --  - Limits import to 10000 rows as a safety precaution; remove or adjust when validated
        INSERT INTO public.historical_incidents (type, location, date, description, severity, impact_areas, duration_hours, reported_losses, casualties, evacuees, damage_level, response_time_minutes, status)
        SELECT
            COALESCE(EVENT_TYPE, 'Other')::text AS type,
            (COALESCE(STATE,'') || CASE WHEN COALESCE(CZ_NAME,'') <> '' THEN ', ' || COALESCE(CZ_NAME,'') ELSE '' END)::text AS location,
            BEGIN_DATE_TIME::timestamptz AS date,
            COALESCE(EPISODE_NARRATIVE, '')::text AS description,
            CASE
                WHEN EVENT_TYPE ILIKE '%tornado%' OR EVENT_TYPE ILIKE '%hurricane%' THEN 9
                WHEN EVENT_TYPE ILIKE '%earthquake%' THEN 8
                WHEN EVENT_TYPE ILIKE '%flood%' THEN 8
                WHEN EVENT_TYPE ILIKE '%thunderstorm%' OR EVENT_TYPE ILIKE '%wind%' OR EVENT_TYPE ILIKE '%hail%' THEN 6
                ELSE 5
            END::smallint AS severity,
            ARRAY[COALESCE(CZ_NAME,'')]::text[] AS impact_areas,
            NULL::integer AS duration_hours,
            -- Parse DAMAGE_PROPERTY and DAMAGE_CROPS (supports K/M suffix). Sum and return NULL if both absent/zero.
            (CASE WHEN (COALESCE(
                (CASE
                    WHEN COALESCE(DAMAGE_PROPERTY,'') ~* 'k' THEN regexp_replace(COALESCE(DAMAGE_PROPERTY,'0'),'[^0-9.]','','g')::numeric * 1000
                    WHEN COALESCE(DAMAGE_PROPERTY,'') ~* 'm' THEN regexp_replace(COALESCE(DAMAGE_PROPERTY,'0'),'[^0-9.]','','g')::numeric * 1000000
                    WHEN COALESCE(DAMAGE_PROPERTY,'') ~* '[0-9]' THEN regexp_replace(COALESCE(DAMAGE_PROPERTY,'0'),'[^0-9.]','','g')::numeric
                    ELSE 0
                END),0) + COALESCE(
                (CASE
                    WHEN COALESCE(DAMAGE_CROPS,'') ~* 'k' THEN regexp_replace(COALESCE(DAMAGE_CROPS,'0'),'[^0-9.]','','g')::numeric * 1000
                    WHEN COALESCE(DAMAGE_CROPS,'') ~* 'm' THEN regexp_replace(COALESCE(DAMAGE_CROPS,'0'),'[^0-9.]','','g')::numeric * 1000000
                    WHEN COALESCE(DAMAGE_CROPS,'') ~* '[0-9]' THEN regexp_replace(COALESCE(DAMAGE_CROPS,'0'),'[^0-9.]','','g')::numeric
                    ELSE 0
                END),0)) = 0 THEN NULL ELSE (COALESCE(
                (CASE
                    WHEN COALESCE(DAMAGE_PROPERTY,'') ~* 'k' THEN regexp_replace(COALESCE(DAMAGE_PROPERTY,'0'),'[^0-9.]','','g')::numeric * 1000
                    WHEN COALESCE(DAMAGE_PROPERTY,'') ~* 'm' THEN regexp_replace(COALESCE(DAMAGE_PROPERTY,'0'),'[^0-9.]','','g')::numeric * 1000000
                    WHEN COALESCE(DAMAGE_PROPERTY,'') ~* '[0-9]' THEN regexp_replace(COALESCE(DAMAGE_PROPERTY,'0'),'[^0-9.]','','g')::numeric
                    ELSE 0
                END),0) + COALESCE(
                (CASE
                    WHEN COALESCE(DAMAGE_CROPS,'') ~* 'k' THEN regexp_replace(COALESCE(DAMAGE_CROPS,'0'),'[^0-9.]','','g')::numeric * 1000
                    WHEN COALESCE(DAMAGE_CROPS,'') ~* 'm' THEN regexp_replace(COALESCE(DAMAGE_CROPS,'0'),'[^0-9.]','','g')::numeric * 1000000
                    WHEN COALESCE(DAMAGE_CROPS,'') ~* '[0-9]' THEN regexp_replace(COALESCE(DAMAGE_CROPS,'0'),'[^0-9.]','','g')::numeric
                    ELSE 0
                END),0))::bigint END AS reported_losses,
            COALESCE(COALESCE(DEATHS_DIRECT,0) + COALESCE(DEATHS_INDIRECT,0), 0)::integer AS casualties,
            0::integer AS evacuees,
            (CASE WHEN COALESCE(DAMAGE_PROPERTY,'') <> '' OR COALESCE(DAMAGE_CROPS,'') <> '' THEN (COALESCE(DAMAGE_PROPERTY,'') || CASE WHEN COALESCE(DAMAGE_CROPS,'') <> '' THEN ' | ' || COALESCE(DAMAGE_CROPS,'') ELSE '' END) ELSE NULL END)::text AS damage_level,
            0::integer AS response_time_minutes,
            'monitoring'::public.incident_status AS status
        FROM public.historical_events
        WHERE BEGIN_DATE_TIME IS NOT NULL
        LIMIT 10000; -- safety limit, adjust after review
    END IF;
END$$;
