const express = require('express');
const session = require('express-session');
const db = require('./models/DB');
const MySQLStore = require('express-mysql-session')(session);

const cors = require('cors');
require('dotenv').config();



const sessionStore = new MySQLStore({
    expiration: 86400000,
    endConnectionOnClose: false,
    clearExpired: true,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

const app = express();

app.use(session({
    key: 'session_cookie_name',
    secret: process.env.Session_secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        sameSite: 'strict',
        secure: true,
    }
}));

/*----------------------Initialize session variables---------------------*/
app.use((req, res, next) => {
    req.session.isAdmin = req.session.isAdmin || false;
    req.session.isLogged = req.session.isLogged || false;
    req.session.userId = req.session.userId || false;
    req.session.save();

    next();
});
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    next();
});


/************** required environment setup *****************/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));



app.use(require('./routes/users.router'));
app.use(require('./routes/products.router'));


/*************** Route Related Error Handling *************/
app.use((request, response, next) => {
    response.status(404).send('<h1>Invalid Url 404 !</h1>');
    next();
})
app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).send('<h1>Server is broken</h1>');
    next();
});


module.exports = app;