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

userRouter.get('/get-user-information', userCrudController.GetUserInfo);
userRouter.post('/update-user-personal-information', userCrudController.UpdatePersonalInfo);
userRouter.post('/update-user-address', userCrudController.UpdateAddress);
userRouter.post('/update-user-password', userCrudController.UpdateUserPassword);
userRouter.post('/pre-order', userCrudController.PostPreOrder);
userRouter.get('/get/user-interface-report', userCrudController.getUserInterfaceReport);
userRouter.post('/post-new-user-report', userCrudController.postNewUserReport);

userRouter.post('/insert-new-order', userCrudController.insertNewOrder);
userRouter.post('/perform-payment', userCrudController.performPayment);
// userRouter.post('/check-transfer-payment', userCrudController.checkTransferPayment);
module.exports = userRouter;