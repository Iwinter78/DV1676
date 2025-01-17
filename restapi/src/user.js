import { connect } from "./connect.js";

/**
 * Creates a new user and stores it in the database
 * @param {String} username - The username of the user
 * @param {String} email - The email of the user
 */
async function createUser(username, email) {
  const db = await connect();
  const query = `INSERT INTO users (email, username, balance, debt, role)
    VALUES (?, ?, 0.00, 0.00, 'user');`;
  const values = [email, username];
  await db.query(query, values);
  db.end();
}

async function getUser(username) {
  const db = await connect();
  const query = `SELECT * FROM users WHERE username = ?;`;
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
  const query = `SELECT * FROM users;`;
  const [rows] = await db.query(query);
  return rows;
}

async function getUserLog(username) {
  const db = await connect();
  const query = `BEGIN
    SELECT u.id AS user_id, u.username, ul.log_time, ul.log_data
    FROM users u
    JOIN user_log ul ON u.id = ul.id
    WHERE u.username = ?;`;
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
  const query = `DELETE FROM users WHERE username = username_param;`;
  const values = [username];
  await db.query(query, values);
  db.end();
}

async function updateUserBalance(username, balance) {
  const db = await connect();
  const query = `UPDATE users
    SET balance = balance + in_balance
    WHERE username = in_username;`;
  const values = [username, balance];
  try {
    await db.query(query, values);
    db.end();
  } catch (error) {
    db.end();
    throw error;
  }
}

export {
  createUser,
  getUser,
  deleteUser,
  getUserLog,
  updateUserBalance,
  getAllUsers,
};
