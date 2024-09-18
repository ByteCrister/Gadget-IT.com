const db = require('../config/DB');

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
    productSettingModel_home_description: (callback) => {
        db.query('select * from home_description ;', callback);
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
        db.query(`delete from featured_category_icon where icon_no = ?;`, [icon_no], callback);
    },
    updateFeaturedImages: (item, callback) => {
        db.query('update featured_category_icon set icon = ?, serial_no = ?, main_category = ? where icon_no = ? ;',
            [item.icon, item.serial_no, item.main_category, item.icon_no],
            callback
        );
    },
    addNewFeaturedImages: (item, callback) => {
        db.query(`
            insert into featured_category_icon (icon, serial_no, main_category)
            values (?, ?, ?) ;`,
            [item.icon, item.serial_no, item.main_category],
            callback
        );
    },
    truncateTable: (callback) => {
        db.query('truncate table home_product_select', callback);
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
    }
}