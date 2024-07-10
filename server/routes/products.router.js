const productsControllers = require('../controllers/products.controllers');

const productRouter = require('express').Router();

productRouter.get('/', productsControllers.getProducts);


module.exports = productRouter;