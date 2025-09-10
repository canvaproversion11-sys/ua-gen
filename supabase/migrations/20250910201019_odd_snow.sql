/*
  # Access Keys Table Enhancement

  1. Table Updates
    - `access_keys` table
      - Add `type` column (text) - 'user' or 'admin'
      - Add `expires_at` column (timestamptz, nullable) - expiration date
      - Add `is_active` column (boolean, default true) - active status
      - Add `last_login` column (timestamptz, nullable) - track last login

  2. Security
    - Enable RLS on `access_keys` table
    - Add policy for admins to manage all access keys
    - Add policy for users to read their own access key info

  3. Data Migration
    - Set existing records to type 'user' and active status true
    - Ensure backward compatibility
*/

-- Create access_keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS access_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_key text UNIQUE NOT NULL,
  user_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add new columns if they don't exist
DO $$
BEGIN
  -- Add type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'type'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN type text DEFAULT 'user' CHECK (type IN ('user', 'admin'));
  END IF;

  -- Add expires_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN expires_at timestamptz;
  END IF;

  -- Add is_active column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add last_login column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_keys' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE access_keys ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Update existing records to have default values
UPDATE access_keys 
SET 
  type = COALESCE(type, 'user'),
  is_active = COALESCE(is_active, true)
WHERE type IS NULL OR is_active IS NULL;

-- Enable Row Level Security
ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Admins can manage all access keys" ON access_keys;
  DROP POLICY IF EXISTS "Users can read own access key" ON access_keys;
  DROP POLICY IF EXISTS "Anyone can authenticate" ON access_keys;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Policy for admins to manage all access keys (full CRUD)
CREATE POLICY "Admins can manage all access keys"
  ON access_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM access_keys ak 
      WHERE ak.access_key = current_setting('app.current_access_key', true)
      AND ak.type = 'admin' 
      AND ak.is_active = true
      AND (ak.expires_at IS NULL OR ak.expires_at > now())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM access_keys ak 
      WHERE ak.access_key = current_setting('app.current_access_key', true)
      AND ak.type = 'admin' 
      AND ak.is_active = true
      AND (ak.expires_at IS NULL OR ak.expires_at > now())
    )
  );

-- Policy for users to read their own access key info
CREATE POLICY "Users can read own access key"
  ON access_keys
  FOR SELECT
  TO authenticated
  USING (
    access_key = current_setting('app.current_access_key', true)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Policy for authentication - allows anyone to SELECT for authentication purposes
CREATE POLICY "Anyone can authenticate"
  ON access_keys
  FOR SELECT
  TO anon
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Create an index for better performance on authentication queries
CREATE INDEX IF NOT EXISTS idx_access_keys_key_active 
ON access_keys (access_key, is_active, expires_at);

-- Create an index for better performance on type filtering
CREATE INDEX IF NOT EXISTS idx_access_keys_type 
ON access_keys (type, is_active);