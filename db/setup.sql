--executea den -> mariadb --table < use_this_for_database.sql
DROP DATABASE IF EXISTS magicbike;
CREATE DATABASE IF NOT EXISTS magicbike;

USE magicbike;

SOURCE ddl.sql
SOURCE user_procedures.sql
SOURCE bike_procedures.sql
SOURCE insert.sql
SOURCE insert_bike_city_station.sql;