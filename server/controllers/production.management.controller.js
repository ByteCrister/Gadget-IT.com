const productionManageModel = require("../models/production.manage.model");

const DeletingSubCategory = async (category, subCategoryArr) => {
    try {
        const sub_s = await new Promise((resolve, reject) => {
            productionManageModel.searchForSubCategory(category, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        });

        if (sub_s && sub_s.length > 0) {
            await new Promise((resolve, reject) => {
                productionManageModel.deleteSubCategory(category, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            sub_s.map((item) => subCategoryArr.push(item.sub_category_name));
            subCategoryArr.shift()
            console.log(subCategoryArr);
            await DeletingSubCategory(subCategoryArr[0], subCategoryArr);

        } else if (subCategoryArr.length > 1) {
            subCategoryArr.shift();
            console.log(subCategoryArr);
            await DeletingSubCategory(subCategoryArr[0], subCategoryArr);

        } else {
            return;
        }

    } catch (error) {
        console.log(error);
        throw new Error("Failed to Delete Sub Categories");
    }
}

module.exports = {
    CreateNewCategoryController: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.CreateNewCategoryModel(req.body.newCategoryName, (err, data) => {
                    if (err) return reject(err)
                    resolve(data)
                })
            })
            await new Promise((resolve, reject) => {
                productionManageModel.insertNewMainCategoryModel(req.body.newCategoryName, (err, data) => {
                    if (err) return reject(err)
                    resolve(data)
                })
            })

            res.status(200).json({ message: "New Category Created Successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to Create new Category" });
        }
    },

    CreateNewSubCategory: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.insertNewSubCategoryModel(req.body.main, req.body.newSub, (err, data) => {
                    if (err) return reject(err)
                    else resolve(data)
                })
            })
            res.status(200).json({ message: "New Sub Category Created Successfully" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to Create new Sub Category" });
        }
    },

    DeleteCategory: async (req, res) => {
        try {
            if (req.body.main === req.body.sub) {
                //Delete the main category table
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteMainCategoryTable(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete the main category Name
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteMainCategoryName(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete all description of this table
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteDescription(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete all sorting options
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteSortingOptions(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete all key features
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteKeyFeaturesOption(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete sub category's of this main category
                await DeletingSubCategory(req.body.main, [req.body.main]);
            } else {
                //Delete this subCategory and it's other sub category's
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteSubCategory(req.body.sub, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                await DeletingSubCategory(req.body.sub, [req.body.sub]);
            }
            res.status(200).json({ message: 'Sub Category and Main Category Deleted Successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to Delete Category" });
        }
    },

    renameCategoryController: async (req, res) => {
        try {
            if (req.body.main === req.body.sub) {
                await new Promise((resolve, reject) => {
                    productionManageModel.renameMainCategoryTable(req.body.main, req.body.newName, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                await new Promise((resolve, reject) => {
                    productionManageModel.renameMainCategoryNameTable(req.body.main, req.body.newName, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                })
            }
            await new Promise((resolve, reject) => {
                productionManageModel.renameSubCategoryOfMainName(req.body.sub, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameSubCategoryOfSubName(req.body.sub, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameSubCategoryOnDescription(req.body.sub, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameCategoryOfSorting(req.body.sub, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameCategoryOfKeyFeature(req.body.sub, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            res.status(200).json({ message: "Renaming Category successful" });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed renaming Category" });
        }
    },

    addNewColumn: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.addNewColumnModel(req.body.table, req.body.newColumnName, req.body.insertAfter, (err, data) => {
                    if (err) reject(err)
                    else resolve(data);
                })
            })
            res.status(200).json({ message: 'added new column successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed Adding new column" });
        }
    },
    deleteColumn: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.deleteColumnModel(req.body.table, req.body.column, (err, data) => {
                    if (err) reject(err)
                    else resolve(data);
                })
            })
            res.status(200).json({ message: 'column deleted successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed deleting column" });
        }
    },

    renameColumn: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.renameColumnModel(req.body.table, req.body.oldName, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data);
                })
            })
            res.status(200).json({ message: 'column renamed successfully' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed renaming column" });
        }
    },

    insertNewSortingOption: async (req, res) => {
        const { category, change_sort_by_names } = req.body;
        try {

            await new Promise((resolve, reject) => {
                productionManageModel.deleteSortingOptionOfCategory(category, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });

            if (change_sort_by_names.newSort.length > 0) {
                change_sort_by_names.newSort.map(async (item) => {
                    await new Promise((resolve, reject) => {
                        productionManageModel.insertNewSortingModel(item, (err, data) => {
                            if (err) reject(err)
                            else resolve(data)
                        })
                    })
                });
            };

            res.status(201).json({ message: 'New Sort Option Created.' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed inserting new Sort." });
        }
    },

    // deleteSortingOption: async (req, res) => {
    //     try {
    //         await new Promise((resolve, reject) => {
    //             productionManageModel.deleteSortingOptionModel(req.body.category, req.body.column, (err, data) => {
    //                 if (err) reject(err)
    //                 else resolve(data)
    //             })
    //         })
    //         res.status(200).json({ message: 'Deleted Sort Option.' });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ error: "Failed deleting  Sort option." });
    //     }
    // },

    insertNewKeyFeature: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.insertNewKeyFeatureModel(req.body.category, req.body.column, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            })
            res.status(200).json({ message: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed inserting new key feature." });
        }
    },

    deleteKeyFeature: async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                productionManageModel.deleteKeyFeatureModel(req.body.category, req.body.column, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            })
            res.status(200).json({ message: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed deleting key feature." });
        }
    }

}