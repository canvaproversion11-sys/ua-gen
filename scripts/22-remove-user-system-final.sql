-- Final cleanup to remove user system completely and make admin-only

-- Remove user role system from access_keys table
ALTER TABLE access_keys DROP COLUMN IF EXISTS user_role;
ALTER TABLE access_keys DROP COLUMN IF EXISTS generation_limit;
ALTER TABLE access_keys DROP COLUMN IF EXISTS used_generations;
ALTER TABLE access_keys DROP COLUMN IF EXISTS expires_at;

-- Drop role-related indexes
DROP INDEX IF EXISTS idx_access_keys_role;

-- Remove any user-specific tables or data
DELETE FROM access_keys WHERE user_name != 'admin' AND access_key NOT LIKE 'admin%';

-- Update remaining access keys to be admin-only
UPDATE access_keys SET 
    user_name = COALESCE(user_name, 'admin'),
    is_active = true,
    updated_at = NOW()
WHERE user_name IS NULL OR user_name = '';

-- Add comment to document the change
COMMENT ON TABLE access_keys IS 'Admin-only access keys table - user role system completely removed';

-- Ensure we have at least one admin key for testing
INSERT INTO access_keys (access_key, user_name, is_active, created_at, updated_at)
VALUES ('admin123', 'admin', true, NOW(), NOW())
ON CONFLICT (access_key) DO NOTHING;
