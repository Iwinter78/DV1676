import { connect } from './connect.js';
import mysql from 'mysql';

/**
 * Creates a new user and stores it in the database
 * @param {String} username - The username of the user
 * @param {String} email - The email of the user 
 */
async function createUser(username, email) {
    const db = await connect();
    const query = `CALL create_user(?, ?)`;
    const values = [username, email];
    await db.query(query, values);
    db.end();
}

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
    return response;
}

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
