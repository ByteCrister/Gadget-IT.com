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
    }
}