const productOuterModel = require("../models/product.outer.model");

const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

module.exports = {
    getOuterInformation: async (req, res) => {
        try {
            const notifications = await performQuery(productOuterModel.getAdminNotificationQuery);
            const count = await performQuery(productOuterModel.getAdminNotificationCountQuery);
            const notificationStore = {
                notification_admin: await notifications,
                admin_count: await count[0].admin_count
            };

            res.status(200).send(notificationStore);

        } catch (error) {
            console.log('error on getOuterInformation: ' + error);
            res.status(500).json({ error });
        }
    },

    updateAdminView: async (req, res) => {
        try {
            await performQuery(productOuterModel.updateAdminViewQuery, req.params.notification_no);
            res.status(201).send(true);
        } catch (error) {
            console.log('error on updateAdminView: ' + error);
            res.status(500).json({ error });
        }
    },
    updateAdminCount: async (req, res) => {
        try {
            await performQuery(productOuterModel.updateAdminCountQuery, req.params.count);
            res.status(201).send(true);
        } catch (error) {
            console.log('error on updateAdminView: ' + error);
            res.status(500).json({ error });
        }
    },
    deleteAdminView: async (req, res) => {
        try {
            await performQuery(productOuterModel.deleteAdminViewQuery, req.params.notification_no);
            res.status(201).send(true);
        } catch (error) {
            console.log('error on deleteAdminView: ' + error);
            res.status(500).json({ error });
        }
    }
}