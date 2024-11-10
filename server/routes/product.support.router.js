const productSupportController = require('../controllers/product.support.controller');

const SupportRouter = require('express').Router();

SupportRouter.get('/get/product/support', productSupportController.getSupportData);
SupportRouter.put('/update/answer', productSupportController.putAnswer);
SupportRouter.put('/update-isSend-preOrder/:preorder_no', productSupportController.updateIsSend);
SupportRouter.delete('/delete/answer/:question_no', productSupportController.deleteAnswer);
SupportRouter.post('/post-user-new-perOrder-notification', productSupportController.postUserNewNotification);

module.exports = SupportRouter;