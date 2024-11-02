require('dotenv').config();
const passport = require('passport');
const userCrudModel = require('../models/user.crud.model');
const bcrypt = require('bcrypt');

const authenticateUser = (req, res, next, callback) => {
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
        callback(user);
    })(req, res, next);
};


const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    PostUserQuestion: async (req, res, next) => {
        const { product_id, question, email } = req.body;

        try {
            authenticateUser(req, res, next, async (user) => {
                await performQuery(userCrudModel.InsertUserQuestion, user.user_id, product_id, email, question);
                return res.status(200).json({ success: true });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    PostUserRating: async (req, res, next) => {
        const { product_id, rating, UserReview } = req.body;

        try {
            authenticateUser(req, res, next, async (user) => {
                await performQuery(userCrudModel.InsertUserRating, user.user_id, product_id, user.email, rating, UserReview);
                return res.status(200).json({ success: true });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    GetUserInfo: async (req, res, next) => {
        try {
            authenticateUser(req, res, next, async (user) => {
                const address = await performQuery(userCrudModel.getUserAddress, user.user_id);
                return res.status(200).json({ user, address: address[0] });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    UpdatePersonalInfo: async (req, res, next) => {
        try {
            authenticateUser(req, res, next, async (user) => {
                await performQuery(userCrudModel.UpdateUserInfo, req.body, user.user_id);
                return res.status(200).json({ success: true });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    UpdateAddress: async (req, res, next) => {

        try {
            authenticateUser(req, res, next, async (user) => {
                const Address = await performQuery(userCrudModel.getUserAddress, user.user_id);
                await performQuery(Address && Address.length !== 0 ? userCrudModel.updateAddress : userCrudModel.insertAddress, req.body, user.user_id);
                return res.status(200).json({ success: true });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    UpdateUserPassword: async (req, res, next) => {

        try {
            authenticateUser(req, res, next, async (user) => {
                const isPasswordMatch = bcrypt.compareSync(req.body.old_password.value, user.password);
                if (isPasswordMatch) {
                    await performQuery(userCrudModel.UpdatePassword, await bcrypt.hash(req.body.confirm_new_password.value, 10), user.user_id);
                    return res.status(200).json({ success: true });
                }
                return res.status(404).json({ success: false });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    PostPreOrder: async (req, res, next) => {
        const PreOrderState = req.body;
        try {
            authenticateUser(req, res, next, async (user) => {
                await performQuery(userCrudModel.InsertPreOrder, { ...PreOrderState, user_id: user.user_id });
                return res.status(200).json({ success: true });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUserInterfaceReport: async (req, res, next) => {
        try {
            authenticateUser(req, res, next, async (user) => {
                return res.status(200).json({
                    main_report: await performQuery(userCrudModel.getMainReportQuery),
                    sub_report: await performQuery(userCrudModel.getSubReportQuery)
                });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    postNewUserReport: async (req, res, next) => {
        try {
            authenticateUser(req, res, next, async (user) => {
                const reportsStr = req.body.reports.map(report => report.report_name).join(', ');
                await performQuery(userCrudModel.postNewUserReportQuery, user.user_id, reportsStr, req.body.report_description);
                return res.status(200).json({
                    success: true
                });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}