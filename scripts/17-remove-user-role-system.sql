-- Remove user role system and make it admin-only

-- Update access_keys table to remove user_role column and related constraints
ALTER TABLE access_keys DROP COLUMN IF EXISTS user_role;

-- Update users table to remove role column and related constraints  
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Drop role-related indexes
DROP INDEX IF EXISTS idx_access_keys_role;

-- Update any existing access keys to be admin-only (no role differentiation needed)
-- Since we're removing the role system entirely, all remaining keys will be admin keys

-- Add comment to document the change
COMMENT ON TABLE access_keys IS 'Admin-only access keys table - user role system removed';
COMMENT ON TABLE users IS 'Admin users table - role system removed';
