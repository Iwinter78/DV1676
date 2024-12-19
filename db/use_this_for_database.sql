--executea den -> mariadb --table < use_this_for_database.sql
CREATE DATABASE IF NOT EXISTS magicbike;

USE magicbike;

SOURCE ddl.sql;
SOURCE insert.sql;
SOURCE insert_bike_city_station.sql;