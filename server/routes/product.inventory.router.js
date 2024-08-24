const productInventoryControllers = require('../controllers/product.inventory.controllers.js');

const productInventoryRouter = require('express').Router();

productInventoryRouter.get('/get/inventory', productInventoryControllers.getInventoryController);

productInventoryRouter.post('/update/hide', productInventoryControllers.updateHideProduct);
productInventoryRouter.post('/delete/products', productInventoryControllers.deleteProducts);


module.exports = productInventoryRouter;