const productUsersPageController = require('../controllers/product.users.page.controller');

const UsersPage = require('express').Router();

UsersPage.get('/get/users-page', productUsersPageController.getUsersPageData);
module.exports = UsersPage;