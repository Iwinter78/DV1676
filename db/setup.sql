DROP DATABASE IF EXISTS magicbike;
CREATE DATABASE IF NOT EXISTS magicbike;
USE magicbike;

SOURCE schema.sql;
SOURCE ddl.sql;
SOURCE insert.sql
SOURCE user_procedures.sql;
SOURCE parking_zone_procedures.sql;
SOURCE bike_procedures.sql;
SOURCE station_procedures.sql;
--SOURCE bike_triggers.sql
SOURCE insert_bike_city_station.sql
SOURCE bike_triggers.sql
SOURCE insert_bike.sql


