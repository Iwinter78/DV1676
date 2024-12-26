--Använd den här för att skapa Karlskrona som stad, sen cyklar och laddstationer, skit LOAD DATA skit funkar inte på cyklarna
USE magicbike;

-- Clear existing data
DELETE FROM city;
DELETE FROM bike;
DELETE FROM station;

-- Insert city data
INSERT INTO city (city_name, city_gps) 
VALUES ('Karlskrona', '56.1612,15.5869');

INSERT INTO city (city_name, city_gps) 
VALUES ('Stockholm', '59.3293,18.0686');

INSERT INTO city (city_name, city_gps) 
VALUES ('Malmö', '55.604981,13.003822');
-- Insert bike data
INSERT INTO bike (gps, city)
VALUES 
('56.1625,15.5878', 'Karlskrona'),
('56.1630,15.5880', 'Karlskrona'),
('56.1600,15.5850', 'Karlskrona'),
('56.1640,15.5900', 'Karlskrona'),
('56.1650,15.5950', 'Karlskrona');

-- Insert station data
INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES 
(0, '1', 10, '56.162086, 15.588522'),
(0, '1', 10, '56.163294, 15.586708'),
(0, '1', 10, '56.165126, 15.585624'),
(0, '1', 10, '56.161617, 15.586553'),
(0, '1', 10, '56.158541, 15.585577'),
(0, '1', 10, '56.181826, 15.590776'),
(0, '1', 10, '56.181078, 15.591943'),
(0, '1', 10, '56.160930, 15.586487'),

(0, '2', 10, '59.328709, 18.064770'),
(0, '2', 10, '59.330312, 18.068750'),
(0, '2', 10, '59.330531, 18.073149'),
(0, '2', 10, '59.331248, 18.066562'),
(0, '2', 10, '59.330158, 18.062196'),

(0, '3', 10, '55.604926, 12.998983'),
(0, '3', 10, '55.604739, 13.004712'),
(0, '3', 10, '55.603829, 13.001172'),
(0, '3', 10, '55.603181, 13.003468'),
(0, '3', 10, '55.606593, 13.001236'),
(0, '3', 10, '55.605684, 13.007577'),
(0, '3', 10, '55.604139, 13.008575'),
(0, '3', 10, '55.606654, 13.004004');