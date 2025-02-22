const performQuery = require("../config/performQuery");
const adminDashboardModel = require("../models/admin.dashboard.model");

module.exports = {
    getDashboardInformation: async (req, res) => {
        try {
            const dashboard = await performQuery(adminDashboardModel.getDashboardInfoQuery);
            const stockInformation = await performQuery(adminDashboardModel.getStockInformation);
            const chart = await performQuery(adminDashboardModel.getChartQuery);

            return res.status(200).send({
                dashboard: { ...dashboard[0], ...stockInformation[0] },
                chart
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },

    changeStaticValues: async (req, res) => {
        const { column, operator, value } = req.body;
        try {
            await performQuery(adminDashboardModel.changeStaticValuesQuery, column, operator, value);
            return res.status(200).send({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.message });
        }
    },

    setNewSales: async (req, res) => {
        try {
            await performQuery(adminDashboardModel.setNewSalesQuery, req.body.costState);
            return res.status(201).send({ success: true });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.message });
        }
    }
};