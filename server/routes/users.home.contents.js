const userHomeContentsController = require('../controllers/user.home.contents.controller');

const userHomeContentRouter = require('express').Router();

userHomeContentRouter.get('/user/home', userHomeContentsController.getUserHomeContents);
userHomeContentRouter.get('/user/products', userHomeContentsController.getUserProducts);

module.exports = userHomeContentRouter;