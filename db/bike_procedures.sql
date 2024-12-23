-- Bike Procedures

DROP PROCEDURE IF EXISTS create_bike;
DROP PROCEDURE IF EXISTS get_user_role;
DROP PROCEDURE IF EXISTS update_bike_position;
DROP PROCEDURE IF EXISTS get_all_bike_positions;

DELIMITER ;;

CREATE PROCEDURE create_bike(
    IN in_gps VARCHAR(255),
    IN in_city VARCHAR(255)
)
BEGIN
    INSERT INTO bike (gps, city)
    VALUES (in_gps, in_city);
END;;

CREATE PROCEDURE get_user_role(IN username_param VARCHAR(255))
BEGIN
    SELECT role FROM users
    where username = username_param;
END;;

CREATE PROCEDURE update_bike_position(
    IN in_id INT,
    IN in_gps VARCHAR(255)
)
BEGIN
    UPDATE bike
    SET gps = in_gps
    WHERE id = in_id;
END;;

CREATE PROCEDURE get_all_bike_positions()
BEGIN
    SELECT gps FROM bike;
END;;
DELIMITER ;
