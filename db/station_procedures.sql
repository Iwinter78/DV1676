DROP PROCEDURE IF EXISTS get_all_stations;
DROP PROCEDURE IF EXISTS edit_charging_size;

DELIMITER ;;
CREATE PROCEDURE get_all_stations()
BEGIN
    SELECT * FROM station;
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE edit_charging_size(
    IN in_id INT,
    IN in_charging_size INT
)
BEGIN
    UPDATE station
    SET charging_size = in_charging_size
    WHERE id = in_id;
END;;
DELIMITER ;