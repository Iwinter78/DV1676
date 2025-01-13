

LOAD DATA LOCAL INFILE './bikes_1000.csv'
INTO TABLE bike
CHARSET utf8
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(gps,city,battery);

SHOW WARNINGS;


