const productOrderController = require('../controllers/product.order.controller');

const OrderRouter = require('express').Router();

OrderRouter.get('/get/order-page', productOrderController.getOrdersPage);
OrderRouter.patch('/update/order-status', productOrderController.updateOrderStatus);

module.exports = OrderRouter;