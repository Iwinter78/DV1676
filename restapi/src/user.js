import { connect } from './connect.js';

/**
 * Creates a new user and stores it in the database
 * @param {String} username - The username of the user
 * @param {String} email - The email of the user 
 */
async function createUser(username, email) {
    const db = await connect();
    const query = `CALL create_user(?, ?)`;
    const values = [email, username];
    await db.query(query, values);
    db.end();
}

async function getUser(username) {
    const db = await connect();
    const query = `CALL get_user(?)`;
    const values = [username];
    try {
        const [rows] = await db.query(query, values);
        db.end();
        return rows;
    } catch (error) {
        db.end();
        throw error;
    }
}


async function deleteUser(username) {
    const db = await connect();
    const query = `CALL delete_user(?)`;
    const values = [username];
    await db.query(query, values);
    db.end();
}

export { 
    createUser,
    getUser,
    deleteUser
};
