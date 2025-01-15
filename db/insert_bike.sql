

LOAD DATA LOCAL INFILE './example_bikes.csv'
INTO TABLE bike
CHARSET utf8
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(gps,city,battery);

SHOW WARNINGS;


