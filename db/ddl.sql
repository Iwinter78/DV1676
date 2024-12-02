USE magicbike;

-- Drop existing tables
DROP TABLE IF EXISTS `user_log`;
DROP TABLE IF EXISTS `bike_log`;
DROP TABLE IF EXISTS `station_log`;
DROP TABLE IF EXISTS `bank_log`;

DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `bike`;
DROP TABLE IF EXISTS `station`;
DROP TABLE IF EXISTS `bank`;

-- Primary tables
CREATE TABLE `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(255) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) NOT NULL,
    debt DECIMAL(10,2) NOT NULL,
    role VARCHAR(255) NOT NULL
);

-- bike_status: true = available, false = in use
CREATE TABLE `bike` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_status BOOLEAN NOT NULL DEFAULT true,
    gps VARCHAR(255),
    start_time TIMESTAMP,
    start_location VARCHAR(255),
    end_time TIMESTAMP,
    end_location VARCHAR(255),
    history_userid INT,
    currentuser INT
);

CREATE TABLE `station` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    charge_taken INT,
    charging_size INT,
    gps VARCHAR(255)
);

CREATE TABLE `bank` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cashisking DECIMAL(10,2)
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
    FOREIGN KEY (id) REFERENCES bike(id)
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
