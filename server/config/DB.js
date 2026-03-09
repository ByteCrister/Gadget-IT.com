// DB.js
const mysql = require('mysql2'); // <-- callback-style
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.DB_PORT || 3306,
    connectTimeout: 10000
});

// Connect and handle errors
connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
        // Retry after 5 seconds if connection fails
        setTimeout(() => connection.connect(), 5000);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Handle disconnections
connection.on('error', err => {
    console.error('Database error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting to database...');
        connection.connect();
    } else {
        throw err;
    }
});

module.exports = connection;