-- Insert sample data for Android Admin Panel
-- This script adds sample data to test the Android admin panel functionality

-- Insert sample Android device models
INSERT INTO android_device_models (model_name, android_version, is_active) VALUES
('SM-G991U', 'Android 14', true),
('SM-G996U', 'Android 14', true),
('SM-G998U', 'Android 14', true),
('SM-A546U', 'Android 13', true),
('SM-A736U', 'Android 13', true),
('Pixel 8', 'Android 14', true),
('Pixel 8 Pro', 'Android 14', true),
('Pixel 7', 'Android 13', true),
('Pixel 7 Pro', 'Android 13', true),
('OnePlus 11', 'Android 13', true),
('OnePlus 12', 'Android 14', true),
('Xiaomi 13', 'Android 13', true),
('Xiaomi 14', 'Android 14', true);

-- Insert sample Android build numbers
INSERT INTO android_build_numbers (android_version, build_number, is_active) VALUES
('Android 14', 'UP1A.231005.007; wv', true),
('Android 14', 'UQ1A.240205.004; wv', true),
('Android 14', 'AP2A.240905.003; wv', true),
('Android 13', 'TQ3A.230901.001; wv', true),
('Android 13', 'TQ3A.230805.001; wv', true),
('Android 13', 'TP1A.220624.014; wv', true),
('Android 12', 'SQ3A.220705.004; wv', true),
('Android 12', 'SP2A.220405.004; wv', true),
('Android 11', 'RQ3A.210905.001; wv', true),
('Android 11', 'RP1A.200720.011; wv', true);

-- Insert sample Facebook app versions
INSERT INTO android_app_versions (app_type, version, iabmv, is_active) VALUES
('facebook', '523.0.0.39.61', '1', true),
('facebook', '522.0.0.38.120', '1', true),
('facebook', '521.0.0.37.95', '1', true),
('facebook', '520.0.0.36.87', '1', true),
('facebook', '519.0.0.35.74', '1', true),
('facebook', '518.0.0.34.69', '1', true),
('facebook', '517.0.0.33.65', '1', true),
('facebook', '516.0.0.32.58', '1', true);

-- Insert sample Chrome app versions
INSERT INTO android_app_versions (app_type, version, iabmv, is_active) VALUES
('chrome', '138.0.7204.157', NULL, true),
('chrome', '137.0.7199.120', NULL, true),
('chrome', '136.0.7194.147', NULL, true),
('chrome', '135.0.7189.98', NULL, true),
('chrome', '134.0.7184.93', NULL, true),
('chrome', '133.0.7179.87', NULL, true),
('chrome', '132.0.7174.84', NULL, true),
('chrome', '131.0.7169.79', NULL, true);
