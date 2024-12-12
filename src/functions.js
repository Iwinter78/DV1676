import { connect } from '../restapi/src/connect.js';


async function getUSerBalance(username) {
    const db = await connect();
    let sql = `SELECT balance FROM users WHERE username = ?;`;
    let res;

    [res] = await db.query(sql,[username]);

    console.table(res);
    return { balance: res[0].balance };
}


export { 
    getUSerBalance,
};