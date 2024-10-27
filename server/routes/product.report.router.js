const productReportController = require('../controllers/product.report.controller');

const productReportRouter = require('express').Router();

productReportRouter.get('/get/report', productReportController.getReportData);
productReportRouter.post('/create-new-report', productReportController.createReport);
productReportRouter.patch('/update-report', productReportController.updateReport);
productReportRouter.delete('/delete-report', productReportController.deleteReport);
module.exports = productReportRouter;