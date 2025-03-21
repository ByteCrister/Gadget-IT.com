const db = require('../config/DB');

module.exports = {
    getAdminNotificationQuery: (callback) => {
        db.query('select * from notification_admin order by notification_no desc;', callback);
    },
    getAdminNotificationCountQuery: (callback) => {
        db.query('select admin_count from notification_count where notification_no = ? ;', [0], callback);
    },
    insertNewUserCountQuery: (user_id, callback) => {
        db.query('insert into notification_user_count (user_id, notification_count) values (?, ?) ; ', [user_id, 0], callback);
    },
    updateAdminViewQuery: (notification_no, callback) => {
        db.query('update notification_admin set viewed = ? where notification_no = ? ; ', [1, notification_no], callback);
    },
    updateAdminCountQuery: (count, callback) => {
        db.query('update notification_count set admin_count = ? where notification_no = ? ; ', [count, 0], callback);
    },
    deleteAdminViewQuery: (notification_no, callback) => {
        db.query('delete from notification_admin where notification_no = ? ; ', [notification_no], callback);
    },


    // * vendor - CRUD
    getVendorsQuery: (callback) => {
        db.query('select * from vendors; ', callback);
    },
    postVendorQuery: (vendor_name, callback) => {
        db.query('insert into vendors (vendor_name) values (?) ;', [vendor_name], callback);
    },
    putVendorQuery: (new_vendor_name, vendor_no, callback) => {
        db.query('update vendors set vendor_name = ? where vendor_no = ? ; ', [new_vendor_name, vendor_no], callback);
    },
    deleteVendorQuery: (vendor_no, callback)=>{
        db.query('delete from vendors where vendor_no = ? ;', [vendor_no], callback);
    }
};