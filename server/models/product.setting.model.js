const { type } = require('os');
const db = require('../config/DB');

const toBangladeshTime = (date) => {
    return new Date(new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })));
};


module.exports = {
    productSettingModel_advertisement: (callback) => {
        db.query('select * from advertisement_img ;', callback);
    },
    productSettingModel_featured_category: (callback) => {
        db.query('select * from featured_category_icon ;', callback);
    },
    productSettingModel_home_product_select: (callback) => {
        db.query('select * from home_product_select ;', callback);
    },
    deletePositionQuery: (product_id, callback) => {
        if (typeof product_id === 'number') {
            db.query('delete from home_product_select where product_id = ? ;', [product_id], callback);
        }
    },
    insertPositionQuery: (product, callback) => {
        if (typeof product === 'object') {
            db.query('insert into home_product_select (product_id, main_category, position, serial_no) values (?, ?, ?, ?) ;', [product.product_id, product.main_category, product.position, product.serial_no], callback);
        }
    },
    updatePositionQuery: (product, callback) => {
        if (typeof product === 'object') {
            db.query('update home_product_select set position = ?, serial_no = ? where product_id = ? ;', [product.position, product.serial_no, product.product_id], callback);
        }
    },
    productSettingModel_home_description: (callback) => {
        db.query('select * from home_description ;', callback);
    },
    productSettingModel_OfferCarts: (callback) => {
        db.query('select * from offer_carts ;', callback);
    },
    productSettingModel_OfferCartsProducts: (callback) => {
        db.query('select * from offer_carts_products ;', callback);
    },
    productSettingModel_footer: (callback) => {
        db.query('select * from footer where id = 1;', callback);
    },
    updateFooterQuery: (footer, callback) => {
        db.query('update footer set phone = ?, location = ?, connected_text = ? where id = 1; ', [footer.phone, footer.location, footer.connected_text], callback);
    },
    updateAdvertiseImages: (item, callback) => {
        db.query(`update advertisement_img set img = ?, position = ? where img_no = ? `,
            [item.img, item.position, item.img_no],
            callback
        );
    },
    addNewAdvertisementImages: (item, callback) => {
        db.query('insert into advertisement_img (img, position, serial_no) values ( ?, ?, ? )',
            [item.img, item.position, 0],
            callback
        );
    },
    deleteAdvertisementImages: (img_no, callback) => {
        db.query(`delete from advertisement_img where img_no = ?;`, [img_no], callback);
    },
    deleteFeaturedImages: (icon_no, callback) => {
        if (typeof icon_no === 'number') {
            db.query(`delete from featured_category_icon where icon_no = ?;`, [icon_no], callback);
        }
    },
    updateFeaturedImages: (item, callback) => {
        if (typeof item === 'object') {
            db.query('update featured_category_icon set icon = ?, serial_no = ?, main_category = ? where icon_no = ? ;',
                [item.icon, item.serial_no, item.main_category, item.icon_no],
                callback
            );
        }
    },
    addNewFeaturedImages: (item, callback) => {
        if (typeof item === 'object') {
            db.query(`
            insert into featured_category_icon (icon, serial_no, main_category)
            values (?, ?, ?) ;`,
                [item.icon, item.serial_no, item.main_category],
                callback
            );
        }
    },
    AddUpdatedSelection: (item, callback) => {
        db.query(`
            insert into home_product_select (product_id, main_category, position, serial_no) 
            values(?, ?, ?, ?);
            `,
            [item.product_id, item.main_category, item.position, item.serial_no],
            callback
        );
    },
    deleteHomeDes: (des_no, callback) => {
        db.query(`delete from home_description where des_no = ?;`,
            [des_no],
            callback
        );
    },
    newHomeDes: (item, callback) => {
        db.query(`
            insert into home_description (des_head, des_value, serial_no)
            values (?, ?, ?);`,
            [item.des_head, item.des_value, item.serial_no],
            callback);
    },
    updateHomeDes: (item, callback) => {
        db.query(`
            update home_description set 
            des_head = ?,
            des_value = ?,
            serial_no = ?
            where des_no = ? ;`,
            [item.des_head, item.des_value, item.serial_no, item.des_no],
            callback);
    },

    postNewOfferModel: (formData, callback) => {
        db.query(
            `insert into offer_carts (cart_title, cart_description, cart_image, offer_start, offer_end) 
            values (?, ?, ?, ?, ?) ;`,
            [formData.cart_title, formData.cart_description, formData.cart_image, toBangladeshTime(formData.offer_start), toBangladeshTime(formData.offer_end)],
            callback);
    },

    updateOffer: (formData, callback) => {
        db.query(`update offer_carts set cart_title = ?, cart_description = ?, cart_image = ?, offer_start = ?, offer_end = ? where cart_no = ?;`,
            [formData.cart_title, formData.cart_description, formData.cart_image, toBangladeshTime(formData.offer_start), toBangladeshTime(formData.offer_end), formData.cart_no],
            callback);
    },
    deleteOffer: (cart_no, callback) => {
        db.query('delete from offer_carts where cart_no = ? ;', [cart_no], callback);
    },
    deleteOfferProductByCartNo: (cart_no, callback) => {
        db.query('delete from offer_carts_products where offer_cart_no = ? ;', [cart_no], callback);
    },
    deleteOfferProduct: (product_id, callback) => {
        if (typeof product_id === 'number') {
            db.query('delete from offer_carts_products where product_id = ? ;', [product_id], callback);
        }
    },
    UpdateOfferProducts: (product, callback) => {
        if (typeof product === 'object') {
            db.query(`update offer_carts_products set offer_cart_no = ?, serial_no = ? where product_id = ? ;`, [product.offer, product.serial_no, product.product_id], callback);
        }
    },
    insertOfferProducts: (product, callback) => {
        if (typeof product === 'object') {
            db.query(
                `insert into offer_carts_products (product_id, offer_cart_no, serial_no)
                values (?, ?, ?) ;`,
                [product.product_id, product.offer, product.serial_no],
                callback);
        }
    }
}