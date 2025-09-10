-- Restore user system with advanced features
-- Add user_role back to access_keys table
ALTER TABLE access_keys ADD COLUMN IF NOT EXISTS user_role VARCHAR(20) DEFAULT 'user';
ALTER TABLE access_keys ADD COLUMN IF NOT EXISTS generation_limit INTEGER DEFAULT 100;
ALTER TABLE access_keys ADD COLUMN IF NOT EXISTS used_generations INTEGER DEFAULT 0;

-- Update existing records to be admin
UPDATE access_keys SET user_role = 'admin' WHERE user_role IS NULL;

-- Create user_generations table for history tracking
CREATE TABLE IF NOT EXISTS user_generations (
    id SERIAL PRIMARY KEY,
    access_key VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    generated_data JSONB NOT NULL,
    platform VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (access_key) REFERENCES access_keys(access_key) ON DELETE CASCADE
);

-- Create admin_notices table for notice system
CREATE TABLE IF NOT EXISTS admin_notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_user VARCHAR(255), -- NULL means for all users
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_generations_access_key ON user_generations(access_key);
CREATE INDEX IF NOT EXISTS idx_user_generations_created_at ON user_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_notices_target_user ON admin_notices(target_user);
CREATE INDEX IF NOT EXISTS idx_admin_notices_active ON admin_notices(is_active);
