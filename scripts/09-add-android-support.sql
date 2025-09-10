-- Add Android device models table
CREATE TABLE IF NOT EXISTS android_device_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL UNIQUE,
  android_version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Android build numbers table
CREATE TABLE IF NOT EXISTS android_build_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  android_version TEXT NOT NULL UNIQUE,
  build_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Android app versions table (Facebook and Chrome)
CREATE TABLE IF NOT EXISTS android_app_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_type TEXT NOT NULL CHECK (app_type IN ('facebook', 'chrome')),
  version TEXT NOT NULL,
  iabmv TEXT DEFAULT '1',
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_android_device_models_active ON android_device_models(is_active);
CREATE INDEX IF NOT EXISTS idx_android_build_numbers_active ON android_build_numbers(is_active);
CREATE INDEX IF NOT EXISTS idx_android_app_versions_active_type ON android_app_versions(is_active, app_type);

-- Enable RLS on Android tables
ALTER TABLE android_device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_build_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE android_app_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Android tables
CREATE POLICY "Allow authenticated read" ON android_device_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON android_build_numbers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON android_app_versions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated manage" ON android_device_models FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage" ON android_build_numbers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage" ON android_app_versions FOR ALL TO authenticated USING (true);

-- Update existing tables to support Android
ALTER TABLE generation_history DROP CONSTRAINT IF EXISTS generation_history_app_type_check;
ALTER TABLE generation_history ADD CONSTRAINT generation_history_app_type_check 
  CHECK (app_type IN ('instagram', 'facebook', 'android_facebook', 'android_instagram'));

ALTER TABLE blacklisted_user_agents DROP CONSTRAINT IF EXISTS blacklisted_user_agents_app_type_check;
ALTER TABLE blacklisted_user_agents ADD CONSTRAINT blacklisted_user_agents_app_type_check 
  CHECK (app_type IN ('instagram', 'facebook', 'android_facebook', 'android_instagram'));
