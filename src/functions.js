
import { connect } from "./restapi/src/connect.js";

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
    let userLogs = `CALL show_user_log();`;
    let bikeLogs = `CALL show_bike_log();`;
    let stationLogs = `CALL show_station_log();`;
    let bankLogs = `CALL show_bank_log();`;

    try {
        await db.query(userLogs);
        await db.query(bikeLogs);
        await db.query(stationLogs);
        await db.query(bankLogs);
    } catch (error) {
        console.error("Error executing queries:", error);
        throw error;
    }
}
