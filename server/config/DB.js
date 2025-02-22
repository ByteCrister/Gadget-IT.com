const mysql = require('mysql2');
require('dotenv').config();

// const db = mysql.createConnection({
//     host: process.env.DB_host,
//     user: process.env.DB_user,
//     password: process.env.DB_password,
//     database: process.env.DB,
//     port: process.env.PORT,
//     connectTimeout: 10000
// });
const db = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: `freedb_shakib's db`,
    password: '!aMy7wGuU8*V3A?',
    database: 'freedb_gadget_it',
    port: 3306,
    connectTimeout: 10000
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});
module.exports = db;

