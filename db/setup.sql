DROP DATABASE IF EXISTS magicbike;
CREATE DATABASE IF NOT EXISTS magicbike;
USE magicbike;

SOURCE parking_zone_procedures.sql;
SOURCE schema.sql;
SOURCE ddl.sql;
SOURCE user_procedures.sql;
SOURCE bike_procedures.sql;
SOURCE station_procedures.sql;
SOURCE log_procedures.sql
SOURCE insert.sql
SOURCE insert_bike_city_station.sql
SOURCE insert_bike.sql
SOURCE bike_triggers.sql



