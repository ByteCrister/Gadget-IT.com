require('dotenv').config();
const axios = require('axios');
const passport = require('passport');
const userCrudModel = require('../models/user.crud.model');
const bcrypt = require('bcrypt');
const productOrderModel = require('../models/product.order.model');
const userModel = require('../models/user.model');
const { encryptBankSourceId } = require('../config/auth.crypto');
const adminDashboardModel = require('../models/admin.dashboard.model');
const performQuery = require('../config/performQuery');


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


// Helper function to get the exchange rate
const getExchangeRate = async (apiKey) => {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/BDT`;
    const response = await axios.get(url);
    return response.data.conversion_rates.USD;
};

// Helper function to get the access token from Dwolla
const getAccessToken = async (clientId, clientSecret) => {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const url = 'https://api-sandbox.dwolla.com/token';
    const response = await axios.post(url, new URLSearchParams({ grant_type: 'client_credentials' }), {
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data.access_token;
};

// Helper function to perform the transfer
const performTransfer = async (accessToken, fundingSource, destinationSource, amount) => {
    const url = 'https://api-sandbox.dwolla.com/transfers';
    const transferData = {
        _links: {
            source: {
                href: `https://api-sandbox.dwolla.com/funding-sources/${fundingSource}`,
            },
            destination: {
                href: `https://api-sandbox.dwolla.com/funding-sources/${destinationSource}`,
            },
        },
        amount: {
            currency: 'USD',
            value: String(amount.toFixed(2)),
        },
    };
    const response = await axios.post(url, transferData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.dwolla.v1.hal+json',
        },
    });
    return response;
};

// Function to check the status of the transferId
const checkTransferStatus = async (accessToken, transferId) => {
    const response = await axios.get(`https://api-sandbox.dwolla.com/transfers/${transferId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.dwolla.v1.hal+json',
        },
    });
    return response.data.status;
};

module.exports = {
    PostUserQuestion: async (req, res, next) => {
        const { product_id, question, email } = req.body;

        try {
            authenticateUser(req, res, next, async (user) => {
                const payload = {
                    type: 'User Question',
                    sender_type: 'Question',
                    page: 7
                };
                await performQuery(userModel.setNewAdminNotification, payload);
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
                const payload = {
                    type: 'User Rating',
                    sender_type: 'Rating',
                    page: 7
                };
                await performQuery(userModel.setNewAdminNotification, payload);
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
                let Orders = [];
                const OrderInfoArray = await performQuery(userCrudModel.getUserOrderInfoQuery, user.user_id);
                Orders = await Promise.all(OrderInfoArray.map(async (Order) => {
                    return {
                        OrderInfo: Order,
                        OrderProducts: await performQuery(userCrudModel.getUserOrderProduct, Order.order_id)
                    };
                }));
                const user_notification_count = await performQuery(userCrudModel.getUserNotificationCountQuery, user.user_id);
                const User_Notifications = {
                    user_notification_count: user_notification_count[0].notification_count,
                    notifications: await performQuery(userCrudModel.getUserNotifications, user.user_id)
                }
                return res.status(200).json({
                    user,
                    address: address[0],
                    Orders: Orders,
                    User_Notifications: User_Notifications
                });
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
                const payload = {
                    type: 'New Report',
                    sender_type: 'Report',
                    page: 5
                };
                await performQuery(userModel.setNewAdminNotification, payload);
                return res.status(200).json({
                    success: true
                });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    insertNewOrder: async (req, res, next) => {
        const { FormInfo, payMethodState, store, bank_src } = req.body;
        try {
            authenticateUser(req, res, next, async (user) => {
                const encrypted = encryptBankSourceId(bank_src || "");
                const resData = await performQuery(productOrderModel.insertNewOrderProductQuery, {
                    ...FormInfo,
                    user_id: user.user_id,
                    payMethodState: payMethodState,
                    bank_src: encrypted
                });
                console.log('New Order arrived: ' + resData.insertId);
                store.forEach(async (product) => {
                    await performQuery(productOrderModel.insertNewOrderQuery, product, resData.insertId);
                });

                //* incrementing total sales
                const totalAmount = store.reduce((s, c) => s + c.price, 0);
                await performQuery(adminDashboardModel.changeStaticValuesQuery, 'total_sales', '+', totalAmount);


                //* incrementing number of purchase
                await performQuery(adminDashboardModel.changeStaticValuesQuery, 'number_of_purchase', '+', 1);

                //* inserting admin new notification
                const payload = {
                    type: 'Order Arrived',
                    sender_type: 'Order',
                    page: 4
                };
                await performQuery(userModel.setNewAdminNotification, payload);

                res.send({
                    OrderInfo: await performQuery(productOrderModel.getOrderInfoByIdQuery, resData.insertId),
                    OrderProducts: await performQuery(productOrderModel.getOrderProductByIdQuery, resData.insertId),
                });

            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    performPayment: async (req, res) => {
        const { amount_value, funding_source } = req.body;
        console.log('Amount : ' + amount_value + 'Tk');
        console.log('Funding source: ' + funding_source);
        const apiKey = process.env.EXCHANGERATE_API_KEY;
        const clientId = process.env.DWOLLA_API_KEY;
        const clientSecret = process.env.DWOLLA_API_SECRET_KEY;
        const destinationSource = process.env.DWOLLA_FUNDING_SOURCE_ID;

        try {
            const rate = await getExchangeRate(apiKey);
            const convertedAmount = amount_value * rate;
            console.log('Converted Amount: ' + convertedAmount.toFixed(2) + '$');

            const accessToken = await getAccessToken(clientId, clientSecret);
            console.log('Access Token: ' + accessToken);

            await performTransfer(accessToken, funding_source, destinationSource, convertedAmount);
            console.log('Transfer created successfully');
            return res.status(201).json({ message: 'Transfer created successfully', accessToken: accessToken });
        } catch (error) {
            // Handle the error response
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Send back the error response from Dwolla
                    res.status(error.response.status).json({
                        message: 'Error creating transfer. ' + error.response.status + '. ' + error.response.statusText + '. ' + error.response.data
                    });
                } else if (error.request) {
                    // Request was made but no response was received
                    res.status(500).json({
                        message: 'No response received from Dwolla. ' + error.request
                    });
                } else {
                    // Something happened in setting up the request
                    res.status(500).json({ message: 'Request setup error. ' + error.message });
                }
            } else {
                // Non-Axios error
                return res.status(500).json({ message: 'Unexpected error. ' + error.message });
            }
        }
    },
    // checkTransferPayment: async (req, res) => {
    //     const { TransferId, accessToken } = req.body;
    //     console.log('TransferId: ' + TransferId);
    //     console.log('accessToken: ' + accessToken);
    //     try {
    //         const transferStatus = await checkTransferStatus(accessToken, TransferId);
    //         console.log('Transfer Status: ' + transferStatus);
    //         res.json({ transferStatus: transferStatus });
    //     } catch (error) {
    //         console.error('Error:', error);
    //         if (error.response && error.response.data) {
    //             console.error('Dwolla Error:', error.response.data);

    //             return res.status(error.response.status).json({
    //                 message: error.response.data.message || 'An error occurred',
    //             });
    //         }

    //         return res.status(500).json({
    //             message: 'Unexpected error. ' + error.message
    //         });

    //     }
    // },
    updateUserNotificationView: async (req, res, next) => {
        const { notification_user_no } = req.params;
        try {
            authenticateUser(req, res, next, async (user) => {
                await performQuery(userCrudModel.updateUserNotificationViewQuery, notification_user_no);
                res.status(201).send(true);
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateUserNotificationCount: async (req, res, next) => {
        const { count } = req.params;
        try {
            authenticateUser(req, res, next, async (user) => {
                await performQuery(userCrudModel.updateUserNotificationCountQuery, count, user.user_id);
                res.status(201).send({ success: true });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


};