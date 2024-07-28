const db = require('../models/DB');

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


    getInitialMandatoryColumnsModel: (category, callback) => {
        db.query(
            `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'gadget_it' AND TABLE_NAME = '${category}';`
            , callback);

    }
}