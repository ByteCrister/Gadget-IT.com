const db = require('../config/DB');

module.exports = {
    getProductsCategoryModel: (callback) => {
        db.query(`SELECT * FROM category`, callback);
    },
    getProductsSubCategory: (callback) => {
        db.query(`SELECT * FROM sub_category`, callback);
    },



    getProductsCategoryNamesModel: (callback) => {
        db.query(`select * from category`, callback);
    },
    getProductsSubCategoryNamesModel: (callback) => {
        db.query(`select * from sub_category`, callback);
    },

    getVendorsNames: (callback) => {
        db.query(`select * from vendors`, callback);
    },
    getSortingOptions : (category, callback)=>{
        db.query(`select * from sorting where category = ?;`, [category], callback);//** */
    },
    getKeyFeatures : (category, callback)=>{
        db.query(`select key_feature_column from key_feature where category = ?;`, [category], callback);
    },

    getInitialMandatoryColumnsModel: (category, callback) => {
        db.query(
            `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'gadget_it' AND TABLE_NAME = '${category}';`
            , callback);

    },


}