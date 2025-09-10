-- Clean up any user role related data and ensure admin-only system

-- Remove any non-admin entries from access_keys if they exist
-- (This assumes we want to keep only admin access)
DELETE FROM access_keys WHERE user_role = 'user' OR user_role IS NULL;

-- Remove any non-admin users from users table
DELETE FROM users WHERE role = 'user' OR role IS NULL;

-- Update any remaining records to ensure consistency
UPDATE access_keys SET user_name = COALESCE(user_name, 'admin') WHERE user_name IS NULL;
UPDATE users SET email = COALESCE(email, 'admin@system.local') WHERE email IS NULL;
