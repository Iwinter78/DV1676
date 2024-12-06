import { connect } from './connect.js';

async function createUser(username, email) {
    const db = await connect();
    const query = `CALL create_user(?, ?)`;
    const values = [username, email];
    await db.query(query, values);
    db.end();
}


export { createUser };