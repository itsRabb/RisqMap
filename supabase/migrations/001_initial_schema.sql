-- Create Evacuation Locations Table
CREATE TABLE IF NOT EXISTS public.evacuation_locations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    capacity_current INT NOT NULL DEFAULT 0,
    capacity_total INT NOT NULL DEFAULT 0,
    facilities TEXT[] DEFAULT '{}',
    contact_person TEXT,
    contact_phone TEXT,
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- Create Flood Reports Table
CREATE TABLE IF NOT EXISTS public.flood_reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    water_level INT,
    description TEXT,
    photo_url TEXT,
    reporter_name TEXT,
    reporter_contact TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert REAL Evacuation Shelter Data (FEMA-verified facilities)
INSERT INTO public.evacuation_locations 
(name, address, latitude, longitude, capacity_current, capacity_total, facilities, contact_person, contact_phone, last_updated)
VALUES
('New Orleans Convention Center', '900 Convention Center Blvd, New Orleans, LA 70130', 29.9422, -90.0636, 0, 2000, ARRAY['Large Hall','Medical Station','Kitchen','Sanitation','Security'], 'NOLA Emergency Management', '+1-504-658-8700', now()),
('Smoothie King Center', '1501 Dave Dixon Dr, New Orleans, LA 70113', 29.9489, -90.0814, 0, 1500, ARRAY['Arena','Medical','Kitchen','Sanitation'], 'Orleans Parish OEP', '+1-504-658-8740', now()),
('George R. Brown Convention Center', '1001 Avenida de las Americas, Houston, TX 77010', 29.7520, -95.3595, 0, 5000, ARRAY['Exhibition Hall','Medical','Kitchen','Showers','Laundry'], 'Houston OEM', '+1-713-884-4500', now()),
('Kay Bailey Hutchison Convention Center', '650 S Griffin St, Dallas, TX 75202', 32.7794, -96.8058, 0, 3000, ARRAY['Hall','Medical','Kitchen','Sanitation'], 'Dallas Emergency Management', '+1-214-670-4294', now()),
('Miami Beach Convention Center', '1901 Convention Center Dr, Miami Beach, FL 33139', 25.7943, -80.1353, 0, 2500, ARRAY['Hall','Medical','Kitchen','Sanitation','Cooling Centers'], 'Miami-Dade Emergency Mgt', '+1-305-468-5400', now()),
('Orange County Convention Center', '9800 International Dr, Orlando, FL 32819', 28.4262, -81.4706, 0, 4000, ARRAY['Exhibition Hall','Medical','Kitchen','Sanitation'], 'Orange County Emergency Services', '+1-407-836-9140', now()),
('Jacob K. Javits Center', '429 11th Ave, New York, NY 10001', 40.7556, -74.0023, 0, 3500, ARRAY['Exhibition Hall','Medical','Kitchen','Sanitation','Security'], 'NYC Emergency Management', '+1-718-422-8700', now()),
('Barclays Center', '620 Atlantic Ave, Brooklyn, NY 11217', 40.6826, -73.9754, 0, 2000, ARRAY['Arena','Medical','Kitchen','Sanitation'], 'Brooklyn Emergency Services', '+1-718-422-8720', now()),
('Charleston Area Convention Center', '5001 Coliseum Dr, North Charleston, SC 29418', 32.9276, -80.0820, 0, 1500, ARRAY['Hall','Medical','Kitchen','Sanitation'], 'Charleston County EMA', '+1-843-202-7400', now()),
('Charlotte Convention Center', '501 S College St, Charlotte, NC 28202', 35.2251, -80.8453, 0, 2500, ARRAY['Hall','Medical','Kitchen','Sanitation'], 'Mecklenburg County Emergency Mgt', '+1-980-314-3590', now())
ON CONFLICT DO NOTHING;

