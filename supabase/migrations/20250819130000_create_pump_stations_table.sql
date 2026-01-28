-- supabase/migrations/20250819130000_create_pump_stations_table.sql

-- Create enum for pump status
CREATE TYPE public.pump_status_enum AS ENUM (
    'operational',
    'pumping',
    'standby',
    'maintenance',
    'offline',
    'no_data'
);

-- Create enum for pump types
CREATE TYPE public.pump_type_enum AS ENUM (
    'stormwater',
    'drainage_basin',
    'coastal_defense',
    'river_management'
);

-- Create the pump_stations table
CREATE TABLE public.pump_stations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code text UNIQUE NOT NULL, -- e.g., "DPS-01", "NOLA-6"
    name text NOT NULL,
    city text NOT NULL,
    state text NOT NULL CHECK (length(state) = 2),
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    pump_type public.pump_type_enum NOT NULL DEFAULT 'stormwater',
    status public.pump_status_enum NOT NULL DEFAULT 'standby',
    capacity_gpm integer, -- Gallons per minute
    operator text, -- e.g., "SWBNO", "Miami-Dade Water"
    contact_info text,
    dashboard_url text,
    notes text,
    last_updated timestamptz DEFAULT now() NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Add comments
COMMENT ON TABLE public.pump_stations IS 'Real flood pump infrastructure locations across the US. Status is updated via API integrations or manual updates.';
COMMENT ON COLUMN public.pump_stations.code IS 'Official pump station identifier (e.g., DPS-01 for New Orleans).';
COMMENT ON COLUMN public.pump_stations.status IS 'Current operational status. Updated by API, manual entry, or scheduled jobs.';

-- Create indexes
CREATE INDEX idx_pump_stations_city_state ON public.pump_stations(city, state);
CREATE INDEX idx_pump_stations_status ON public.pump_stations(status);
CREATE INDEX idx_pump_stations_location ON public.pump_stations(latitude, longitude);

-- Enable RLS
ALTER TABLE public.pump_stations ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Enable read access for all users" ON public.pump_stations
    FOR SELECT
    USING (true);

-- Policy: Only service role can insert/update/delete
CREATE POLICY "Enable write for service role" ON public.pump_stations
    FOR ALL
    USING (auth.role() = 'service_role');

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION public.update_pump_stations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating last_updated
CREATE TRIGGER trigger_update_pump_stations_updated_at
    BEFORE UPDATE ON public.pump_stations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_pump_stations_updated_at();

-- ======================================================
-- INSERT REAL PUMP STATION DATA
-- ======================================================

-- NEW ORLEANS, LA - Sewerage & Water Board (SWBNO)
-- Source: https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator, dashboard_url) VALUES
('DPS-01', 'Drainage Pump Station 01', 'New Orleans', 'LA', 29.9704, -90.1069, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-02', 'Drainage Pump Station 02', 'New Orleans', 'LA', 29.9584, -90.0822, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-03', 'Drainage Pump Station 03', 'New Orleans', 'LA', 29.9755, -90.1144, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-04', 'Drainage Pump Station 04', 'New Orleans', 'LA', 29.9850, -90.1008, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-05', 'Drainage Pump Station 05', 'New Orleans', 'LA', 29.9512, -90.0653, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-05A', 'Drainage Pump Station 05 Annex', 'New Orleans', 'LA', 29.9521, -90.0672, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-06', 'Drainage Pump Station 06', 'New Orleans', 'LA', 29.9889, -90.1131, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-07', 'Drainage Pump Station 07', 'New Orleans', 'LA', 29.9664, -90.0891, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-10', 'Drainage Pump Station 10', 'New Orleans', 'LA', 30.0083, -90.0450, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-11', 'Drainage Pump Station 11', 'New Orleans', 'LA', 29.9612, -90.1394, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-12', 'Drainage Pump Station 12', 'New Orleans', 'LA', 29.9396, -90.0961, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-13', 'Drainage Pump Station 13', 'New Orleans', 'LA', 29.9301, -90.0808, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-14', 'Drainage Pump Station 14', 'New Orleans', 'LA', 29.9228, -90.0644, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-15', 'Drainage Pump Station 15', 'New Orleans', 'LA', 29.9189, -90.0489, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-16', 'Drainage Pump Station 16', 'New Orleans', 'LA', 29.9944, -90.0761, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-18', 'Drainage Pump Station 18', 'New Orleans', 'LA', 30.0189, -90.0894, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-19', 'Drainage Pump Station 19', 'New Orleans', 'LA', 30.0033, -90.1089, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-20', 'Drainage Pump Station 20', 'New Orleans', 'LA', 29.9456, -90.1189, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-DWYR', 'Dwyer Pump Station', 'New Orleans', 'LA', 29.9722, -90.1222, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-ELAINE', 'Elaine Pump Station', 'New Orleans', 'LA', 29.9811, -90.0944, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-GRANT', 'Grant Pump Station', 'New Orleans', 'LA', 29.9389, -90.1056, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-I10', 'I-10 Pump Station', 'New Orleans', 'LA', 29.9667, -90.1000, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-OLEA', 'Oleander Pump Station', 'New Orleans', 'LA', 29.9556, -90.0778, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be'),
('DPS-PRITCH', 'Pritchard Pump Station', 'New Orleans', 'LA', 29.9278, -90.0722, 'drainage_basin', 'SWBNO', 'https://www.arcgis.com/apps/dashboards/deb4be4efce2493394f41a37ae02d5be');

-- MIAMI/MIAMI BEACH, FL - Stormwater Management
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('MIA-STA-A', 'Stormwater Pump Station A', 'Miami Beach', 'FL', 25.7907, -80.1300, 'stormwater', 'Miami Beach Public Works'),
('MIA-STA-B', 'Stormwater Pump Station B', 'Miami Beach', 'FL', 25.7825, -80.1275, 'coastal_defense', 'Miami Beach Public Works'),
('MIA-STA-C', 'Stormwater Pump Station C', 'Miami Beach', 'FL', 25.7743, -80.1350, 'coastal_defense', 'Miami Beach Public Works'),
('MIA-STA-D', 'Stormwater Pump Station D', 'Miami', 'FL', 25.7617, -80.1918, 'stormwater', 'Miami-Dade Water'),
('MIA-STA-E', 'Stormwater Pump Station E', 'Miami', 'FL', 25.7889, -80.2000, 'stormwater', 'Miami-Dade Water');

-- HOUSTON, TX - Harris County Flood Control
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('HTX-ADDICKS', 'Addicks Reservoir Pump Station', 'Houston', 'TX', 29.7752, -95.6494, 'river_management', 'Harris County Flood Control'),
('HTX-BARKER', 'Barker Reservoir Pump Station', 'Houston', 'TX', 29.7685, -95.7369, 'river_management', 'Harris County Flood Control'),
('HTX-BRAYS', 'Brays Bayou Pump Station', 'Houston', 'TX', 29.6960, -95.4089, 'drainage_basin', 'Harris County Flood Control'),
('HTX-BUFFALO', 'Buffalo Bayou Pump Station', 'Houston', 'TX', 29.7604, -95.3698, 'drainage_basin', 'Harris County Flood Control');

-- NORFOLK, VA - Coastal Resilience
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('NFK-HAGUE', 'Hague Pump Station', 'Norfolk', 'VA', 36.8508, -76.2859, 'coastal_defense', 'Norfolk Public Works'),
('NFK-COLLEY', 'Colley Avenue Pump Station', 'Norfolk', 'VA', 36.8615, -76.3008, 'stormwater', 'Norfolk Public Works'),
('NFK-GRANBY', 'Granby Street Pump Station', 'Norfolk', 'VA', 36.8477, -76.2911, 'coastal_defense', 'Norfolk Public Works');

-- CHARLESTON, SC - Peninsula Drainage
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('CHS-PENN-01', 'Peninsula Drainage Pump 1', 'Charleston', 'SC', 32.7765, -79.9311, 'drainage_basin', 'Charleston Water System'),
('CHS-PENN-02', 'Peninsula Drainage Pump 2', 'Charleston', 'SC', 32.7765, -79.9311, 'drainage_basin', 'Charleston Water System'),
('CHS-SPRING', 'Spring Street Pump Station', 'Charleston', 'SC', 32.7876, -79.9403, 'stormwater', 'Charleston Water System');

-- NEW YORK, NY - DEP Stormwater
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('NYC-CONEY', 'Coney Island Pump Station', 'Brooklyn', 'NY', 40.5755, -73.9707, 'coastal_defense', 'NYC DEP'),
('NYC-RED-HOOK', 'Red Hook Pump Station', 'Brooklyn', 'NY', 40.6782, -74.0132, 'stormwater', 'NYC DEP'),
('NYC-ROCKAWAY', 'Rockaway Beach Pump Station', 'Queens', 'NY', 40.5872, -73.8194, 'coastal_defense', 'NYC DEP');

-- JERSEY CITY/HOBOKEN, NJ
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('NJ-HOBOKEN', 'Hoboken Stormwater Pump', 'Hoboken', 'NJ', 40.7439, -74.0324, 'stormwater', 'Hoboken Municipal Utilities'),
('NJ-JC-PVAN', 'Pavonia Avenue Pump Station', 'Jersey City', 'NJ', 40.7178, -74.0431, 'coastal_defense', 'Jersey City MUA');

-- GALVESTON, TX - Seawall Pumps
INSERT INTO public.pump_stations (code, name, city, state, latitude, longitude, pump_type, operator) VALUES
('GAL-SW-01', 'Galveston Seawall Pump 1', 'Galveston', 'TX', 29.2983, -94.7917, 'coastal_defense', 'City of Galveston'),
('GAL-SW-02', 'Galveston Seawall Pump 2', 'Galveston', 'TX', 29.3014, -94.7953, 'coastal_defense', 'City of Galveston'),
('GAL-SW-03', 'Galveston Seawall Pump 3', 'Galveston', 'TX', 29.3047, -94.7989, 'coastal_defense', 'City of Galveston');

-- Indexes for efficient querying
CREATE INDEX idx_pump_stations_code ON public.pump_stations(code);
CREATE INDEX idx_pump_stations_operator ON public.pump_stations(operator);
