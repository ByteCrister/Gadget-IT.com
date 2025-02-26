const mysql = require('mysql2');
require('dotenv').config();

function connectDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        // port: process.env.PORT,
        connectTimeout: 100000
    });
    connection.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err);
            setTimeout(connectDatabase, 5000);
        } else {
            console.log('Connected to MySQL database.');
        }
    });

    connection.on('error', err => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Attempting to reconnect...');
            connectDatabase();
        } else {
            throw err;
        }
    });

    return connection;

};

const db = connectDatabase();

module.exports = db;