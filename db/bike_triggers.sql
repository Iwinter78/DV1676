DELIMITER ;;
CREATE TRIGGER `bike_log_trigger` BEFORE UPDATE ON `bike`
FOR EACH ROW
BEGIN
    INSERT INTO bike_log (bike_id, log_time, log_data, log_userid)
    VALUES (
        OLD.id,
        CURRENT_TIMESTAMP,
        CONCAT(
            'GPS: ', OLD.gps,
            ', City: ', OLD.city,
            ', Status: ', OLD.bike_status
        ),
        OLD.currentuser
    );
END;;
DELIMITER ;
