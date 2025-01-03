import { connect } from "../restapi/src/connect.js";

async function getUSerBalance(username) {
  const db = await connect();
  let sql = `SELECT balance FROM users WHERE username = ?;`;
  let res;

  [res] = await db.query(sql, [username]);

  console.table(res);
  return { balance: res[0].balance };
}

async function showLogs() {
    let userLogs = `CALL show_user_logs();`;
    let bikeLogs = `CALL show_bike_logs();`;
    let stationLogs = `CALL show_station_logs();`;
    let bankLogs = `CALL show_bank_logs();`;

    try {
        userLogs = await db.query(userLogs);
        bikeLogs = await db.query(bikeLogs);
        stationLogs = await db.query(stationLogs);
        bankLogs = await db.query(bankLogs);

        let data = [userLogs, bikeLogs, stationLogs, bankLogs]
        return data

    } catch (error) {
        console.error("Error executing queries:", error);
        throw error;
    }
}
export { getUSerBalance, showLogs }
