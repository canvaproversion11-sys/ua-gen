-- Insert sample data for both iOS and Android

-- iOS sample data
INSERT INTO device_models (device_name, ios_version) VALUES
('iPhone 15 Pro Max', '17.2.1'),
('iPhone 15 Pro', '17.2.1'),
('iPhone 15 Plus', '17.2.1'),
('iPhone 15', '17.2.1'),
('iPhone 14 Pro Max', '16.7.4'),
('iPhone 14 Pro', '16.7.4'),
('iPhone 14 Plus', '16.7.4'),
('iPhone 14', '16.7.4');

INSERT INTO app_versions (app_type, version, build_number, fbrv) VALUES
('instagram', '317.0.0.36.111', '556052', '556052'),
('instagram', '316.0.0.29.120', '554204', '554204'),
('facebook', '449.0.0.43.111', '556052', '556052'),
('facebook', '448.0.0.36.120', '554204', '554204');

-- Android sample data
INSERT INTO android_device_models (device_name, android_version) VALUES
('SM-G998B', '13'),
('SM-G991B', '13'),
('SM-G996B', '13'),
('SM-G973F', '12'),
('SM-G975F', '12'),
('SM-G977B', '12'),
('SM-A525F', '13'),
('SM-A715F', '12');

INSERT INTO android_build_numbers (android_version, build_number) VALUES
('13', 'TP1A.220624.014'),
('13', 'TQ3A.230901.001'),
('12', 'SP1A.210812.016'),
('12', 'SP2A.220405.004'),
('11', 'RP1A.200720.012'),
('11', 'RQ3A.210905.001');

INSERT INTO android_app_versions (app_type, version) VALUES
('facebook', '449.0.0.43.111'),
('facebook', '448.0.0.36.120'),
('facebook', '447.0.0.29.108'),
('chrome', '120.0.6099.210'),
('chrome', '119.0.6045.193'),
('chrome', '118.0.5993.117');
