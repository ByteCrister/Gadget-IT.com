const performQuery = require("../config/performQuery");
const adminDashboardModel = require("../models/admin.dashboard.model");
const productOuterModel = require("../models/product.outer.model");

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
    },

    // * vendor CRUD
    getVendors: async (req, res) => {
        try {
            res.status(201).send(await performQuery(productOuterModel.getVendorsQuery));
        } catch (error) {
            console.log('error on getVendors: ' + error);
            res.status(500).json({ message: error.message });
        }
    },
    postVendor: async (req, res) => {
        try {
            await performQuery(productOuterModel.postVendorQuery, req.body.vendor_name);
            await performQuery(adminDashboardModel.changeStaticValuesQuery, 'total_suppliers', '+', 1);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log('error on postVendor: ' + error);
            res.status(500).json({ message: error.message });
        }
    },
    putVendor: async (req, res) => {
        try {
            await performQuery(productOuterModel.putVendorQuery, req.body.new_vendor_name, req.body.vendor_no);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log('error on putVendor: ' + error);
            res.status(500).json({ message: error.message });
        }
    },
    deleteVendor: async (req, res) => {
        try {
            await performQuery(productOuterModel.deleteVendorQuery, req.params.vendor_no);
            await performQuery(adminDashboardModel.changeStaticValuesQuery, 'total_suppliers', '-', 1);

            res.status(201).send({ success: true });
        } catch (error) {
            console.log('error on deleteVendor: ' + error);
            res.status(500).json({ message: error.message });
        }
    }
};