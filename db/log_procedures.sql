DROP PROCEDURE IF EXISTS get_user_log;
DROP PROCEDURE IF EXISTS show_user_logs;

DROP PROCEDURE IF EXISTS show_bike_logs;
DROP PROCEDURE IF EXISTS show_station_logs;
DROP PROCEDURE IF EXISTS show_bank_logs;

DELIMITER ;;
CREATE PROCEDURE get_user_log(IN username_param VARCHAR(255))
BEGIN
    SELECT u.id AS user_id, u.username, bl.log_time, bl.log_data
    FROM users u
JOIN bike_log bl ON u.id = bl.log_userid
    WHERE u.username = username_param;
END;;

CREATE PROCEDURE show_user_logs()
BEGIN
    SELECT * FROM user_log;
END;;

CREATE PROCEDURE show_bike_logs()
BEGIN
    SELECT * FROM bike_log;
END;;

CREATE PROCEDURE show_station_logs()
BEGIN
    SELECT * FROM station_log;
END;;

CREATE PROCEDURE show_bank_logs()
BEGIN
    SELECT * FROM bank_log;
END;;
DELIMITER ;
