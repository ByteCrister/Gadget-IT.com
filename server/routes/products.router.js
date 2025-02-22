require('dotenv').config();
const productsControllers = require('../controllers/products.controllers');
const productRouter = require('express').Router();

productRouter.get('/products/category/menu/items', productsControllers.getProductCategories);
productRouter.get('/products/categoryNames', productsControllers.getProductsCategoryNamesController);
productRouter.get('/product_key_values/:mainCategory', productsControllers.getProductKeyValues);
productRouter.get('/get/category_and_sub_category', productsControllers.getCategory);
productRouter.get('/get/columns/:mainCategory', productsControllers.getColumnNames);

module.exports = productRouter;