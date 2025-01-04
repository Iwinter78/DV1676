import { connect } from "../restapi/src/connect.js";

async function getUSerBalance(username) {
  const db = await connect();
  let sql = `SELECT balance FROM users WHERE username = ?;`;
  let res;

  [res] = await db.query(sql, [username]);

  console.table(res);
  return { balance: res[0].balance };
}

async function showLogs(type = null) {
    const queries = {
        User: `CALL show_user_logs();`,
        Bike: `CALL show_bike_logs();`,
        Station: `CALL show_station_logs();`,
        Bank: `CALL show_bank_logs();`
    };

    let db = await connect();
    try {
        let data = [];
        console.log(type);

        if (type && queries[type]) {
            const result = await db.query(queries[type]);
            data = result[0][0];
        } else if (type === null){
            for (let key in queries) {
                const result = await db.query(queries[key]);
                data = data.concat(result[0][0]);
            };
        }
        return data

    } catch (error) {
        console.error("Error executing queries:", error);
        throw error;
    }
}
export { getUSerBalance, showLogs }
