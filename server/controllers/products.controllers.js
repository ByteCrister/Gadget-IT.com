const productsModels = require("../models/products.models")

module.exports = {
    getProducts: (request, response) => {
        productsModels.getProductsModel((error, productsCategory) => {
            if(!error){
                response.json(productsCategory);
            }
        })
    }
}