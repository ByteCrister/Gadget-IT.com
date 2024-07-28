const productPostController = require('../controllers/product.post.controller');

const postProductRouter = require('express').Router();

postProductRouter.post('/post/new/product', productPostController.postNewProductController);

module.exports = postProductRouter;