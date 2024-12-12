USE magicbike;

-- Clear existing data
DELETE FROM users;

-- Insert city data

-- Insert user data
LOAD DATA LOCAL INFILE 'example_users.csv'
INTO TABLE users
CHARSET utf8
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(email, username, balance, debt, role);

-- DEN HÄR SKITEN VILL INTE FUNKAR https://i.gyazo.com/5644085c47815e060001e178f20ee94c.png
-- LOAD DATA LOCAL INFILE 'example_bikes.csv'
-- INTO TABLE bike
-- CHARSET utf8
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 LINES
-- (@gps, city)
-- SET gps = REPLACE(@gps, ';', ',');

-- Show any warnings
SHOW WARNINGS;


