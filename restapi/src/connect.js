import mysql from 'mysql';
import process from 'process';

export async function connect() {
    const connect = mysql.createConnection({
        host: 'database',
        port: 3307,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    return Promise.resolve(connect);
}