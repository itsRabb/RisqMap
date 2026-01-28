-- supabase/migrations/20250819120000_create_flood_reports_table.sql

-- Drop existing flood_reports table if it exists (from 001_initial_schema.sql)
DROP TABLE IF EXISTS public.flood_reports CASCADE;

-- Create enum for water levels (US standard measurements)
CREATE TYPE public.water_level_enum AS ENUM (
    'ankle_deep',
    'knee_deep',
    'thigh_deep',
    'waist_deep',
    'above_waist'
);

-- Create the flood_reports table
CREATE TABLE public.flood_reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    location_name text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    water_level public.water_level_enum NOT NULL,
    description text,
    photo_url text,
    reporter_name text,
    reporter_contact text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved')),
    severity text DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high')),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    verified_at timestamptz,
    resolved_at timestamptz
);

-- Add comments for clarity
COMMENT ON TABLE public.flood_reports IS 'Stores user-submitted flood reports from the field.';
COMMENT ON COLUMN public.flood_reports.water_level IS 'Water level category: ankle_deep, knee_deep, thigh_deep, waist_deep, above_waist.';
COMMENT ON COLUMN public.flood_reports.status IS 'Report status: pending, verified, or resolved.';

-- Create indexes for common queries
CREATE INDEX idx_flood_reports_created_at ON public.flood_reports(created_at DESC);
CREATE INDEX idx_flood_reports_status ON public.flood_reports(status);
CREATE INDEX idx_flood_reports_location ON public.flood_reports(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.flood_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all reports
CREATE POLICY "Enable read access for all users" ON public.flood_reports
    FOR SELECT
    USING (true);

-- Policy: Authenticated users can insert their own reports
CREATE POLICY "Enable insert for authenticated users" ON public.flood_reports
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own reports
CREATE POLICY "Enable update for report owners" ON public.flood_reports
    FOR UPDATE
    USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Policy: Only service role can delete reports
CREATE POLICY "Enable delete for service role" ON public.flood_reports
    FOR DELETE
    USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_flood_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_flood_reports_updated_at
    BEFORE UPDATE ON public.flood_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_flood_reports_updated_at();
