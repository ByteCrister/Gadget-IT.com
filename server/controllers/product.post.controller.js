const productPostModels = require("../models/product.post.models");

module.exports = {
    postNewProductController: (req, res) => {
        const { table, newKeyValue, tableColumnValue, mandatoryValues } = req.body;

        //  updating the product ID
        productPostModels.updateProductIDModel((err1) => {
            if (err1) {
                console.log(err1);
                res.status(500).json({ error: "Failed to update product ID" });
            } else {
                //  fetching the updated product ID
                productPostModels.getProductIDModel((err2, newProductID) => {
                    if (err2) {
                        console.log(err2);
                        res.status(500).json({ error: "Failed to fetch updated product ID" });
                    } else {
                        console.log(newProductID[0].product_id);

                        productPostModels.PostStockValues(mandatoryValues, newProductID[0].product_id, (err3, data2) => {
                            if (err3) {
                                console.log(err3);
                                res.status(500).json({ error: "Failed to post stock values" });
                            } else {
                                if (newKeyValue.length > 0) {
                                    productPostModels.createNewColumn(table, newKeyValue, (err4, data4) => {
                                        if (err4) {
                                            console.log(err4);
                                            res.status(500).json({ error: "Failed to create new columns" });
                                        } else {
                                            productPostModels.newProductPostModel(table, newKeyValue, tableColumnValue, mandatoryValues, newProductID[0].product_id, (err5, data3) => {
                                                if (err5) {
                                                    console.log(err5);
                                                    res.status(500).json({ error: "Failed to post new product" });
                                                } else {
                                                    res.status(200).json({ message: "Product added successfully" });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    productPostModels.newProductPostModel(table, newKeyValue, tableColumnValue, mandatoryValues, newProductID[0].product_id, (err5, data3) => {
                                        if (err5) {
                                            console.log(err5);
                                            res.status(500).json({ error: "Failed to post new product" });
                                        } else {
                                            res.status(200).json({ message: "Product added successfully" });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    }
};
