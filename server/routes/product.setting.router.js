const productSettingController = require('../controllers/product.setting.controller');

const productSetting = require('express').Router();

productSetting.get('/get/product/setting', productSettingController.getProductSetting);

productSetting.post('/advertisement/images', productSettingController.CrudImages);
productSetting.post('/featured/images/crud', productSettingController.CrudFeaturedImages);
productSetting.post('/home-product-select/crud', productSettingController.CrudHomeProductSelect);
productSetting.post('/home-view-description/crud', productSettingController.CrudHomeDescription);
module.exports = productSetting;