DROP PROCEDURE IF EXISTS get_all_stations;

DELIMITER ;;
CREATE PROCEDURE get_all_stations()
BEGIN
    SELECT * FROM station;
END;;
DELIMITER ;
