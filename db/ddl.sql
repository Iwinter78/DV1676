
-- Drop existing tables
DROP TABLE IF EXISTS `user_log`;
DROP TABLE IF EXISTS `bike_log`;
DROP TABLE IF EXISTS `station_log`;
DROP TABLE IF EXISTS `bank_log`;

DROP TABLE IF EXISTS `bike`;
DROP TABLE IF EXISTS `station`;
DROP TABLE IF EXISTS `city`;
DROP TABLE IF EXISTS `bank`;
DROP TABLE IF EXISTS `users`;


-- Primary tables
CREATE TABLE `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    debt DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE `city` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL UNIQUE,
    city_gps VARCHAR(255) NOT NULL
);

--start_time TIMESTAMP,
--start_location VARCHAR(255),
--end_time TIMESTAMP,
--end_location VARCHAR(255),
-- bike_status: true = available, false = in use
CREATE TABLE `bike` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_status BOOLEAN NOT NULL DEFAULT true,
    gps VARCHAR(255),
    city INT,
    currentuser INT,
    FOREIGN KEY (currentuser) REFERENCES users(id),
    FOREIGN KEY (city) REFERENCES city(id)
);

CREATE TABLE `station` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    charge_taken INT,
    city INT,
    charging_size INT,
    gps VARCHAR(255),
    FOREIGN KEY (city) REFERENCES city(id)
);

CREATE TABLE `bank` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cashisking DECIMAL(10,2) NOT NULL DEFAULT 0.00
);

-- Log tables
CREATE TABLE `user_log` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_time TIMESTAMP,
    log_data VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE `bike_log` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_time TIMESTAMP,
    log_data VARCHAR(255),
    log_userid INT,
    FOREIGN KEY (id) REFERENCES bike(id),
    FOREIGN KEY (log_userid) REFERENCES users(id)
);

CREATE TABLE `station_log` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_time TIMESTAMP,
    log_data VARCHAR(255),
    FOREIGN KEY (id) REFERENCES station(id)
);

CREATE TABLE `bank_log` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_time TIMESTAMP,
    log_data VARCHAR(255),
    FOREIGN KEY (id) REFERENCES bank(id)
);
