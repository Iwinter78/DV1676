INSERT INTO bank (cashisking) VALUES (0.00);

LOAD DATA LOCAL INFILE './users.csv'
INTO TABLE users
CHARSET utf8
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(email, username, balance, debt, role);

SHOW WARNINGS;


