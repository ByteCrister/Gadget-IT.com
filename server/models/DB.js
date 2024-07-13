const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 500,
    queueLimit: 1000
});

module.exports = db;

