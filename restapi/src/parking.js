import { connect } from "./connect.js";

async function allParking() {
  const db = await connect();
  const query = "CALL get_all_parking_zones()";
  const response = await db.query(query);
  db.end();
  return response[0];
}

async function updateAmountOfBikes(id, amount) {
  const db = await connect();
  const query = "CALL update_amount_of_bikes(?, ?)";
  const response = await db.query(query, [id, amount]);
  db.end();
  return response[0];
}

export { allParking, updateAmountOfBikes };
