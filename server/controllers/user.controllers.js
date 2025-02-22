const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const secretKey = process.env.JWT_SECRET_KEY;
const { SendUserMail } = require('../config/send.mail.controller.js');
const productOuterModel = require('../models/product.outer.model.js');
const { SendOrderConfirmationMail } = require('../config/send.order.confirmation.email.js');
const adminDashboardController = require('./admin.dashboard.controller.js');
const performQuery = require('../config/performQuery.js');
const saltRounds = 10;
;

module.exports = {

    UserHomeViewController: (req, res) => {
        console.log('User homeView get - isAdmin: ' + req.session.isAdmin + ', is logIn:  ' + req.session.isLogged + ', User ID:  ' + req.session.userId);
        res.json({ isAdmin: req.session.isAdmin, isLogged: req.session.isLogged, userId: req.session.userId });
    },

    // * -------------------------------------------- start of new user register -------------------------------------------- *
    userPostRegistrationController: async (req, res) => {
        const { firstName, lastName, email, password, currentRoute } = req.body;

        try {
            //* Check if email already exists
            const EmailExistResult = await new Promise((resolve, reject) => {
                userModel.userEmailExistModel(email, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });

            if (EmailExistResult && EmailExistResult.length > 0) {
                //* Email already exists in the database
                console.log('Email exists - ' + EmailExistResult.length);
                return res.json({ message: 'Email already exists' });
            }

            //* Hash the password
            const hash = await bcrypt.hash(password, saltRounds);

            //* Generate JWT token with expiration of 5 minutes
            const token = jwt.sign(
                {
                    firstName,
                    lastName,
                    email,
                    password: hash,
                    route: currentRoute
                },
                secretKey,
                { expiresIn: '5m' }
            );

            //* Generate confirmation link with token
            const confirmationLink = `${process.env.BACKED_URL}/new/user/confirm?token=${token}`;

            //* Send confirmation email
            const emailSent = await SendUserMail(email, 'Email Confirmation', confirmationLink);

            //* Log whether the email was sent successfully
            console.log('Is email sent? ' + emailSent);

            if (emailSent) {
                //* Email sent successfully
                return res.status(200).json({ message: 'Email Confirmation Sent' });
            } else {
                //* Failed to send email
                return res.status(500).json({ message: 'Failed to send email confirmation' });
            }
        } catch (error) {
            //* Log and handle any errors during registration
            console.error('Error in user registration:', error);
            return res.status(500).json({ message: 'Error in user registration', error: error.message });
        }
    },
    newUserRegistrationController: async (req, res) => {
        const { token } = req.query;

        try {
            //* Verify the JWT token
            const decoded = jwt.verify(token, secretKey);

            //* Extract data from the token
            const { firstName, lastName, email, password, route } = decoded;
            console.log('Decoded token:', decoded);

            const EmailExistResult = await new Promise((resolve, reject) => {
                userModel.userEmailExistModel(email, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });

            if (EmailExistResult && EmailExistResult.length > 0) {
                //* Email already exists in the database
                console.log('Email exists - ' + EmailExistResult.length);
                return res.status(400).send(`<d style="display: flex; justify-content: center; align-items: center; height:100vh">
                    <h2>You have already an account!! Try with another one.</h2>
                    </div>`);
            }


            //* Insert new user into the database
            const results = await new Promise((resolve, reject) => {
                userModel.newUserEntryModel({ first_name: firstName, last_name: lastName, email, password }, (err, results) => {
                    if (err) {
                        console.error('Error saving user:', err);
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            //* Insert new admin notification
            const payload = {
                type: 'New User Signed in',
                sender_type: 'User',
                page: 6
            };

            //* incrementing number of users
            const incrementUser = {
                column: 'total_customers',
                operator: '+',
                value: 1
            };
            await performQuery(adminDashboardController.changeStaticValues, incrementUser.column, incrementUser.operator, incrementUser.value);
            await performQuery(userModel.setNewAdminNotification, payload);
            await performQuery(productOuterModel.insertNewUserCountQuery, results.insertId);
            console.log('New user registered with id:', results.insertId);

            //* Redirect the user to the home route
            return res.redirect(process.env.process.env.FRONTEND_URL);

        } catch (error) {
            //* Handle token expiration or invalid token errors
            if (error.name === 'TokenExpiredError') {
                return res.status(400).send(`<d style="display: flex; justify-content: center; align-items: center; height:100vh">
                    <h1>Confirmation link expired!!</h1>
                    </div>`);
            } else {
                console.error('Error in newUserRegistrationController:', error);
                return res.status(400).json({ message: 'Invalid or malformed token. Please try again later' });
            }
        }
    },
    //* ------------------------------------------ end of new user register ----------------------------------------- *

    // * ---------------------------------------- user/admin log in starts ------------------------------------ *
    userLogInController: async (req, res) => {
        const { email, password, path } = req.body;
        console.log('Login request received: ', email);

        try {
            //* Check if the email belongs to an admin
            const adminEmailResult = await new Promise((resolve, reject) => {
                userModel.adminEmailMatch(email, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });

            if (adminEmailResult && adminEmailResult.length > 0) {
                //* Admin email found, now check the password
                const adminPassResult = await new Promise((resolve, reject) => {
                    userModel.adminPassMatch(email, (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    });
                });

                const isPasswordMatch = bcrypt.compareSync(password, adminPassResult[0].admin_password);
                if (isPasswordMatch) {
                    //* Admin login successful
                    return res.status(200).json({ isAdmin: true, isLogged: true, token: process.env.ADMIN_TOKEN });
                } else {
                    console.log('Invalid admin password');
                    return res.json({ message: 'Invalid admin password' });
                }
            }

            //* If not an admin, check if the email belongs to a user
            const userEmailResult = await new Promise((resolve, reject) => {
                userModel.userEmailMatchOrNotModel(email, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });

            if (userEmailResult.length === 0) {
                //* User email not found
                return res.json({ message: 'User email not found' });
            }

            //* Check the user password
            const userPassResult = await new Promise((resolve, reject) => {
                userModel.userPassMatchModal(email, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });

            if (!userPassResult || userPassResult.length === 0) {
                return res.json({ message: 'User password not found' });
            }

            const isUserPasswordMatch = bcrypt.compareSync(password, userPassResult[0].password);
            if (isUserPasswordMatch) {
                //* User login successful

                const payload = {
                    user_id: userPassResult[0].user_id,
                    email: userPassResult[0].email
                };

                const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
                return res.json({ isAdmin: false, isLogged: true, token: 'Bearer ' + token });
            } else {
                return res.json({ message: 'Invalid user password' });
            }

        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    // * --------------------------------------- end of user/admin log in ----------------------------------------------- *

    // * -------------------------------------- reset password ------------------------------------ *
    UserForgotPasswordController: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await new Promise((resolve, reject) => {
                userModel.userEmailExistModel(email, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });

            if (user && user.length === 0) {
                return res.status(200).json({ message: 'Email not found' });
            }

            const hash = await bcrypt.hash(password, saltRounds);

            //* Generate JWT token with expiration of 5 minutes
            const token = jwt.sign({ email, password: hash }, secretKey, { expiresIn: '5m' });

            const confirmationLink = `${process.env.BACKEND_URL}/user/new/pass/confirm?token=${token}`;
            const emailSent = await SendUserMail(email, 'Forgot Password', confirmationLink);

            console.log(`Is email send : ` + emailSent);
            if (emailSent) {
                return res.status(200).json({ message: 'Email Send' });
            } else {
                return res.status(500).json({ message: 'Error sending email' });
            }
        } catch (error) {
            console.error('Error in user password change:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    UserNewPass: async (req, res) => {
        try {
            const { token } = req.query;

            //* Verify and decode the token
            const decoded = jwt.verify(token, secretKey);
            const { email, password } = decoded;

            const updated = await new Promise((resolve, reject) => {
                userModel.userNewPasswordModel(email, password, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                });
            });
            if (updated) {
                console.log('Password updated for:', email);
                return res.redirect(process.env.FRONTEND_URL);
            } else {
                throw new Error('Failed to update password');
            }
        } catch (error) {
            console.error('Error in user set new password:', error);
            return res.status(500).json({ message: 'Failed to set new password', error: error.message });
        }
    },
    // * -------------------------------------- end of reset password -------------------------------------------- *

    SetNewAdminPasswordEmailController: async (req, res) => {
        const password = await bcrypt.hash(req.body.password, saltRounds);
        const email = req.body.email
        try {
            await new Promise((resolve, reject) => {
                userModel.setNewAdminPasswordEmailModel(email, password, (err, data) => {
                    if (err) return reject(err)
                    return resolve(data)
                });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'error on setting admin new email and password. -> ' + error })
        }
    },
    getUserEmail: (req, res, next) => {
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
            return res.status(200).json({
                success: true,
                email: user.email,
                user
            });
        })(req, res, next);
    },

    // * ----------------------------------------- user order confirmation digits ---------------------------------------
    orderEmailConfirmation: async (req, res, next) => {
        const { email, digits } = req.body;
        try {
            passport.authenticate('jwt', { session: false }, async (err, user, info) => {
                if (err) {
                    return res.status(500).json({ message: 'An error occurred during authentication' });
                }

                if (!user) {
                    if (info && info.name === 'JsonWebTokenError') {
                        return res.status(401).json({ success: false, message: 'Invalid token. Authentication failed.' });
                    } else {
                        return res.status(401).json({ success: false, message: 'Unauthorized. Token is missing or invalid.' });
                    }
                }

                //* Send confirmation email
                const emailSent = await SendOrderConfirmationMail(email, 'Email Confirmation', digits);
                console.log('Email send ? ' + emailSent);
                if (emailSent) {
                    //* Email sent successfully
                    return res.status(200).json({ success: true, message: 'Email Confirmation Sent' });
                } else {
                    //* Failed to send email
                    return res.status(200).json({ success: false, message: 'Failed to send email confirmation' });
                }

            })(req, res, next);
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
};