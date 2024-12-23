--Använd den här för att skapa Karlskrona som stad, sen cyklar och laddstationer, skit LOAD DATA skit funkar inte på cyklarna
USE magicbike;

DELETE FROM city;
DELETE FROM bike;
DELETE FROM station;


INSERT INTO city (city_name, city_gps) 
VALUES ("Karlskrona", "56.1612, 15.5869");

INSERT INTO bike (gps, city)
VALUES ("56.1625,15.5878", "Karlskrona");

INSERT INTO bike (gps, city)
VALUES ("56.1630,15.5880", "Karlskrona");

INSERT INTO bike (gps, city)
VALUES ("56.1600,15.5850", "Karlskrona");

INSERT INTO bike (gps, city)
VALUES ("56.1640,15.5900", "Karlskrona");

INSERT INTO bike (gps, city)
VALUES ("56.1650,15.5950", "Karlskrona");

INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES (0, 'Karlskrona', 10, '56.1594, 15.5862');

INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES (0, 'Karlskrona', 10, '56.1619, 15.5850');

INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES (0, 'Karlskrona', 10, '56.0972, 15.3508');

INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES (0, 'Karlskrona', 10, '56.1608, 15.5868');

INSERT INTO station (charge_taken, city, charging_size, gps) 
VALUES (0, 'Karlskrona', 10, '56.1812, 15.6097');
