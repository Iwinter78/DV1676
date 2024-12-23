-- user procedures

DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS get_user;
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS get_user_log;
DROP PROCEDURE IF EXISTS update_user_balance;
DROP PROCEDURE IF EXISTS get_all_users;

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
DELIMITER ;