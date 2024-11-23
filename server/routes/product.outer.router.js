const productOuterController = require('../controllers/product.outer.controller');

const ProductOuterRouter = require('express').Router();
ProductOuterRouter.get('/get/outer-page-information', productOuterController.getOuterInformation);
ProductOuterRouter.patch('/toggle-admin-view/:notification_no', productOuterController.updateAdminView);
ProductOuterRouter.patch('/update-admin-count/:count', productOuterController.updateAdminCount);
ProductOuterRouter.delete('/delete-admin-view/:notification_no', productOuterController.deleteAdminView);

// * vendor CRUD
ProductOuterRouter.get('/get-vendors', productOuterController.getVendors);
ProductOuterRouter.post('/insert-new-vendor', productOuterController.postVendor);
ProductOuterRouter.put('/update-vendor', productOuterController.putVendor);
ProductOuterRouter.delete('/delete-vendor/:vendor_no', productOuterController.deleteVendor);
module.exports = ProductOuterRouter;