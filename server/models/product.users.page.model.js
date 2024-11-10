const db = require('../config/DB');

module.exports = {
    getUsersQuery: (callback) => {
        db.query('select * from user order by user_id desc ;', callback);
    },

    getUserQuestionQuery: (user_id, callback) => {
        db.query('select * from question where user_id = ? ;', [user_id], callback);
    },

    getUserRatingQuery: (user_id, callback) => {
        db.query('select * from rating where user_id = ? ;', [user_id], callback);
    },

    getUserReportQuery: (user_id, callback) => {
        db.query('select * from user_report where user_id = ? ;', [user_id], callback);
    },

    getUserOrdersQuery: (user_id, callback) => {
        db.query('select * from user_order where user_id = ? ;', [user_id], callback);
    },

    getPeriodQuery: (callback) => {
        db.query(`SELECT 'month' AS period, COUNT(*) AS count
                FROM user
                WHERE YEAR(signIn_time) = YEAR(CURDATE()) 
                AND MONTH(signIn_time) = MONTH(CURDATE())
                UNION ALL
                SELECT 'week' AS period, COUNT(*) AS count
                FROM user
                WHERE YEARWEEK(signIn_time, 1) = YEARWEEK(CURDATE(), 1);`,
            callback);
    }
}