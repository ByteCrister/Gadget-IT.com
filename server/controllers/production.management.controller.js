const productionManageModel = require("../models/production.manage.model");
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

const getMainTableName = (category, SubCategory) => {
    while (1) {
        let parentCategory = SubCategory.find((item) => item.sub_category_name === category);
        if (!parentCategory) {
            return category;
        }
        category = parentCategory.main_category_name;
    }
};

const isChildEmpty = async (MainTable, category, SubCategory) => {
    let child = [category];
    while (true) {
        const isChild = SubCategory.find((item) => item.main_category_name === category);
        if (!isChild) {
            break;
        }
        child.push(isChild.sub_category_name);
        category = isChild.sub_category_name;
    }

    console.log(child);

    if (child && child.length !== 0) {
        for (let i = 0; i < child.length; i++) {
            try {
                const ProductsBySubCategory = await new Promise((resolve, reject) => {
                    productionManageModel.getProductsBySub(MainTable, child[i], (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                });
                if (ProductsBySubCategory && ProductsBySubCategory.length > 0) {
                    console.log('length: ');
                    console.log(ProductsBySubCategory.length);
                    return true;
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                return false;
            }
        }
    }

    return false;
};



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
        console.log('Main : ' + req.body.main + '  Sub : ' + req.body.sub);
        try {
            if (req.body.main === req.body.sub) {
                const deletedProductId = await new Promise((resolve, reject) => {
                    productionManageModel.getDeletedIdQuery(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                // **Deleting products from the offer carts, rating, question & product stock**
                deletedProductId.forEach(async (product) => {
                    await Promise.all([
                        new Promise((resolve, reject) => {
                            productionManageModel.deleteProductOfferCartQuery(product.product_id, (err, data) => {
                                if (err) reject(err);
                                else resolve(data);
                            });
                        }),
                        new Promise((resolve, reject) => {
                            productionManageModel.deleteProductRatingQuery(product.product_id, (err, data) => {
                                if (err) reject(err);
                                else resolve(data);
                            });
                        }),
                        new Promise((resolve, reject) => {
                            productionManageModel.deleteProductQuestionQuery(product.product_id, (err, data) => {
                                if (err) reject(err);
                                else resolve(data);
                            });
                        }),
                        new Promise((resolve, reject) => {
                            productionManageModel.deleteProductStockQuery(product.product_id, (err, data) => {
                                if (err) reject(err);
                                else resolve(data);
                            });
                        })
                    ]);
                });
                // **************   ****************
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
                    productionManageModel.deleteSortingOptionOfCategory(req.body.main, (err, data) => {
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
                //Delete from extra_images 
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteExtraImages(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete from featured category icon's 
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteFeaturedCategory(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete from home product select
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteHome_product_select(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });
                //Delete from home product select
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteHome_product_select(req.body.main, (err, data) => {
                        if (err) reject(err)
                        else resolve(data)
                    })
                });


                //*Delete sub category's of this main category
                await DeletingSubCategory(req.body.main, [req.body.main]);
            } else {
                //*Deleting product's with this sub category names
                const ReturnedNames = await new Promise((resolve, reject) => {
                    productionManageModel.getMainCategoryNames(req.body.main, (err, data) => {
                        if (err) reject(err)
                        resolve(data);
                    });
                });
                console.log(ReturnedNames);
                if (ReturnedNames && ReturnedNames.length > 0) {
                    await new Promise((resolve, reject) => {
                        productionManageModel.deleteProductsWithSubNames(req.body.sub, req.body.main, (err, data) => {
                            if (err) reject(err)
                            resolve(data);
                        });
                    });
                }
                //*Delete this subCategory and it's other sub category's
                await new Promise((resolve, reject) => {
                    productionManageModel.deleteSingleSubCategory(req.body.sub, req.body.main, (err, data) => {
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
        console.log('Main : ' + req.body.main + '  Sub : ' + req.body.sub);
        try {
            // **Is current category main or sub?**
            const CurrentCategory = req.body.main === req.body.sub ? req.body.main : req.body.sub
            if (req.body.main === CurrentCategory) {
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
            };

            await new Promise((resolve, reject) => {
                productionManageModel.renameSubCategoryOfMainName(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameSubCategoryOfSubName(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameSubCategoryOnDescription(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameCategoryOfSorting(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameCategoryOfKeyFeature(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameExtraImages(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameFeaturedIcons(CurrentCategory, req.body.newName, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            });
            await new Promise((resolve, reject) => {
                productionManageModel.renameHomeProduct(CurrentCategory, req.body.newName, (err, data) => {
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
    },

    getIsCategoryEmpty: async (req, res) => {
        const { category } = req.params;
        console.log('sub:', category);
        try {
            let isEmpty = false;

            // Check if it is a main category
            const MainCategory = await new Promise((resolve, reject) => {
                productionManageModel.getCat((err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });

            if (MainCategory.some((product) => product.category_name === category)) {
                const Products = await new Promise((resolve, reject) => {
                    productionManageModel.getProducts(category, (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                });
                isEmpty = Products && Products.length > 0;
                return res.send(isEmpty);
            } else {
                // Check if it's a subcategory
                const SubCategory = await new Promise((resolve, reject) => {
                    productionManageModel.getSubCat((err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                });

                const MainTable = getMainTableName(category, SubCategory);
                console.log('Table:', MainTable);

                const isCategoryHasProduct = await isChildEmpty(MainTable, category, SubCategory);
                console.log('isCategoryHasProduct?:', isCategoryHasProduct);
                return res.send(isCategoryHasProduct);
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed finding category empty status." });
        }
    }

}