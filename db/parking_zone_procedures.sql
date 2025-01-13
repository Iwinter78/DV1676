DROP PROCEDURE IF EXISTS get_all_parking_zones;
DROP PROCEDURE IF EXISTS update_amount_of_bikes;

DELIMITER ;;
CREATE PROCEDURE get_all_parking_zones()
BEGIN
    SELECT * FROM parking_zones;
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE update_amount_of_bikes(
    IN zone_id INT,
    IN amount INT
)
BEGIN
    UPDATE parking_zones
    SET bikes_in_zone = amount
    WHERE id = zone_id;
END;;
DELIMITER ;