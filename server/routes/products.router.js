const productsControllers = require('../controllers/products.controllers');

const productRouter = require('express').Router();

productRouter.get('/products/category/menu/items', productsControllers.getProductCategories);


module.exports = productRouter;