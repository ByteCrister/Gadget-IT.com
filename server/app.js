const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const app = express();


/************ session variable setup *************/
app.use(session({
    secret: process.env.Session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
/*----------------------Initialize session variables---------------------*/
app.use((req, res, next) => {

    if (!req.session.userId) {
        req.session.userId = false;
    }
    if (!req.session.isLogged) {
        req.session.isLogged = false;
    }
    if (!req.session.isAdmin) {
        req.session.isAdmin = false;
    }

    next();
});


/************** required environment setup *****************/
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));



app.use(require('./routes/products.router'));


/*************** Route Related Error Handling *************/
app.use((request, response, next)=>{
    response.status(404).send('<h1>Invalid Url 404 !</h1>');
    next();
})
app.use((error, request, response, next) => {
    console.error(error); 
    response.status(500).send('<h1>Server is broken</h1>');
    next();
});


module.exports = app;