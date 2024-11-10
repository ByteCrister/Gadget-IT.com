const productInventoryModel = require("../models/product.inventory.model");
const productPostModels = require("../models/product.post.models");
const getTableName = (table, MainTables, SubTables) => {
    const mainTableExists = MainTables.some((item) => item.category_name === table);
    if (mainTableExists) {
        return table;
    } else {
        const subTable = SubTables.filter((item) => item.sub_category_name === table);
        if (subTable.length > 0) {
            return getTableName(subTable[0].main_category_name, MainTables, SubTables);
        } else {
            return null;
        }
    }
};


module.exports = {
    postNewProductController: async (req, res) => {
        const { table, newKeyValue, tableColumnValue, mandatoryValues, newDescriptionHeadValue, extraImages } = req.body;

        try {
            const MainTables = await new Promise((resolve, reject) => {
                productInventoryModel.getMainTables((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const SubTables = await new Promise((resolve, reject) => {
                productInventoryModel.getSubTables((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const Table = getTableName(table, MainTables, SubTables);

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

            // Creating new columns
            if (newKeyValue.length > 0) {
                await new Promise((resolve, reject) => {
                    productPostModels.createNewColumn(Table, newKeyValue, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }
            // Creating new description row
            if (newDescriptionHeadValue.length > 0) {
                await new Promise((resolve, reject) => {
                    productPostModels.createNewDescriptionColumn(productId, Table, newDescriptionHeadValue, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }

            // Posting new product
            await new Promise((resolve, reject) => {
                productPostModels.newProductPostModel(Table, newKeyValue, tableColumnValue, mandatoryValues, productId, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });


            // inserting new extraImages
            if (extraImages.length > 0) {
                await new Promise((resolve, reject) => {
                    productPostModels.insertExtraImages(Table, productId, extraImages, (err, data) => {
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
