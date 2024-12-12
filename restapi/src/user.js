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

/**
 * Functions fetches the user infomartion from the database based on the email
 * @param {String} email - The email of the user
 * @returns {Array} - An array containing the user information
 */
async function getUser(email) {
    const db = await connect();
    const query = `CALL get_user(?)`;
    const values = [email];
    const response = await new Promise((resolve, reject) => { //Varför är jag tvungen att skapa ett nytt promise?????
        db.query(query, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

    db.end();
    return response[0];
}
/**
 * Delates a user from the database
 * @param {String} email - The email of the user
 */
async function deleteUser(email) {
    const db = await connect();
    const query = `CALL delete_user(?)`;
    const values = [email];
    await db.query(query, values);
    db.end();
}

export { 
    createUser,
    getUser,
    deleteUser
};
