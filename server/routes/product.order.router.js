const productOrderController = require('../controllers/product.order.controller');

const OrderRouter = require('express').Router();

OrderRouter.get('/get/order-page', productOrderController.getOrdersPage);
OrderRouter.patch('/update/order-status', productOrderController.updateOrderStatus);
OrderRouter.post('/new-order-user-notification', productOrderController.postOrderUserNotification)
OrderRouter.get('/get-payment-status/:bank_transfer_id', productOrderController.getPaymentStatus);
OrderRouter.patch('/update-payment-status', productOrderController.updatePaymentStatus);
OrderRouter.delete('/delete-order/:order_id/:total', productOrderController.deleteOrder);
OrderRouter.post('/post-new-order-invoice', productOrderController.postNewInvoice);
OrderRouter.post('/post-return-money', productOrderController.postReturnMoney);

module.exports = OrderRouter;