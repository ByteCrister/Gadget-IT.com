require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userCrudModel = require('../models/user.crud.model');
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    PostUserQuestion: async (req, res, next) => {
        const { product_id, question, email } = req.body;
        try {
            passport.authenticate('jwt', { session: false }, (err, user, info) => {
                if (err) {
                    return res.status(500).json({ message: 'An error occurred during authentication' });
                }

                if (!user) {
                    if (info && info.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
                    } else if (info && info.name === 'JsonWebTokenError') {
                        return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
                    } else {
                        return res.status(401).json({ message: 'Unauthorized. Token is missing or invalid.' });
                    }
                }
                new Promise((resolve, reject) => {
                    userCrudModel.InsertUserQuestion(user.user_id, product_id, email, question, (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    });
                });
                return res.status(200).json({ success: true });
            })(req, res, next);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    PostUserRating: async (req, res, next) => {
        const { product_id, rating, UserReview } = req.body;
        try {
            passport.authenticate('jwt', { session: false }, (err, user, info) => {
                if (err) {
                    return res.status(500).json({ message: 'An error occurred during authentication' });
                }

                if (!user) {
                    if (info && info.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
                    } else if (info && info.name === 'JsonWebTokenError') {
                        return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
                    } else {
                        return res.status(401).json({ message: 'Unauthorized. Token is missing or invalid.' });
                    }
                }
                new Promise((resolve, reject) => {
                    userCrudModel.InsertUserRating(user.user_id, product_id, user.email, rating, UserReview, (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    });
                });
                return res.status(200).json({ success: true });
            })(req, res, next);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}