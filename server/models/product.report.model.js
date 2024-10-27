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
    }
};