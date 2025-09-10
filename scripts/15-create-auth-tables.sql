-- Create authentication tables for key-based login system with role-based access

-- Users/Access Keys table
CREATE TABLE IF NOT EXISTS access_keys (
    id SERIAL PRIMARY KEY,
    access_key VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(100) DEFAULT 'system'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_access_keys_key ON access_keys(access_key);
CREATE INDEX IF NOT EXISTS idx_access_keys_active ON access_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_access_keys_role ON access_keys(user_role);
CREATE INDEX IF NOT EXISTS idx_access_keys_expires ON access_keys(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_access_keys_updated_at ON access_keys;
CREATE TRIGGER update_access_keys_updated_at
    BEFORE UPDATE ON access_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
