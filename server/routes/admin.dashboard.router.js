const adminDashboardController = require('../controllers/admin.dashboard.controller');

const adminDashboardRouter = require('express').Router();

adminDashboardRouter.get('/dashboard-information', adminDashboardController.getDashboardInformation);
adminDashboardRouter.post('/change-static-value', adminDashboardController.changeStaticValues);
adminDashboardRouter.patch('/set-new-sales', adminDashboardController.setNewSales);

module.exports = adminDashboardRouter;