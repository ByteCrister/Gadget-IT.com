const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const secretKey = process.env.JWT_SECRET_KEY;
const { SendUserMail } = require('./send.mail.controller.js');
const saltRounds = 10;

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
            const confirmationLink = `http://localhost:7000/new/user/confirm?token=${token}`;

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

            console.log('User saved:', results);

            //* Setup session for the user
            req.session.isAdmin = false;
            req.session.isLogged = true;
            req.session.userId = results.insertId;

            //* Save the session
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Error saving session:', err);
                        return reject(err);
                    }
                    resolve();
                });
            });

            console.log('New user registered with id:', req.session.userId);

            //* Redirect the user to the specified route
            return res.redirect('http://localhost:3000');

        } catch (error) {
            //* Handle token expiration or invalid token errors
            if (error.name === 'TokenExpiredError') {
                return res.status(400).send(`<d style="display: flex; justify-content: center; align-items: center; height:100vh">
                    <h1>Confirmation link expired!!</h1>
                    </div>`);
            } else {
                console.error('Error in newUserRegistrationController:', error);
                return res.status(400).json({ message: 'Invalid or malformed token' });
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



    // * -------------------------------------- reset password if forgot ------------------------------------ *
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

            const confirmationLink = `http://localhost:7000/user/new/pass/confirm?token=${token}`;
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

            // Verify and decode the token
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
                return res.redirect('http://localhost:3000');
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
    }

};