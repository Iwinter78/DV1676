import mysql from 'mysql';

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