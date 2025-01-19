import { connect } from "./connect.js";

/**
 * Creates a bike and stores it in the database
 * @param {String} gps - Gps coordinates for the bike
 * @param {String} city - The city where the bike is located
 */
async function createBike(gps, city) {
  const db = await connect();
  const query = `INSERT INTO bike (gps, city)
    VALUES (?, ?);`;
  const values = [gps, city];
  db.query(query, values);
  db.end();
}
/**
 * Retrives all the bikes and their positions
 * @returns {Array} - An array containing all bikes and their positions
 */
async function getAllBikes() {
  const db = await connect();
  const query = `SELECT * FROM bike;`;
  const response = await db.query(query);
  db.end();
  return response[0].slice(0, -1);
}

/**
 * Updates the bikes position
 * @param {String} id - The id of the bike
 * @param {String} gps - The gps coordinates of the bike
 */
async function updateBikePosition(id, gps) {
  const db = await connect();
  const query = `UPDATE bike
    SET gps = ?
    WHERE id = ?;`;
  const values = [gps, id];
  db.query(query, values);
  db.end();
}

/**
 * Books a bike for a user
 * @param {String} id - Id of the bike
 * @param {String} username - Name of the user who is booking the bike
 */
async function bookBike(id, bikeId) {
  const db = await connect();
  const query = `UPDATE bike
    set bike_status = false, currentuser = ?
    WHERE id = ?;`;
  const values = [id, bikeId];
  db.query(query, values);
  db.end();
}

/**
 * Retrives infomartion about the bike based on id
 * @param {Number} id - The id of the bike
 * @returns {Array} - An array containing the bike information
 */
async function getBike(id) {
  const db = await connect();
  const query = `SELECT * FROM bike WHERE id = ?;`;
  const values = [id];
  const response = await db.query(query, values);
  db.end();
  return response[0];
}

/**
 * Returns a bike that has been booked
 * @param {Number} id - Id of the bike
 */
async function returnBike(id) {
  const db = await connect();
  const query = `UPDATE bike
    set bike_status = true, currentuser = null
    WHERE id = ?;`;
  const values = [id];
  db.query(query, values);
  db.end();
}

export {
  createBike,
  getAllBikes,
  updateBikePosition,
  bookBike,
  getBike,
  returnBike,
};
