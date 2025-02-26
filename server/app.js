const express = require('express');
require('dotenv').config();
require('./config/passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const app = express();

/************** required environment setup *****************/

// Correct CORS setup (only one middleware)
app.use(cors({
    origin: 'https://gadget-it.vercel.app',
    // origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(passport.initialize());


// Log incoming requests for debugging
app.use((req, res, next) => {
    // console.log('Request Origin:', req.headers.origin);
    next();
});

// Explicitly handle preflight requests for better debugging
app.options('*', cors());


/****************** All Routes *****************/
app.use(require('./routes/users.router'));
app.use(require('./routes/users.home.contents'));

app.use(require('./routes/products.router'));
app.use(require('./routes/product.post.router'));

app.use(require('./routes/product.outer.router'));
app.use(require('./routes/admin.dashboard.router'));
app.use(require('./routes/product.inventory.router'));
app.use(require('./routes/product.production.router'));
app.use(require('./routes/product.order.router'));
app.use(require('./routes/product.report.router'));
app.use(require('./routes/product.users.page.router'));
app.use(require('./routes/product.support.router'));
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