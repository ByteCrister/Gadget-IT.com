require('dotenv').config();
const db = require('../models/DB');

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    db.query('SELECT * FROM user WHERE user_id = ?', [jwt_payload.user_id], (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user && user.length > 0) {
            return done(null, user[0]);
        } else {
            return done(null, false);
        }
    });
}));