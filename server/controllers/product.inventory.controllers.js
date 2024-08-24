const productInventoryModel = require("../models/product.inventory.model");

const getTableName = (table, MainTables, SubTables) => {
    const mainTableExists = MainTables.some((item) => item.category_name === table);
    if (mainTableExists) {
        console.log(table);
        return table;
    } else {
        const subTable = SubTables.filter((item) => item.sub_category_name === table);
        if (subTable.length > 0) {
            return getTableName(subTable[0].main_category_name, MainTables, SubTables);
        } else {
            return null;
        }
    }
}


module.exports = {
    getInventoryController: async (req, res) => {
        try {
            let TableRows = [];
            const tables = await new Promise((resolve, reject) => {
                productInventoryModel.getTableNames((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });


            for (const table of tables) {
                const rows = await new Promise((resolve, reject) => {
                    productInventoryModel.getTableValues(table.category_name, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
                rows.forEach(element => {
                    TableRows.push(element);
                });
            }

            // console.log(TableRows);
            res.json(TableRows);

        } catch (error) {
            console.log('getInventoryController error : ' + error);
            res.status(500).send('Server Error');
        }
    },

    updateHideProduct: async (req, res) => {
        const { checkedItems } = req.body;
        try {
            const CheckedProducts = checkedItems.filter((items) => items.check === true);
            // console.log(CheckedProducts);
            
            // Fetching Main and Sub Tables
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
    
            // If there are checked products
            if (CheckedProducts.length !== 0) {
                const promises = CheckedProducts.map(async (items) => {
                    const TableName = await getTableName(items.table, MainTables, SubTables);
                    return new Promise((resolve, reject) => {
                        productInventoryModel.updateHide(items.id, TableName, items.hide, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });
                });
                
                await Promise.all(promises); 
                console.log('Products hide successfully!');
                res.json({ message: 'Products hide successfully' });
            } else {
                res.json({ message: 'No products selected to update' });
            }
        } catch (error) {
            console.log('updateHideProduct error : ' + error);
            res.status(500).send('Server Error');
        }
    },

    deleteProducts: async (req, res) => {
        const { checkedItems } = req.body;

        try {
            // Filter checked products
            const CheckedProducts = checkedItems.filter(item => item.check === true);

            // Get main and sub tables
            const [MainTables, SubTables] = await Promise.all([
                new Promise((resolve, reject) => {
                    productInventoryModel.getMainTables((err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                }),
                new Promise((resolve, reject) => {
                    productInventoryModel.getSubTables((err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                })
            ]);

            if (CheckedProducts.length === 0) {
                return res.json({ message: 'No products found to delete' });
            }

            // Perform delete operations
            await Promise.all(CheckedProducts.map(async (item) => {
                const TableName = await getTableName(item.table, MainTables, SubTables);

                // Delete from main table
                await new Promise((resolve, reject) => {
                    productInventoryModel.deleteProductsFromMainTable(item.id, TableName, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                // Delete from description table
                await new Promise((resolve, reject) => {
                    productInventoryModel.deleteProductsFromDescriptionTable(item.id, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                // Delete from extra image table
                await new Promise((resolve, reject) => {
                    productInventoryModel.deleteProductsFromExtraImageTable(item.id, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                // Delete from stock_products table
                await new Promise((resolve, reject) => {
                    productInventoryModel.deleteProductsStockFromTable(item.id, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

            }));


            res.json({ message: 'Products deleted successfully' });

        } catch (error) {
            console.log('Error in deleteProducts: ', error);
            res.status(500).send('Server Error');
        }
    }

}
