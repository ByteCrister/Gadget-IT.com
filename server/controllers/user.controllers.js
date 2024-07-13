const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
require('dotenv').config();
const { SendUserMail } = require('./send.mail.controller.js');
const saltRounds = 10;

module.exports = {

    UserHomeViewController: (req, res) => {
        console.log('User homeView get - isAdmin: ' + req.session.isAdmin + ', is logIn:  ' + req.session.isLogged + ', User ID:  ' + req.session.userId);
        res.json({ isAdmin: req.session.isAdmin, isLogged: req.session.isLogged, userId: req.session.userId });
    },

    userPostRegistrationController: async (req, res) => {
        const { firstName, lastName, email, password, currentRoute } = req.body;

        try {

            userModel.userEmailExistModel(email, async (emailExistError, EmailExistResult) => {


                if (emailExistError) {
                    console.log(emailExistError);

                } else if (EmailExistResult && EmailExistResult.length > 0) {
                    console.log('Email exist - ' + EmailExistResult.length);
                    return res.json({ message: 'Email already exists' });

                } else {

                    const hash = await bcrypt.hash(password, saltRounds);

                    const confirmationLink = `http://localhost:7000/new/user/confirm?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(hash)}&route=${encodeURIComponent(currentRoute)}`;
                    const emailSent = await SendUserMail(email, 'Email Confirmation', confirmationLink);
                    console.log('Is email send ? ' + emailSent + '\n');

                    if (emailSent) {
                        res.json({ message: 'Email Confirmation Send' });

                    } else {
                        res.json({ message: 'Email not found' });

                    }

                }

            });

        } catch (error) {
            console.error('Error in user registration:', error);
            res.status(500).json({ message: 'Error in user registration', error: error.message });
        }
    },



    newUserRegistrationController: (req, res) => {
        const { first_name, last_name, email, password, route } = req.query;
        console.log('The query - ' + JSON.stringify(req.query, null, 2));

        userModel.newUserEntryModel({ first_name, last_name, email, password }, (err, results) => {
            if (err) {
                return res.status(500).send('Error saving user');
            }
            console.log('User saved:', results);
            req.session.isAdmin = false;
            req.session.isLogged = true;
            req.session.userId = results.insertId
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).send('Error saving session');
                }
                console.log('New user registered id - ' + req.session.userId);
                res.redirect('http://localhost:3000' + route);
            });
        });
    },


    userLogInController: (req, res) => {
        const { email, password } = req.body;

        userModel.adminEmailMatch((adminEmailMatchError, adminEmailResult) => {

            if (adminEmailMatchError) {
                return res.status(500).send('Error finding admin email');

            }
            if (adminEmailResult && adminEmailResult.length > 0) {
                userModel.adminPassMatch((adminPassError, adminPassResult) => {
                    if (adminPassError) {
                        return res.status(500).send('Error finding admin password');
                    }

                    if (bcrypt.compareSync(password, adminPassResult[0].admin_password)) {

                        req.session.isAdmin = true;
                        req.session.isLogged = true;
                        req.session.save((err) => {
                            if (err) {
                                console.error('Error saving session:', err);
                                return res.status(500).send('Error saving session');
                            }
                            console.log('admin logged in');
                            res.json({ isAdmin: true, isLogged: true, userId: false });
                        });
                    }
                });
            } else {

                userModel.userEmailMatchOrNotModel(email, (matchError, matchData) => {
                    if (matchError) {
                        return res.status(500).send('Error finding user email for login');
                    }
                    if (matchData.length === 0) {
                        res.send({ message: 'Email Not Found!' })
                    } else {
                        userModel.userPassMatchModal(email, (errorUserPass, passResult) => {
                            if (errorUserPass) {
                                return res.status(500).send('Error on user password match');
                            }
                            if (bcrypt.compareSync(password, passResult[0].password)) {
                                req.session.isAdmin = false;
                                req.session.isLogged = true;
                                req.session.userId = passResult[0].user_id;
                                console.log('Old user log in - ' + req.session.userId);
                                req.session.save((err) => {
                                    if (err) {
                                        console.error('Error saving session:', err);
                                        return res.status(500).send('Error saving session');
                                    }
                                    console.log('Session Data:', req.session);
                                    res.json({ isAdmin: false, isLogged: true, userId: passResult[0].user_id })
                                });
                            } else {
                                console.log('Pass not matched.');
                                res.send({ message: 'Invalid password' });
                            }
                        })
                    }
                });
            }

        })

    },




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