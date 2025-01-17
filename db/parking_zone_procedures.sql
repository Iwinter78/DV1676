DROP PROCEDURE IF EXISTS get_all_parking_zones;

DELIMITER ;;
CREATE PROCEDURE get_all_parking_zones()
BEGIN
    SELECT * FROM parking_zones;
END;;
DELIMITER ;
