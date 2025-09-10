-- Fresh Supabase setup for User Agent Generator
-- This creates all necessary tables for both iOS and Android support

-- Create iOS tables
CREATE TABLE IF NOT EXISTS device_models (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    ios_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_versions (
    id SERIAL PRIMARY KEY,
    app_type VARCHAR(20) NOT NULL CHECK (app_type IN ('instagram', 'facebook')),
    version VARCHAR(50) NOT NULL,
    build_number VARCHAR(50),
    fbrv VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Android tables
CREATE TABLE IF NOT EXISTS android_device_models (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    android_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS android_build_numbers (
    id SERIAL PRIMARY KEY,
    android_version VARCHAR(20) NOT NULL,
    build_number VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS android_app_versions (
    id SERIAL PRIMARY KEY,
    app_type VARCHAR(20) NOT NULL CHECK (app_type IN ('facebook', 'chrome')),
    version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable RLS for all tables (development mode)
ALTER TABLE device_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE android_device_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE android_build_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE android_app_versions DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable all operations for all users" ON device_models;
DROP POLICY IF EXISTS "Enable all operations for all users" ON app_versions;
DROP POLICY IF EXISTS "Enable all operations for all users" ON android_device_models;
DROP POLICY IF EXISTS "Enable all operations for all users" ON android_build_numbers;
DROP POLICY IF EXISTS "Enable all operations for all users" ON android_app_versions;
