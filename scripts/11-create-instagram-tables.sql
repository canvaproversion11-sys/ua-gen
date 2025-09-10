-- Create Instagram Device Models table
CREATE TABLE IF NOT EXISTS instagram_device_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    resolutions VARCHAR(20) NOT NULL,
    chipset VARCHAR(100) NOT NULL,
    android_version INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Instagram Versions table
CREATE TABLE IF NOT EXISTS instagram_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    unique_id VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Chrome Versions table
CREATE TABLE IF NOT EXISTS chrome_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Resolution DPIs table
CREATE TABLE IF NOT EXISTS resolution_dpis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resolution VARCHAR(20) NOT NULL,
    dpis INTEGER[] NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instagram_device_models_active ON instagram_device_models(is_active);
CREATE INDEX IF NOT EXISTS idx_instagram_device_models_manufacturer ON instagram_device_models(manufacturer);
CREATE INDEX IF NOT EXISTS idx_instagram_versions_active ON instagram_versions(is_active);
CREATE INDEX IF NOT EXISTS idx_chrome_versions_active ON chrome_versions(is_active);
CREATE INDEX IF NOT EXISTS idx_resolution_dpis_active ON resolution_dpis(is_active);
