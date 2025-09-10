/*
  # Create Generation History Table

  1. New Tables
    - `generation_history`
      - `id` (uuid, primary key)
      - `app_type` (text) - Type of app (instagram, facebook, etc.)
      - `quantity` (integer) - Number of user agents generated
      - `user_agents` (text[]) - Array of generated user agents
      - `is_downloaded` (boolean) - Whether the user agents were downloaded
      - `generated_at` (timestamp) - When generated
      - `created_by` (text) - Access key of the creator
      
  2. Security
    - Enable RLS on `generation_history` table
    - Add policy for users to manage their own history
    - Add policy for admins to see all history
*/

-- Create generation_history table
CREATE TABLE IF NOT EXISTS generation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_type text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  user_agents text[] DEFAULT '{}',
  is_downloaded boolean DEFAULT false,
  generated_at timestamptz DEFAULT now(),
  created_by text
);

-- Enable Row Level Security
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own generation history"
  ON generation_history
  FOR ALL
  TO authenticated
  USING (
    created_by = current_setting('app.current_access_key', true)
    OR EXISTS (
      SELECT 1 FROM access_keys ak 
      WHERE ak.access_key = current_setting('app.current_access_key', true)
      AND ak.type = 'admin' 
      AND ak.is_active = true
      AND (ak.expires_at IS NULL OR ak.expires_at > now())
    )
  )
  WITH CHECK (
    created_by = current_setting('app.current_access_key', true)
    OR EXISTS (
      SELECT 1 FROM access_keys ak 
      WHERE ak.access_key = current_setting('app.current_access_key', true)
      AND ak.type = 'admin' 
      AND ak.is_active = true
      AND (ak.expires_at IS NULL OR ak.expires_at > now())
    )
  );

-- Allow anonymous access for reading (needed for authentication flow)
CREATE POLICY "Anonymous can read for auth purposes"
  ON generation_history
  FOR SELECT
  TO anon
  USING (false); -- Actually block anonymous access, but policy needed

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generation_history_created_by 
ON generation_history (created_by, generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_generation_history_app_type 
ON generation_history (app_type, generated_at DESC);