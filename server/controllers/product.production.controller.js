const productInventoryModel = require("../models/product.inventory.model");
const productProductionModel = require("../models/product.production.model");

const getTableName = (table, MainTables, SubTables) => {
    const mainTableExists = MainTables.some(
        (item) => item.category_name === table
    );
    if (mainTableExists) {
        return table;
    } else {
        const subTable = SubTables.filter(
            (item) => item.sub_category_name === table
        );
        if (subTable.length > 0) {
            return getTableName(
                subTable[0].main_category_name,
                MainTables,
                SubTables
            );
        } else {
            return null;
        }
    }
};
module.exports = {
    getProductionController: async (req, res) => {
        try {
            let TableRows = [];
            let TableFullRows = [];
            const tables = await new Promise((resolve, reject) => {
                // *productInventoryModel
                productInventoryModel.getTableNames((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            for (const table of tables) {
                const rows = await new Promise((resolve, reject) => {
                    // *productProductionModel
                    productProductionModel.getProductionModel(
                        table.category_name,
                        (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        }
                    );
                });
                rows.forEach((element) => {
                    TableRows.push(element);
                });

                // **Full Rows**
                const fullRows = await new Promise((resolve, reject) => {
                    productProductionModel.getFullRows(
                        table.category_name,
                        (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        }
                    );
                });
                fullRows.forEach((element) => {
                    TableFullRows.push(element);
                });
            }
            const descriptions = await new Promise((resolve, reject) => {
                productProductionModel.getDescriptions((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const extraImages = await new Promise((resolve, reject) => {
                productProductionModel.getExtraImages((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            // console.log(TableRows);
            res.json({
                TableRows: TableRows,
                TableFullRows: TableFullRows,
                descriptions: descriptions,
                extraImages: extraImages,
            });
        } catch (error) {
            console.log("Error in getProduction: ", error);
            res.status(500).send("Server Error");
        }
    },

    getProductionColumns: async (req, res) => {
        const table = req.params.table;
        // console.log(table);
        try {
            const MainTables = await new Promise((resolve, reject) => {
                //*productInventoryModel
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
            const TableName = await getTableName(table, MainTables, SubTables);
            const TableColumns = await new Promise((resolve, reject) => {
                productProductionModel.getTableColumns(TableName, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const Vendors = await new Promise((resolve, reject) => {
                productProductionModel.getVendors((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            // console.log(TableColumns);
            res.json({ TableColumns: TableColumns, Vendors: Vendors });
        } catch (error) {
            console.log("Error in getProductionColumns: ", error);
            res.status(500).send("Server Error");
        }
    },

    updateProductController: async (req, res) => {
        const { id, category, newChanges, MainTableEndIndex, DesEndIndex, ExtraImgEndIndex } = req.body;
        try {
            const MainTables = await new Promise((resolve, reject) => {
                //*productInventoryModel
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
            const TableName = await getTableName(category, MainTables, SubTables);
            console.log(TableName);

            //*------------------- Update Stock Values ------------------
            await new Promise((resolve, reject) => {
                productProductionModel.updateStockValues(id, MainTableEndIndex, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                });
            });
            //*------------------- Update Product Main table ------------------
            await new Promise((resolve, reject) => {
                productProductionModel.updateProductMainTable(id, TableName, MainTableEndIndex, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                });
            });
            //*------------------- Update Product old Description ------------------
            const updateDescriptions = async (DesEndIndex) => {
                for (const item of DesEndIndex) {
                    await new Promise((resolve, reject) => {
                        productProductionModel.updateProductOldDescription(item.value, item.no, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });
                }
            }
            if (DesEndIndex.length > 0) {
                await updateDescriptions(DesEndIndex);
            }


            //* ---------------------- Add New Descriptions ---------------------------
            if (newChanges.newAddedDes.length > 0) {
                await new Promise((resolve, reject) => {
                    productProductionModel.addNewDescription(id, TableName, newChanges.newAddedDes, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            }
            //*------------------------ Delete Descriptions ----------------------------------
            if (newChanges.DeletedDes.length > 0) {
                await new Promise((resolve, reject) => {
                    productProductionModel.deleteDescriptions(newChanges.DeletedDes, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            }

            //*------------------------ Delete Image ----------------------------------
            if (newChanges.DeletedImg.length > 0) {
                await new Promise((resolve, reject) => {
                    productProductionModel.deleteImages(newChanges.DeletedImg, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            }
            //* ----------------------- Add New Extra Images ---------------------------
            if (newChanges.newAddedImg.length > 0) {
                await new Promise((resolve, reject) => {
                    productProductionModel.addNewImages(id, TableName, newChanges.newAddedImg, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            }
            //* ----------------------- Update old Extra Images ---------------------------
            if (ExtraImgEndIndex.length > 0) {
                ExtraImgEndIndex.map(async (item) => {
                    await new Promise((resolve, reject) => {
                        productProductionModel.updateOldExtraImg(item.value, item.no, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });

                })
            }


            console.log('product updated successfully!');
            res.json({ message: 'product updated successfully!' });

        } catch (error) {
            console.log("Error in updateProductController: ", error);
            res.status(500).send("Server Error");
        }
    }
};
