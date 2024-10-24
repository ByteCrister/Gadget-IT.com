const productSupportController = require('../controllers/product.support.controller');

const SupportRouter = require('express').Router();

SupportRouter.get('/get/product/support', productSupportController.getSupportData);
SupportRouter.put('/update/answer', productSupportController.putAnswer);
SupportRouter.delete('/delete/answer/:question_no', productSupportController.deleteAnswer);

module.exports = SupportRouter;