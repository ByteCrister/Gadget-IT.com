const userControllers = require('../controllers/user.controllers');
const userCrudController = require('../controllers/user.crud.controller');
require('dotenv').config();

const userRouter = require('express').Router();

userRouter.get('/user/home/view', userControllers.UserHomeViewController);

userRouter.post('/user/registration', userControllers.userPostRegistrationController);
userRouter.get('/new/user/confirm', userControllers.newUserRegistrationController);

userRouter.post('/user/log-in', userControllers.userLogInController);

userRouter.post('/user/forgot/password', userControllers.UserForgotPasswordController);
userRouter.get('/user/new/pass/confirm', userControllers.UserNewPass);

userRouter.post('/admin/email-password', userControllers.SetNewAdminPasswordEmailController);

userRouter.get('/get/user-email', userControllers.getUserEmail);



userRouter.post('/post-user-question', userCrudController.PostUserQuestion);
userRouter.post('/post-user-rating', userCrudController.PostUserRating);
module.exports = userRouter;