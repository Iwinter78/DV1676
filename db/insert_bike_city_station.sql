
INSERT INTO city (city_name, city_gps) 
VALUES 
('Karlskrona', '56.1612,15.5869'),
('Stockholm', '59.3293,18.0686'),
('Malmö', '55.604981,13.003822');

SET @Karlskrona_id = (SELECT id FROM city WHERE city_name = 'Karlskrona');
SET @Stockholm_id = (SELECT id FROM city WHERE city_name = 'Stockholm');
SET @Malmo_id = (SELECT id FROM city WHERE city_name = 'Malmö');


INSERT INTO bike (gps, city, battery)
VALUES
('9F8Q5H6P+FQ', @Karlskrona_id, 10),
('9F8Q5H6P+JP', @Karlskrona_id),
('9F8Q5H6P+Q9', @Karlskrona_id),
('9F8Q5H6P+QH', @Karlskrona_id),
('9F7JHXWX+4W', @Malmo_id),
('9F7MH2V2+VX', @Malmo_id),
('9F7MH2V4+3X', @Malmo_id),
('9F7MH2Q4+2V', @Malmo_id),
('9FFW83FC+58', @Stockholm_id),
('9FFW83FC+V4', @Stockholm_id),
('9FFW83FF+GP', @Stockholm_id),
('9FFW83H8+HQ', @Stockholm_id);


INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES 
(0, @Karlskrona_id, 10, '56.162086, 15.588522'),
(0, @Karlskrona_id, 10, '56.163294, 15.586708'),
(0, @Karlskrona_id, 10, '56.165126, 15.585624'),
(0, @Karlskrona_id, 10, '56.161617, 15.586553'),
(0, @Karlskrona_id, 10, '56.158541, 15.585577'),
(0, @Karlskrona_id, 10, '56.181826, 15.590776'),
(0, @Karlskrona_id, 10, '56.181078, 15.591943'),
(0, @Karlskrona_id, 10, '56.160930, 15.586487'),
(0, @Stockholm_id, 10, '59.328709, 18.064770'),
(0, @Stockholm_id, 10, '59.330312, 18.068750'),
(0, @Stockholm_id, 10, '59.330531, 18.073149'),
(0, @Stockholm_id, 10, '59.331248, 18.066562'),
(0, @Stockholm_id, 10, '59.330158, 18.062196'),
(0, @Malmo_id, 10, '55.604926, 12.998983'),
(0, @Malmo_id, 10, '55.604739, 13.004712'),
(0, @Malmo_id, 10, '55.603829, 13.001172'),
(0, @Malmo_id, 10, '55.603181, 13.003468'),
(0, @Malmo_id, 10, '55.606593, 13.001236'),
(0, @Malmo_id, 10, '55.605684, 13.007577'),
(0, @Malmo_id, 10, '55.604139, 13.008575'),
(0, @Malmo_id, 10, '55.606654, 13.004004');