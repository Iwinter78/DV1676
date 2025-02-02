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
  const db = await connect();
  const query = `CALL get_user_log(?)`;
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

async function getUserBalance(userid) {
  try {
    const db = await connect();
    const query = `CALL get_user_balance(?)`;
    const value = [userid];
    const [rows] = await db.query(query, value);

    if (rows && rows[0] && rows[0][0]) {
      const balance = rows[0][0].balance;
      return parseFloat(balance);
    } else {
      console.log("No balance found for this user.");
      return 0;
    }
  } catch (error) {
    console.error("Error in getUserBalance:", error.message);
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

async function editUser(username, balance, debt) {
  const db = await connect();
  const query = `CALL edit_user(?, ?, ?)`;
  const values = [username, balance, debt];
  const response = await db.query(query, values);
  db.end();
  return response[0];
}

async function payTrip(tripId) {
  const db = await connect();
  const query = `CALL pay_trip(?)`;
  const value = [tripId];
  await db.query(query, value);
  db.end();
  return;
}

async function getTripDetailsForUser(userId) {
  const db = await connect();
  const query = `CALL get_trip_details_user(?)`;
  const value = [userId];
  const [rows] = await db.query(query, value);
  db.end();

  return rows[0];
}

export {
  createUser,
  getUser,
  deleteUser,
  getUserLog,
  updateUserBalance,
  getAllUsers,
  editUser,
  payTrip,
  getUserBalance,
  getTripDetailsForUser,
};
