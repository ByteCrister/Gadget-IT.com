const productPostController = require('../controllers/product.post.controller');
const productionManagementController = require('../controllers/production.management.controller');

const postProductRouter = require('express').Router();

/* ***************************************** productPostController ***************************************** */
postProductRouter.post('/post/new/product', productPostController.postNewProductController);
/* ***************************************************************************************************** */


/* **************************************** productionManagementController ********************************** */
postProductRouter.post('/create/new/category', productionManagementController.CreateNewCategoryController);
postProductRouter.post('/new/sub_category', productionManagementController.CreateNewSubCategory);
postProductRouter.post('/delete/category', productionManagementController.DeleteCategory);
postProductRouter.post('/rename/category', productionManagementController.renameCategoryController);
postProductRouter.post('/add/column', productionManagementController.addNewColumn);
postProductRouter.post('/delete/column', productionManagementController.deleteColumn);
postProductRouter.post('/rename/column', productionManagementController.renameColumn);
postProductRouter.post('/insert/new-sort/crud', productionManagementController.insertNewSortingOption);
// postProductRouter.post('/remove/sort', productionManagementController.deleteSortingOption);
postProductRouter.post('/insert/new-keyFeature', productionManagementController.insertNewKeyFeature);
postProductRouter.post('/remove/keyFeature', productionManagementController.deleteKeyFeature);
/* ***************************************************************************************************** */

module.exports = postProductRouter;