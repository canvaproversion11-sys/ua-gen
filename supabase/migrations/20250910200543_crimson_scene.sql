/*
  # Create Sample Access Keys

  1. Sample Data
    - Create a default admin access key for initial setup
    - Create a sample user access key for testing
    
  2. Security
    - All keys are created with proper defaults
    - Admin key never expires by default
    - User key has a long expiration for testing

  3. Notes
    - Change the admin key after first login for security
    - These are sample keys for initial setup only
*/

-- Insert sample access keys
INSERT INTO access_keys (access_key, user_name, type, is_active, expires_at) VALUES
  ('ADMIN_KEY_123456789_CHANGE_THIS', 'Default Admin', 'admin', true, NULL),
  ('USER_KEY_987654321_SAMPLE', 'Test User', 'user', true, now() + interval '1 year')
ON CONFLICT (access_key) DO NOTHING;

-- Create a helpful function to generate random access keys
CREATE OR REPLACE FUNCTION generate_access_key() 
RETURNS text 
LANGUAGE plpgsql 
AS $$
DECLARE
    chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result text := '';
    i integer;
BEGIN
    FOR i IN 1..32 LOOP
        result := result || substr(chars, floor(random() * length(chars))::int + 1, 1);
    END LOOP;
    RETURN result;
END;
$$;