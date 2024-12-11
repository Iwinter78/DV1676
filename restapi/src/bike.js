import { connect } from './connect.js';

const db = await connect();

async function createBike(gps, city) {
    const query = 'CALL create_bike(?, ?)';
    const values = [gps, city];
    db.query(query, values);
    db.end();
}

async function getAllBikesPosition() {
    const query = 'CALL get_all_bikes_position()';
    const response = await db.query(query);
    db.end();
    return response[0];
}

async function updateBikePosition(id, gps) {
    const query = 'CALL update_bike_position(?, ?)';
    const values = [id, gps];
    db.query(query, values);
    db.end();
}

export { 
    createBike,
    getAllBikesPosition,
    updateBikePosition
};
