const mysql = require('mysql2');
require('dotenv').config();

let connection;

function connectDatabase() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        port: process.env.DB_PORT || 3306,
        connectTimeout: 10000 // 10 seconds
    });

    connection.connect(err => {
        if (err) {
            console.error('Database connection failed:', err.message);
            // Retry after 5 seconds if connection fails
            setTimeout(connectDatabase, 5000);
        } else {
            console.log('Connected to MySQL database.');
        }
    });

    connection.on('error', err => {
        console.error('Database error:', err.message);
        // Auto-reconnect if connection is lost
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting to database...');
            connectDatabase();
        } else {
            throw err;
        }
    });
}

connectDatabase();

module.exports = connection;