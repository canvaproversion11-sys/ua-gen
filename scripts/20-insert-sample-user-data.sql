-- Insert sample user access keys with different limits
INSERT INTO access_keys (access_key, user_name, user_role, generation_limit, used_generations, expires_at, is_active) VALUES
('USER-2024-DEMO-001', 'Demo User 1', 'user', 50, 5, '2025-12-31 23:59:59', true),
('USER-2024-DEMO-002', 'Demo User 2', 'user', 100, 15, '2025-06-30 23:59:59', true),
('USER-2024-DEMO-003', 'Demo User 3', 'user', 25, 20, '2025-03-31 23:59:59', true),
('USER-2024-PREMIUM-001', 'Premium User', 'user', 500, 45, '2025-12-31 23:59:59', true);

-- Insert sample notices
INSERT INTO admin_notices (title, message, target_user, is_active, expires_at) VALUES
('Welcome to User Agent Generator', 'Welcome! You can now generate user agents with your personal access key. Check your limits in the dashboard.', NULL, true, '2025-12-31 23:59:59'),
('Maintenance Notice', 'System maintenance scheduled for this weekend. Service may be temporarily unavailable.', NULL, true, '2025-02-28 23:59:59'),
('Limit Increase', 'Your generation limit has been increased. Enjoy!', 'Demo User 1', true, '2025-03-31 23:59:59');

-- Insert sample generation history
INSERT INTO user_generations (access_key, user_name, generated_data, platform, created_at) VALUES
('USER-2024-DEMO-001', 'Demo User 1', '{"browser": "Chrome", "version": "120.0.0.0", "os": "Windows 10"}', 'desktop', NOW() - INTERVAL '2 days'),
('USER-2024-DEMO-001', 'Demo User 1', '{"browser": "Firefox", "version": "121.0", "os": "macOS"}', 'desktop', NOW() - INTERVAL '1 day'),
('USER-2024-DEMO-002', 'Demo User 2', '{"browser": "Safari", "version": "17.2", "os": "iOS 17.2"}', 'mobile', NOW() - INTERVAL '3 hours'),
('USER-2024-PREMIUM-001', 'Premium User', '{"browser": "Edge", "version": "120.0.0.0", "os": "Windows 11"}', 'desktop', NOW() - INTERVAL '1 hour');
