const db = require('../config/DB');

module.exports = {
    InsertUserQuestion: (user_id, product_id, email, question, callback) => {
        db.query('insert into question (user_id, email, product_id, question) values (?, ?, ?, ?);',
            [user_id, email, product_id, question],
            callback
        );
    },
    InsertUserRating: (user_id, product_id, email, rating, review, callback) => {
        db.query(
            'insert into rating (user_id, email, product_id, rating_stars, review) values (?, ?, ?, ?, ?);',
            [user_id, email, product_id, rating, review],
            callback
        );
    },
    UpdateUserInfo: (body, user_id, callback) => {
        db.query('update user set first_name = ?, last_name = ? where user_id = ? ;',
            [body.f_name, body.l_name, user_id],
            callback
        );
    },

    getUserAddress: (user_id, callback) => {
        db.query('select * from address where user_id = ? ;', [user_id], callback);
    },

    insertAddress: (body, user_id, callback) => {
        db.query(
            'insert into address (user_id, first_name, last_name, email, phone_number, address_1, address_2) values (?, ?, ?, ?, ?, ?, ?) ;',
            [user_id, body.first_name, body.last_name, body.email, body.phone_number, body.address_1, body.address_2],
            callback
        );
    },

    updateAddress: (body, user_id, callback) => {
        db.query(
            'update address set first_name = ?, last_name = ?, email = ?, phone_number = ?, address_1 = ?, address_2 = ? where user_id = ? ;',
            [body.first_name, body.last_name, body.email, body.phone_number, body.address_1, body.address_2, user_id],
            callback
        );
    },

    UpdatePassword: (newPassword, user_id, callback) => {
        db.query('update user set password = ? where user_id = ? ;', [newPassword, user_id], callback);
    }

}