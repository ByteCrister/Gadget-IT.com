// DB.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Optional: test connection
pool.getConnection((err, conn) => {
    if (err) {
        console.error("DB connection failed:", err.message);
    } else {
        console.log("Connected to MySQL (pool)");
        conn.release();
    }
});

module.exports = pool;