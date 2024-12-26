import { connect } from "./connect.js";

async function AllStations() {
  const db = await connect();
  const query = "CALL get_all_stations()";
  const response = await db.query(query);
  db.end();
  return response[0];
}

export { AllStations };
