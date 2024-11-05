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
            const clientId = process.env.DWOLLA_API_KEY;
            const clientSecret = process.env.DWOLLA_API_SECRET_KEY;
            const accessToken = await getAccessToken(clientId, clientSecret);
            const orders = await performQuery(productOrderModel.getOrdersQuery);
            const Orders = await Promise.all(
                orders.map(async (order) => {
                    try {
                        const [transferStatus, OrderProducts] = await Promise.all([
                            checkTransferStatus(accessToken, order.bank_transfer_id),
                            performQuery(productOrderModel.getOrderProductByIdQuery, order.order_id)
                        ]);
                        return {
                            OrderInfo: { ...order, selected: false, payment_status: transferStatus },
                            OrderProducts
                        };
                    } catch (productError) {
                        return {
                            OrderInfo: { ...order, selected: false, payment_status: 'Pending' },
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
    }
};