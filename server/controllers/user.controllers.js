const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
require('dotenv').config();
const jwt = require('jsonwebtoken');
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
            const EmailExistResult = await userModel.userEmailExistModel(email);

            if (EmailExistResult && EmailExistResult.length > 0) {
                //* Email already exists in the database
                console.log('Email exists - ' + EmailExistResult.length);
                return res.status(409).json({ message: 'Email already exists' });
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
            return res.redirect('http://localhost:3000' + route);

        } catch (error) {
            //* Handle token expiration or invalid token errors
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ message: 'Confirmation link expired' });
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

                if (!adminPassResult || adminPassResult.length === 0) {
                    return res.json({ message: 'Admin password not found' });
                }

                const isPasswordMatch = bcrypt.compareSync(password, adminPassResult[0].admin_password);
                if (isPasswordMatch) {
                    //* Admin login successful
                    await createSession(req, true, null);
                    return res.json({ isAdmin: true, isLogged: true, userId: null, path: path });
                } else {
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
                // await createSession(req, false, userPassResult[0].user_id);
                return res.json({ isAdmin: false, isLogged: true, userId: userPassResult[0].user_id, path: path });
            } else {
                return res.json({ message: 'Invalid user password' });
            }

        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    // * --------------------------------------- end of user/admin log in ----------------------------------------------- *


    UserForgotPasswordController: async (req, res) => {
        const { email, password } = req.body;
        try {
            userModel.userEmailExistModel(email, async (emailExistError, EmailExistResult) => {

                if (emailExistError) {
                    console.log(emailExistError);

                } else if (EmailExistResult && EmailExistResult.length > 0) {

                    const hash = await bcrypt.hash(password, saltRounds);

                    const confirmationLink = `http://localhost:7000/user/new/pass/confirm?email=${encodeURIComponent(email)}&password=${encodeURIComponent(hash)}`;
                    const emailSent = await SendUserMail(email, 'Forgot Password', confirmationLink);
                    console.log('Is email send ? ' + emailSent + '\n');

                    if (emailSent) {
                        res.send({ message: 'Email Send' });
                    } else {
                        res.send({ message: 'Email not found' });
                    }
                } else {
                    res.send({ message: 'Email not found' });
                }

            });

        } catch (error) {
            console.error('Error in user password change:', error);
            res.status(500).json({ message: 'Error in user password change', error: error.message });
        }
    },

    UserNewPass: (req, res) => {
        const { email, password } = req.query;

        userModel.userNewPasswordModel(email, password, (err, result) => {
            if (err) {
                console.log('error in user set new password ' + err);
            }
            console.log('pass updated - ' + email);
            res.redirect('http://localhost:3000');
        })
    },

    SetNewAdminPasswordEmailController: async (req, res) => {
        const password = await bcrypt.hash(req.body.password, saltRounds);
        const email = req.body.email
        userModel.setNewAdminPasswordEmailModel(email, password, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send({ result });
            }
        })

    }

}