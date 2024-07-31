const productPostModels = require("../models/product.post.models");

module.exports = {
    postNewProductController: async (req, res) => {
        const { table, newKeyValue, tableColumnValue, mandatoryValues, newDescriptionHeadValue, extraImages } = req.body;

        try {
            // Updating the product ID
            await new Promise((resolve, reject) => {
                productPostModels.updateProductIDModel((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Fetching the updated product ID
            const newProductID = await new Promise((resolve, reject) => {
                productPostModels.getProductIDModel((err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            const productId = newProductID[0].product_id;
            console.log(productId);

            // Posting stock values
            await new Promise((resolve, reject) => {
                productPostModels.PostStockValues(mandatoryValues, productId, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            if (newKeyValue.length > 0) {
                // Creating new columns
                await new Promise((resolve, reject) => {
                    productPostModels.createNewColumn(table, newKeyValue, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }
            // Creating new description row
            if (newDescriptionHeadValue.length > 0) {
                await new Promise((resolve, reject) => {
                    productPostModels.createNewDescriptionColumn(productId, table, newDescriptionHeadValue, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }

            // Posting new product
            await new Promise((resolve, reject) => {
                productPostModels.newProductPostModel(table, newKeyValue, tableColumnValue, mandatoryValues, productId, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });


            //inserting new extraImages
            if (extraImages.length > 0) {
                await new Promise((resolve, reject) => {
                    productPostModels.insertExtraImages(table, productId, extraImages, (err, data) => {
                        if (err) reject(err)
                        else resolve(data);
                    })
                })
            }


            console.log("Product added successfully");
            res.status(200).json({ message: "Product added successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to post new product" });
        }
    }
};
