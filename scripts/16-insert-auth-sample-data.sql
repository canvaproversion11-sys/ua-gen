-- Insert sample authentication data

-- Insert admin users (permanent access)
INSERT INTO access_keys (access_key, user_name, user_role, expires_at, is_active, created_by) VALUES
('ADMIN-2024-MASTER-KEY-001', 'Super Admin', 'admin', NULL, true, 'system'),
('ADMIN-2024-MASTER-KEY-002', 'Admin User', 'admin', NULL, true, 'system');

-- Insert regular users with expiry dates
INSERT INTO access_keys (access_key, user_name, user_role, expires_at, is_active, created_by) VALUES
('USER-2024-PREMIUM-001', 'Premium User 1', 'user', '2024-12-31 23:59:59+00', true, 'admin'),
('USER-2024-PREMIUM-002', 'Premium User 2', 'user', '2024-12-31 23:59:59+00', true, 'admin'),
('USER-2024-BASIC-001', 'Basic User 1', 'user', '2024-10-31 23:59:59+00', true, 'admin'),
('USER-2024-BASIC-002', 'Basic User 2', 'user', '2024-11-30 23:59:59+00', true, 'admin'),
('USER-2024-TRIAL-001', 'Trial User 1', 'user', '2024-09-30 23:59:59+00', true, 'admin'),
('USER-2024-TRIAL-002', 'Trial User 2', 'user', '2024-09-15 23:59:59+00', false, 'admin');

-- Insert some expired users for testing
INSERT INTO access_keys (access_key, user_name, user_role, expires_at, is_active, created_by) VALUES
('USER-2024-EXPIRED-001', 'Expired User 1', 'user', '2024-08-01 23:59:59+00', true, 'admin'),
('USER-2024-EXPIRED-002', 'Expired User 2', 'user', '2024-07-15 23:59:59+00', false, 'admin');
