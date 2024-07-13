const db = require('../models/DB');

module.exports = {
    getProductsCategoryModel : (callback)=>{
        db.query(`SELECT * FROM category`, callback);
    },
    getProductsSubCategory : (callback)=>{
        db.query(`SELECT * FROM sub_category`, callback);
    }
}