-- Bike Procedures

DROP PROCEDURE IF EXISTS create_bike;
DROP PROCEDURE IF EXISTS update_bike_position;
DROP PROCEDURE IF EXISTS get_all_bikes;
DROP PROCEDURE IF EXISTS get_bike_by_id;
DROP PROCEDURE IF EXISTS book_bike;
DROP PROCEDURE IF EXISTS return_bike;
DROP PROCEDURE IF EXISTS book_trip;
DROP PROCEDURE IF EXISTS end_trip;
DROP PROCEDURE IF EXISTS get_trip_price;
DROP PROCEDURE IF EXISTS get_trip;

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
    in_user_id VARCHAR(255)
)
BEGIN
    UPDATE bike
    set bike_status = false, currentuser = in_user_id
    WHERE id = in_bike_id;
END;;

CREATE PROCEDURE book_trip(
    IN bike_id_param INT,
    IN user_id_param INT
)
BEGIN
    INSERT INTO trips (bike_id, user_id, start_time, active)
    VALUES (bike_id_param, user_id_param, NOW(), TRUE);
END;;

CREATE PROCEDURE end_trip(
    IN bike_id_param INT
)
BEGIN
    UPDATE trips
    SET end_time = NOW(),
        total_price = TIMESTAMPDIFF(MINUTE, start_time, NOW()) * 2,
        active = 0
    WHERE bike_id = bike_id_param AND active = TRUE;
END;;

CREATE PROCEDURE get_trip(
    IN bike_id_param INT
)
BEGIN
    SELECT trip_id
    FROM trips
    WHERE bike_id = bike_id_param AND active = TRUE;
END;;

CREATE PROCEDURE get_trip_details(
    IN trip_id_param INT
)
BEGIN
    SELECT start_time, end_time, total_price
    FROM trips 
    WHERE trip_id = trip_id_param;
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
