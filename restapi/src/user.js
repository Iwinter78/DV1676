'use strict';
import { connect } from './connect.js';

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

/**
 * Retrives a user from the database
 * @param {String} email - The email of the user
 * @returns {Promise<mysql.RowDataPacket[]>} - Returns a promise with the infomation of the user
 */
async function getUser(email) {
    const db = await connect();
    const query = `CALL get_user(?)`;
    const values = [email];
    const result = await db.query(query, values);
    db.end();
    return result;
}




export { 
    createUser,
    getUser
};