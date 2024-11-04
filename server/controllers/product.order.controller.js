const productOrderModel = require("../models/product.order.model");

const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

module.exports = {
  
};