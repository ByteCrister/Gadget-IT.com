const productProductionController = require('../controllers/product.production.controller');

const productionRouter = require('express').Router();

productionRouter.get('/get/production', productProductionController.getProductionController);
productionRouter.get('/production/get/columns/:table', productProductionController.getProductionColumns);
productionRouter.put('/update/product', productProductionController.updateProductController);

module.exports = productionRouter;