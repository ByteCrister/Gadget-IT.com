const productOrderModel = require("../models/product.order.model");
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
                            OrderInfo: { ...order, selected: false },
                            OrderProducts
                        };
                    } catch (productError) {
                        return {
                            OrderInfo: { ...order, selected: false },
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
            res.status(200).send({ success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on updateOrderStatus - ', error: error });
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
            res.status(200).send(true);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error on deleteOrder - ', error: error });
        }
    }
};