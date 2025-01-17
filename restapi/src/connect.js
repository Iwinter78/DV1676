import mysqlPromise from "mysql2/promise";

/**
 * Creates a connection to the database
 * @returns {Promise<mysql.Connection>}
 */
export async function connect() {
  const connect = mysqlPromise.createConnection({
    host: "database",
    port: 3306,
    user: "admin",
    password: "123123",
    database: "magicbike",
    multipleStatements: true,
    charset: "utf8mb4"
  });

  return Promise.resolve(connect);
}
