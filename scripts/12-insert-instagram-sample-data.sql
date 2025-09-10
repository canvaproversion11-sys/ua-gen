-- Insert sample Instagram Device Models
INSERT INTO instagram_device_models (manufacturer, model, code, resolutions, chipset, android_version, is_active) VALUES
('samsung', 'SM-S721U', 'r11s', '1080x2340', 'Snapdragon 7 Gen 1', 14, true),
('samsung', 'SM-A546U', 'a54xq', '1080x2340', 'Exynos 1380', 14, true),
('samsung', 'SM-G991U', 'o1q', '1080x2400', 'Snapdragon 888', 13, true),
('samsung', 'SM-G998U', 's21u', '1440x3200', 'Snapdragon 888', 13, true),
('samsung', 'SM-A525U', 'a52sxq', '1080x2400', 'Snapdragon 778G', 13, true),
('google', 'Pixel 7', 'cheetah', '1080x2400', 'Google Tensor G2', 14, true),
('google', 'Pixel 6', 'oriole', '1080x2400', 'Google Tensor', 13, true),
('oneplus', 'OnePlus 11', 'salami', '1440x3216', 'Snapdragon 8 Gen 2', 14, true),
('xiaomi', 'Mi 13', 'fuxi', '1080x2400', 'Snapdragon 8 Gen 2', 13, true),
('oppo', 'Find X5', 'op4f2f', '1080x2400', 'Snapdragon 888', 13, true)
ON CONFLICT DO NOTHING;

-- Insert sample Instagram Versions
INSERT INTO instagram_versions (version, unique_id, is_active) VALUES
('389.0.0.49.87', '379506944', true),
('390.0.0.43.81', '379606325', true),
('391.0.0.50.22', '379706111', true),
('392.0.0.42.109', '379806789', true),
('393.0.0.45.96', '379906456', true),
('394.0.0.41.104', '380006123', true),
('395.0.0.38.75', '380106890', true),
('396.0.0.44.88', '380206567', true)
ON CONFLICT DO NOTHING;

-- Insert sample Chrome Versions
INSERT INTO chrome_versions (version, is_active) VALUES
('120.0.6099.210', true),
('121.0.6167.164', true),
('122.0.6261.64', true),
('123.0.6312.40', true),
('124.0.6367.54', true),
('125.0.6422.165', true),
('126.0.6478.122', true),
('127.0.6533.88', true)
ON CONFLICT DO NOTHING;

-- Insert sample Resolution DPIs
INSERT INTO resolution_dpis (resolution, dpis, is_active) VALUES
('720x1600', ARRAY[320, 280, 300], true),
('1080x2280', ARRAY[420, 440, 400], true),
('1080x2340', ARRAY[450, 420, 480], true),
('1080x2400', ARRAY[440, 420, 460], true),
('1440x3040', ARRAY[550, 560, 540], true),
('1440x3200', ARRAY[560, 550, 580], true),
('1440x3216', ARRAY[565, 555, 575], true)
ON CONFLICT DO NOTHING;
