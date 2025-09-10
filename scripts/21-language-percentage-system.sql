-- Update configurations table to support language percentages
-- Remove any existing language configurations
DELETE FROM configurations WHERE config_key = 'languages';

-- Insert new language configuration with percentages
INSERT INTO configurations (config_key, config_value, description) VALUES 
('languages', '{"en_US": 90, "es_US": 10}', 'Language distribution percentages for user agent generation');

-- Update any existing language arrays to use only en_US and es_US with percentages
UPDATE configurations 
SET config_value = '{"en_US": 90, "es_US": 10}', 
    description = 'Language distribution percentages for user agent generation'
WHERE config_key = 'languages';
