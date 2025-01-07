import { connect } from "./connect";

async function allParking() {
    const db = await connect();
    const query = "CALL get_all_parking()";
    const response = await db.query(query);
    db.end();
    return response[0];
}

export { allParking };