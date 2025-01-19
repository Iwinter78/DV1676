import { connect } from "./connect.js";

async function AllStations() {
  const db = await connect();
  const query = "CALL get_all_stations()";
  const response = await db.query(query);
  db.end();
  return response[0];
}

async function editChargingSize(stationId, newSize) {
  const db = await connect();
  const query = `CALL edit_charging_size(?,?)`;
  const values = [stationId, newSize];
  const response = await db.query(query, values);
  db.end();
  return response[0];
}

export { AllStations, editChargingSize };
