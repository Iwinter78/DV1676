import { connect } from "./connect.js";

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

async function getAllUsers() {
  const db = await connect();
  const query = `call get_all_users()`;
  const [rows] = await db.query(query);
  return rows;
}

async function getUserLog(username) {
  let db;
  try {
    db = await connect();
    const query = `CALL get_user_log(?)`;
    const values = [username];
    const [rows] = await db.query(query, values);
    return rows;
  } catch (error) {
    console.error("Error fetching user log:", error);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

async function deleteUser(username) {
  const db = await connect();
  const query = `CALL delete_user(?)`;
  const values = [username];
  await db.query(query, values);
  db.end();
}

async function updateUserBalance(username, balance) {
  const db = await connect();
  const query = `CALL update_user_balance(?, ?)`;
  const values = [username, balance];
  try {
    await db.query(query, values);
    db.end();
  } catch (error) {
    db.end();
    throw error;
  }
}

export { createUser, getUser, deleteUser, getUserLog, updateUserBalance, getAllUsers };
