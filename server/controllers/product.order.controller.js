const { decryptBankSourceId } = require("../config/auth.crypto");
const sendInvoice = require("../config/invoice.send");
const adminDashboardModel = require("../models/admin.dashboard.model");
const productOrderModel = require("../models/product.order.model");
const productsModels = require("../models/products.models")
const axios = require('axios');

require('dotenv').config();

const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
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


module.exports = {
    getOrdersPage: async (req, res) => {
        try {
            const orders = await performQuery(productOrderModel.getOrdersQuery);
            const Orders = await Promise.all(
                orders.map(async (order) => {
                    try {
                        const [OrderProducts] = await Promise.all([
                            performQuery(productOrderModel.getOrderProductByIdQuery, order.order_id)
                        ]);
                        return {
                            OrderInfo: { ...order, selected: false, invoiceLoading: false },
                            OrderProducts
                        };
                    } catch (productError) {
                        return {
                            OrderInfo: { ...order, selected: false, invoiceLoading: false },
                            OrderProducts: await performQuery(productOrderModel.getOrderProductByIdQuery, order.order_id)
                        };
                    }
                })
            );

            res.status(200).send(Orders);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on getOrderPage - ', error: error });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            await performQuery(productOrderModel.updateOrderStatus, req.body.newStatus, req.body.order_id);

            if (req.body.currStatus === 'Ready to Collect' && req.body.newStatus === 'Canceled') {
                await performQuery(adminDashboardModel.changeStaticValuesQuery, 'returns', '+', 1);

            } else if (req.body.currStatus !== 'Ready to Collect' && req.body.newStatus === 'Canceled') {
                await performQuery(adminDashboardModel.changeStaticValuesQuery, 'cancle_order', '+', 1);

            }

            if (req.body.newStatus === 'Canceled') {
                //* Decrementing total_sales
                await performQuery(adminDashboardModel.changeStaticValuesQuery, 'total_sales', '-', req.body.price);
                //* Decrementing number of purchase
                await performQuery(adminDashboardModel.changeStaticValuesQuery, 'number_of_purchase', '-', 1);
            }

            res.status(200).send({ success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on updateOrderStatus - ', error: error });
        }
    },
    postOrderUserNotification: async (req, res) => {
        try {
            await performQuery(productOrderModel.postUserOrderNotification, req.body);
            res.status(200).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on postOrderUserNotification - ', error: error });
        }
    },
    getPaymentStatus: async (req, res) => {
        const { bank_transfer_id } = req.params;
        try {
            const accessToken = await getAccessToken(process.env.DWOLLA_API_KEY, process.env.DWOLLA_API_SECRET_KEY);
            const status = await checkTransferStatus(accessToken, bank_transfer_id);
            res.status(200).send(status);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on getPaymentStatus - ', error: error });
        }
    },
    updatePaymentStatus: async (req, res) => {
        try {
            await performQuery(productOrderModel.updatePaymentStatusQuery, req.body);
            res.status(200).send(true);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on updatePaymentStatus - ', error: error });
        }
    },
    deleteOrder: async (req, res) => {
        try {
            await performQuery(productOrderModel.deleteOrderQuery, req.params.order_id);
            await performQuery(productOrderModel.deleteOrderProductQuery, req.params.order_id);

            const userOrderMessages = await performQuery(productOrderModel.getUserIdQuery, req.params.order_id);

            if (userOrderMessages && userOrderMessages.length > 0) {
                await performQuery(productOrderModel.updateUserNotificationCount, userOrderMessages[0].user_id, userOrderMessages.length);
                await performQuery(productOrderModel.deleteUserOrderNotifications, req.params.order_id);
            }

            // //* Decrementing total sales
            await performQuery(adminDashboardModel.changeStaticValuesQuery, 'total_sales', '-', req.params.total);
            // //* Decrementing number of purchase
            await performQuery(adminDashboardModel.changeStaticValuesQuery, 'number_of_purchase', '-', 1);

            res.status(200).send(true);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on deleteOrder - ', error: error });
        }
    },
    postNewInvoice: async (req, res) => {
        const { Order } = req.body;
        try {
            let category_names = await performQuery(productsModels.getProductsCategoryModel);
            category_names = category_names.map((item) => item.category_name);
            // console.log(Order);

            const ProductInfo = await Promise.all(Order.OrderProducts.map(async (item) => {
                let name = '';
                for (let i = 0; i < category_names.length; i++) {
                    const name_ = await performQuery(productOrderModel.getProductName, category_names[i], item.product_id);
                    if (name_.length !== 0) {
                        name = name_[0].product_name;
                        break;
                    }
                }
                let price = await performQuery(productOrderModel.getProductPrice, item.product_id);
                return {
                    name,
                    price: price[0].price
                };

            }));
            // console.log(ProductInfo);
            await sendInvoice(Order, ProductInfo);
            await performQuery(productOrderModel.updateInvoice, Order.OrderInfo.order_id);
            await performQuery(productOrderModel.postInvoiceNotification, Order.OrderInfo);

            res.status(201).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on postNewInvoice - ', error: error });
        }
    },

    postReturnMoney: async (req, res) => {
        // console.log(req.body);
        const apiKey = process.env.EXCHANGERATE_API_KEY;
        const clientId = process.env.DWOLLA_API_KEY;
        const clientSecret = process.env.DWOLLA_API_SECRET_KEY;
        const fundingSource = process.env.DWOLLA_FUNDING_SOURCE_ID
        const destinationSource = decryptBankSourceId(req.body.OrderInfo.bank_src);
        try {
            const rate = await getExchangeRate(apiKey);
            const convertedAmount = req.body.OrderInfo.price * rate;
            console.log('Converted Amount: ' + convertedAmount.toFixed(2) + '$');

            const accessToken = await getAccessToken(clientId, clientSecret);
            console.log('Access Token: ' + accessToken);

            await performTransfer(accessToken, fundingSource, destinationSource, convertedAmount);
            console.log('Return Money Transfer successfully');

            res.status(201).send({ success: true });

        } catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message });
        }
    }
};