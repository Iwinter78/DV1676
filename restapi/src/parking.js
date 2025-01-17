import { connect } from "./connect.js";

/**
 * Gets all the parking zones from the database
 * @returns {Array} - An array containing all parking zones
 */
async function allParking() {
  const db = await connect();
  const query = `SELECT * FROM parking_zones;`;
  const response = await db.query(query);
  db.end();
  return response[0];
}

export { allParking };
