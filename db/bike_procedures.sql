-- Bike Procedures

DROP PROCEDURE IF EXISTS create_bike;
DROP PROCEDURE IF EXISTS update_bike_position;
DROP PROCEDURE IF EXISTS get_all_bikes;
DROP PROCEDURE IF EXISTS get_bike_by_id;
DROP PROCEDURE IF EXISTS book_bike;
DROP PROCEDURE IF EXISTS return_bike;


DELIMITER ;;

CREATE PROCEDURE create_bike(
    IN in_gps VARCHAR(255),
    IN in_city VARCHAR(255)
)
BEGIN
    INSERT INTO bike (gps, city)
    VALUES (in_gps, in_city);
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

CREATE PROCEDURE get_all_bikes()
BEGIN
    SELECT * FROM bike;
END;;

CREATE PROCEDURE get_bike_by_id(
    IN bike_id INT
)
BEGIN
    SELECT * FROM bike WHERE id = bike_id;
END;;

CREATE PROCEDURE book_bike(
    in_bike_id INT,
    in_user_id INT
)
BEGIN
    UPDATE bike
    set bike_status = false, currentuser = in_user_id
    WHERE id = in_bike_id;
END;;

CREATE PROCEDURE return_bike(
    in_bike_id INT
)
BEGIN 
    UPDATE bike
    set bike_status = true, currentuser = null
    WHERE id = in_bike_id;
END;;

DELIMITER ;
