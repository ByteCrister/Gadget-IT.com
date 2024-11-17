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
            p.discount_type discount_type,
            p.discount_value discount_value,
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
    getProductExtraImages: (category, callback) => {
        db.query(`select * from extra_images where category = ? ;`, [category], callback);
    },

    getProductDescriptions: (category, callback) => {
        db.query(`select * from description where product_main_category = ? ;`, [category], callback);
    },
    getProductKeyFeature: (category, callback) => {
        db.query(`select * from key_feature where category = ? ;`, [category], callback);
    },
    getProductSorting: (category, callback) => {
        db.query(`select * from sorting where category = ? ;`, [category], callback);
    },
    getProductPrices: (callback) => {
        db.query(`select * from product_stock ;`, callback);
    },
    getProductQuestions: (callback) => {
        db.query(`
            select 
            u.first_name fname,
            u.last_name lname, 
            q.product_id product_id, 
            q.question question,
            q.answer answer,
            q.question_date question_date

            from user u
            join question q
            on q.user_id = u.user_id
            where
            LENGTH(q.answer) != 0;
            `, callback);
    },
    getProductRatings: (callback) => {
        db.query(`
            SELECT 
            u.first_name fname,
            u.last_name lname,
            r.product_id product_id,
            r.rating_stars rating,
            r.review review,
            r.rating_date rating_date

            from user u
            JOIN rating r
            ON r.user_id = u.user_id;
            `, callback);
    }
} 