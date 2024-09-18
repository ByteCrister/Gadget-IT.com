const db = require('../config/DB');

module.exports = {
    getAdvertisement: (callback) => {
        db.query(
            `select img, position from advertisement_img;`,
            callback
        );
    },

    getHomeProduct: (table, callback) => {
        db.query(
            `select
            p.product_id product_id,
            p.product_name product_name,
            p.main_category main_category,
            p.image image,
            p_s.cut_price cut_price,
            p_s.price price,
            h_p.position position

            from ${table} p
            join product_stock p_s
            on p_s.product_id = p.product_id
            join home_product_select h_p
            ON h_p.product_id = p_s.product_id
            where p.hide != 1
            ORDER BY h_p.serial_no;`,
            callback
        );
    },
    getHomeDescription: (callback) => {
        db.query(`select * from home_description order by serial_no;`, callback);
    },
    getFeaturedIcon: (callback) => {
        db.query(`select * from featured_category_icon order by serial_no ;`, callback);
    },

    getProductFromTable: (table, callback) => {
        db.query(`select * from ${table} where hide != 1;`, callback);
    },
    getProductExtraImages : (category, callback)=>{
        db.query(`select * from extra_images where category = ? ;`, [category], callback);
    },

    getProductDescriptions: (category, callback)=>{
        db.query(`select * from description where product_main_category = ? ;`, [category], callback);
    },
    getProductKeyFeature : (category, callback)=>{
        db.query(`select * from key_feature where category = ? ;`, [category], callback);
    },
    getProductSorting : (category, callback)=>{
        db.query(`select * from sorting where category = ? ;`, [category], callback);
    },
    getProductPrices : (callback)=>{
        db.query(`select * from product_stock ;`, callback);
    }
} 