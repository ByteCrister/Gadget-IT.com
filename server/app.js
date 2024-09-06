require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');

app.use(session({
    secret: process.env.Session_secret,
    resave: false,
    saveUninitialized: true
}));

/*----------------------Initialize session variables---------------------*/
app.use((req, res, next) => {
    req.session.isAdmin = req.session.isAdmin || false;
    req.session.isLogged = req.session.isLogged || false;
    req.session.userId = req.session.userId || false;
    req.session.save();

    next();
});


/************** required environment setup *****************/
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 
app.use(express.json({ limit: '10mb' })); 
app.use(cors());
app.use(express.static('public'));
app.use(passport.initialize());
require('./config/passport');




/****************** All Routes *****************/
app.use(require('./routes/users.router'));
app.use(require('./routes/users.home.contents'));

app.use(require('./routes/products.router'));
app.use(require('./routes/product.post.router'));

app.use(require('./routes/product.inventory.router'));
app.use(require('./routes/product.production.router'));
app.use(require('./routes/product.setting.router'));
/*---------------------------------------------*/


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