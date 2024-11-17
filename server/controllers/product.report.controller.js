const productReportModel = require("../models/product.report.model");

const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

module.exports = {
    getReportData: async (req, res) => {
        try {
            res.send({
                report_main: await performQuery(productReportModel.getMainReportQuery),
                report_sub: await performQuery(productReportModel.getSubReportQuery),
                report_data: await performQuery(productReportModel.getUserReportQuery)
            });
        } catch (error) {
            res.status(501).json({ message: error });
        }
    },

    createReport: async (req, res) => {
        try {
            await performQuery(productReportModel.createReportQuery, req.body);
            res.send({
                report_main: await performQuery(productReportModel.getMainReportQuery),
                report_sub: await performQuery(productReportModel.getSubReportQuery)
            });
        } catch (error) {
            console.error("Error in createReport function:", error);
            res.status(500).json({ message: error.message });
        }
    },

    updateReport: async (req, res) => {
        try {
            await performQuery(productReportModel.updateReportQuery, req.body.body);
            res.send({
                report_main: await performQuery(productReportModel.getMainReportQuery),
                report_sub: await performQuery(productReportModel.getSubReportQuery)
            });
        } catch (error) {
            console.error("Error in createReport function:", error);
            res.status(500).json({ message: error.message });
        }
    },

    deleteReport: async (req, res) => {
        try {
            await performQuery(productReportModel.deleteReportQuery, req.body);
            res.send({
                report_main: await performQuery(productReportModel.getMainReportQuery),
                report_sub: await performQuery(productReportModel.getSubReportQuery)
            });
        } catch (error) {
            console.error("Error in deleteReport function:", error);
            res.status(500).json({ message: error.message });
        }
    },

    deleteUserReport: async (req, res) => {
        const { user_report_no } = req.params;
        try {
            await performQuery(productReportModel.deleteUserReportQuery, user_report_no);
            res.send(await performQuery(productReportModel.getUserReportQuery));
        } catch (error) {
            console.error("Error in deleteUserReport function:", error);
            res.status(500).json({ message: error.message });
        }
    }
};