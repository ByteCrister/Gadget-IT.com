const db = require('../config/DB');

module.exports = {
    getQuestions: (callback) => {
        db.query(
            `select 
            q.question_no question_no,
            q.user_id user_id,
            u.first_name first_name,
            u.last_name last_name,
            q.email email,
            q.product_id product_id,
            q.question question,
            q.answer answer,
            q.question_date question_date
            from user u
            join question q
            on u.user_id = q.user_id; `,
            callback);
    },

    putAnswerModel: (body, callback) => {
        db.query('update question set answer = ? where question_no = ? ;', [body.answer, body.question_no], callback);
    },

    deleteAnswerModel: (question_no, callback) => {
        db.query('delete from question where question_no = ? ;', [question_no], callback);
    },

    getRatings: (callback) => {
        db.query(
            `select 
            product_id,
            COUNT(product_id) no_of_rating,
            AVG(rating_stars) rating_stars
            FROM rating
            GROUP BY product_id;`,
            callback);
    },

    getAllRatings: (callback) => {
        db.query('select * from rating ;', callback);
    }
}