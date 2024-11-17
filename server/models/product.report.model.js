const db = require('../config/DB');

module.exports = {
    getMainReportQuery: (callback) => {
        db.query('select * from report_main ;', callback);
    },
    getSubReportQuery: (callback) => {
        db.query('select * from report_sub ;', callback);
    },
    createReportQuery: (body, callback) => {
        db.query(`INSERT INTO ${body.table} (report_name) VALUES (?);`, [body.report_name], callback);
    },
    updateReportQuery: (body, callback) => {
        db.query(
            `update ${body.table} set report_name = ? where ${body.report_no_name} = ? ;`,
            [body.updated_report_name, body.report_no],
            callback
        );
    },
    deleteReportQuery: (body, callback) => {
        db.query(`delete from ${body.table} where ${body.report_no_name} = ? ;`,
            [body.report_no],
            callback
        );
    },
    getUserReportQuery: (callback) => {
        db.query(`
            SELECT 
            u_r.user_report_no AS user_report_no,
            u_r.user_id AS user_id,
            u_r.report_string AS report_string,
            u_r.report_description AS report_description,
            u_r.report_date AS report_date,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name,
            u.email AS email
            FROM 
            user u
            JOIN 
            user_report u_r
            ON 
            u_r.user_id = u.user_id;
            `, callback);
    },
    deleteUserReportQuery: (user_report_no, callback)=>{
        db.query('delete from user_report where user_report_no = ? ; ', [user_report_no], callback);
    }
};