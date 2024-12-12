USE magicbike;

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

DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS get_user;
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS show_user_log;
DROP PROCEDURE IF EXISTS show_bike_log;
DROP PROCEDURE IF EXISTS show_station_log;
DROP PROCEDURE IF EXISTS show_bank_log;

-- Primary tables
CREATE TABLE `users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) NOT NULL,
    debt DECIMAL(10,2) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE `city` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL UNIQUE,
    city_gps VARCHAR(255) NOT NULL
);

-- bike_status: true = available, false = in use
CREATE TABLE `bike` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_status BOOLEAN NOT NULL DEFAULT true,
    gps VARCHAR(255),
    city VARCHAR(255),
    start_time TIMESTAMP,
    start_location VARCHAR(255),
    end_time TIMESTAMP,
    end_location VARCHAR(255),
    currentuser INT,
    FOREIGN KEY (currentuser) REFERENCES users(id),
    FOREIGN KEY (city) REFERENCES city(city_name)
);

CREATE TABLE `station` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    charge_taken INT,
    city VARCHAR(255),
    charging_size INT,
    gps VARCHAR(255),
    FOREIGN KEY (city) REFERENCES city(city_name)
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

DELIMITER ;;
CREATE PROCEDURE create_user(
    IN in_email VARCHAR(255),
    IN in_username VARCHAR(255)
)
BEGIN
    INSERT INTO users (email, username, balance, debt, role)
    VALUES (in_email, in_username, 0.00, 0.00, 'user');
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE get_user(IN username_param VARCHAR(255))
BEGIN
    SELECT * FROM users WHERE username = username_param;
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE delete_user(IN username_param VARCHAR(255))
BEGIN
    DELETE FROM users WHERE username = username_param;
END;;
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE get_user_log(IN username_param VARCHAR(255))
BEGIN
    SELECT u.id AS user_id, u.username, ul.log_time, ul.log_data
    FROM users u
    JOIN user_log ul ON u.id = ul.id
    WHERE u.username = username_param;
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE show_user_log()
BEGIN
    SELECT * FROM user_log;
END
;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE show_bike_log()
BEGIN
    SELECT * FROM bike_log;
END
;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE show_station_log()
BEGIN
    SELECT * FROM station_log;
END
;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE show_bank_log()
BEGIN
    SELECT * FROM bank_log;
END
;;
DELIMITER ;
