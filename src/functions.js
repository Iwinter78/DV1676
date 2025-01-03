
import { connect } from "../restapi/src/connect.js";

let db;

(async function initializeDatabase() {
    try {
        db = await connect();

        process.on("exit", () => {
            if (db) {
                db.end();
            }
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
})();

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
export {showLogs}
