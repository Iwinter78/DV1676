import { connect } from './connect.js';

/**
 * Creates a bike and stores it in the database
 * @param {String} gps - Gps coordinates for the bike 
 * @param {String} city - The city where the bike is located
 */
async function createBike(gps, city) {
    const db = await connect();
    const query = 'CALL create_bike(?, ?)';
    const values = [gps, city];
    db.query(query, values);
    db.end();
}
/**
 * Retrives all the bikes and their positions
 * @returns {Array} - An array containing all bikes and their positions
 */
async function getAllBikesPosition() {
    const db = await connect();
    const query = 'CALL get_all_bike_positions()';
    const response = await db.query(query);
    db.end();
    const bikes = response[0][0].map(bike => ({
        gps: bike.gps
    }));
    
    return bikes;
}

/**
 * Updates the bikes position
 * @param {String} id - The id of the bike
 * @param {String} gps - The gps coordinates of the bike
 */
async function updateBikePosition(id, gps) {
    const db = await connect();
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
