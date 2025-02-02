-- user procedures

DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS get_user;
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS get_user_log;
DROP PROCEDURE IF EXISTS update_user_balance;
DROP PROCEDURE IF EXISTS get_all_users;
DROP PROCEDURE IF EXISTS get_user_role;

DELIMITER ;;
CREATE PROCEDURE create_user(
    IN in_email VARCHAR(255),
    IN in_username VARCHAR(255)
)
BEGIN
    INSERT INTO users (email, username, balance, debt, role)
    VALUES (in_email, in_username, 0.00, 0.00, 'user');
END;;

CREATE PROCEDURE get_user(IN username_param VARCHAR(255))
BEGIN
    SELECT * FROM users WHERE username = username_param;
END;;

CREATE PROCEDURE delete_user(IN username_param VARCHAR(255))
BEGIN
    DELETE FROM users WHERE username = username_param;
END;;

CREATE PROCEDURE get_user_balance(IN userid_param INT)
BEGIN
    SELECT balance FROM users WHERE id = userid_param;
END;;

CREATE PROCEDURE get_user_log(IN username_param VARCHAR(255))
BEGIN
    SELECT u.id AS user_id, u.username, ul.log_time, ul.log_data
    FROM users u
    JOIN user_log ul ON u.id = ul.id
    WHERE u.username = username_param;
END;;

CREATE PROCEDURE update_user_balance(
    IN in_username VARCHAR(255),
    IN in_balance DECIMAL(10,2)
)
BEGIN
    UPDATE users
    SET balance = balance + in_balance
    WHERE username = in_username;
END;;

CREATE PROCEDURE get_all_users()
BEGIN
    SELECT * FROM users;
END;;

CREATE PROCEDURE get_user_role(IN username_param VARCHAR(255))
BEGIN
    SELECT role FROM users
    where username = username_param;
END;;

CREATE PROCEDURE edit_user(
    IN in_username VARCHAR(255),
    IN in_balance DECIMAL(10,2),
    IN in_debt DECIMAL(10,2)
)
BEGIN
    UPDATE users
    SET balance = in_balance,
        debt = in_debt
    WHERE username = in_username;
END;;

CREATE PROCEDURE pay_trip(IN IN_trip_id INT)
BEGIN
    DECLARE userId INT;
    DECLARE tripCost DECIMAL(10,2);

    SELECT total_price, user_id INTO tripCost, userId
    FROM trips
    WHERE trip_id = IN_trip_id;

    UPDATE users
    SET balance = balance - tripCost
    WHERE id = userId;

    UPDATE bank
    SET cashisking = cashisking + tripCost;
END;;

CREATE PROCEDURE get_trip_details_user(IN IN_userid INT)
BEGIN
    SELECT trip_id, bike_id, start_time, end_time, total_price
    FROM trips
    WHERE user_id = IN_userid;
END;;



DELIMITER ;