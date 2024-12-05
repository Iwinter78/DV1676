import { connect } from './connect.js';

async function createUser(username, email) {
    const db = await connect();
    const query = `CALL create_user(?, ?)`;
    const values = [username, email];
    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            db.end();
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
}


export { createUser };