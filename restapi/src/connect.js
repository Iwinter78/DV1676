import mysql from 'mysql';

/**
 * Creates a connection to the database
 * @returns {Promise<mysql.Connection>}
 */
export async function connect() {
    const connect = mysql.createConnection({
        host: 'database-dev',
        port: 3306,
        user: 'admin',
        password: '123123',
        database: 'magicbike',
    });

    return Promise.resolve(connect);
}