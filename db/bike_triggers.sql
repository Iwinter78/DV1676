DELIMITER ;;

CREATE TRIGGER `bike_log_trigger` AFTER UPDATE ON `bike`
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

DELIMITER ;;
CREATE TRIGGER `bike_charge_trigger_update` BEFORE UPDATE ON `bike`
FOR EACH ROW
BEGIN
    IF NEW.battery <= 20 THEN
        SET NEW.status = 1;
    ELSE
        SET NEW.status = 0;
    END IF;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `bike_charge_trigger_insert` BEFORE INSERT ON `bike`
FOR EACH ROW
BEGIN
    IF NEW.battery <= 20 THEN
        SET NEW.status = 1;
    ELSE
        SET NEW.status = 0;
    END IF;
END;;
DELIMITER ;