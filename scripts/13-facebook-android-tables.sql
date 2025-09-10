-- Recreate Android Admin Panel Tables
-- This script will recreate all Android-related tables that were accidentally deleted

-- Drop existing tables if they exist (to ensure clean recreation)
DROP TABLE IF EXISTS android_app_versions;
DROP TABLE IF EXISTS android_build_numbers;
DROP TABLE IF EXISTS android_device_models;

-- Create android_device_models table
CREATE TABLE android_device_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    android_version VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create android_build_numbers table
CREATE TABLE android_build_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    android_version VARCHAR(50) NOT NULL,
    build_number VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create android_app_versions table
CREATE TABLE android_app_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_type VARCHAR(50) NOT NULL CHECK (app_type IN ('facebook', 'chrome')),
    version VARCHAR(100) NOT NULL,
    iabmv VARCHAR(10) DEFAULT NULL, -- Only used for Facebook
    is_active BOOLEAN DEFAULT true,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_android_device_models_active ON android_device_models(is_active);
CREATE INDEX idx_android_device_models_version ON android_device_models(android_version);

CREATE INDEX idx_android_build_numbers_active ON android_build_numbers(is_active);
CREATE INDEX idx_android_build_numbers_version ON android_build_numbers(android_version);

CREATE INDEX idx_android_app_versions_active ON android_app_versions(is_active);
CREATE INDEX idx_android_app_versions_type ON android_app_versions(app_type);

-- Enable Row Level Security (RLS)
ALTER TABLE android_device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_build_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_app_versions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on android_device_models" ON android_device_models FOR ALL USING (true);
CREATE POLICY "Allow all operations on android_build_numbers" ON android_build_numbers FOR ALL USING (true);
CREATE POLICY "Allow all operations on android_app_versions" ON android_app_versions FOR ALL USING (true);
