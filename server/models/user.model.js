const db = require('../config/DB');

module.exports = {

    userEmailExistModel: (email, callback) => {
        db.query('SELECT email FROM user WHERE email = ?', [email], callback);
    },

    newUserEntryModel: (body, callback) => {
        const { first_name, last_name, email, password } = body;
        const insertUserQuery = 'INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [first_name, last_name, email, password], callback)
    },

    adminPassMatch: (email, callback) => {
        db.query('select admin_password from admin where admin_email = ? ;', [email], callback);
    },
    adminEmailMatch: (email, callback) => {
        db.query('select admin_email from admin where admin_email = ? ', [email], callback);

    },

    userEmailMatchOrNotModel: (email, callback) => {
        db.query('select email from user where email = ? ', [email], callback);
    },

    userPassMatchModal: (email, callback) => {
        db.query('select * from user where email = ?', [email], callback);
    },

    userNewPasswordModel: (email, password, callback) => {
        db.query('update user set password = ? where email = ? ', [password, email], callback);
    },

    setNewAdminPasswordEmailModel: (email, password, callback) => {
        console.log('from admin model ' + email + ' pass - ' + password);
        db.query('update admin set admin_email = ?, admin_password = ? where admin_no = 1', [email, password], callback);
        // db.query('INSERT INTO admin (admin_email, admin_password) VALUES (?, ?)', [email, password], callback);
    },

    setNewAdminNotification: (payload, callback) => {
        db.query('insert into notification_admin (type, sender_type, page, viewed) values (?, ?, ?, ?) ;',
            [payload.type, payload.sender_type, payload.page, 0],
            callback);
    }

}