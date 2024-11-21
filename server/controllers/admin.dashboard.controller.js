const adminDashboardModel = require("../models/admin.dashboard.model");

const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

module.exports = {
    getDashboardInformation: async (req, res) => {
        try {
            const dashboard = await performQuery(adminDashboardModel.getDashboardInfoQuery);
            const stockInformation = await performQuery(adminDashboardModel.getStockInformation);
            const chart = await performQuery(adminDashboardModel.getChartQuery);

            res.status(200).send({
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
            res.status(200).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    },

    setNewSales: async (req, res) => {
        try {
            await performQuery(adminDashboardModel.setNewSalesQuery, req.body.costState);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    }
};