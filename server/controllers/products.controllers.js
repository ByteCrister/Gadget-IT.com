const productsModels = require("../models/products.models")
const createUrlPath = (names) => {
    return '/products/' + names.map(name => name.toLowerCase().replace(/ /g, '_')).join('/');
};
const buildNestedStructure = (categories, subCategories, parentName = null) => {
    const nestedCategories = categories
        .filter(category => parentName ? category.main_category_name === parentName : !category.main_category_name)
        .map(category => {
            const categoryUrlPart = createUrlPath([category.category_name]);
            const childCategories = buildNestedStructure(categories, subCategories, category.category_name);

            const nested = childCategories.length > 0 ? childCategories : undefined;

            return {
                id: category.category_no,
                title: category.category_name,
                url: categoryUrlPart,
                nested: nested
            };
        });

    const nestedSubCategories = subCategories
        .filter(subCategory => subCategory.main_category_name === parentName)
        .map(subCategory => {
            const subCategoryUrlPart = createUrlPath([parentName, subCategory.sub_category_name]);
            const childSubCategories = buildNestedStructure(categories, subCategories, subCategory.sub_category_name);

            return {
                id: subCategory.sub_category_no,
                title: subCategory.sub_category_name,
                url: subCategoryUrlPart,
                nested: childSubCategories.length > 0 ? childSubCategories : undefined
            };
        });

    return [...nestedCategories, ...nestedSubCategories];
};



const FindTableCategory = (tableName) => {
    return new Promise((resolve, reject) => {
        productsModels.getInitialMandatoryColumnsModel(tableName, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let arr = [];
                data.map((value) => {
                    arr.push(value.COLUMN_NAME);
                });
                console.log(arr);
                resolve(arr);
            }
        });
    });
}


// -----------------------------------------------------------------------------------
module.exports = {
    getProductCategories: (req, res) => {
        productsModels.getProductsCategoryModel((error, categories) => {
            if (error) {
                console.error('Error fetching categories:', error);
                res.status(500).json({ error: 'Failed to fetch categories' });
                return;
            }


            productsModels.getProductsSubCategory((error, subCategories) => {
                if (error) {
                    console.error('Error fetching sub-categories:', error);
                    res.status(500).json({ error: 'Failed to fetch sub-categories' });
                    return;
                }

                const dropdownData = buildNestedStructure(categories, subCategories);

                res.json(dropdownData);
            })
        })
    },

    getProductsCategoryNamesController: (req, res) => {

        console.log('runs - getProductsCategoryNamesController');

        productsModels.getProductsCategoryNamesModel((errCategory, categoryName) => {
            if (errCategory) {
                console.log(errCategory);
            } else {
                productsModels.getProductsSubCategoryNamesModel((errSubCategory, subCategoryName) => {
                    if (errSubCategory) {
                        console.log(errSubCategory);
                    } else {
                        let category_ = [];
                        let subCategory_ = [];

                        for (let i = 0; i < categoryName.length; i++) {
                            let numberOfSubCategory = subCategoryName.filter((value) => {
                                return value.main_category_name === categoryName[i].category_name;
                            });

                            if (numberOfSubCategory.length > 0) {
                                category_.push(categoryName[i].category_name)

                            }

                        }
                        for (let i = 0; i < subCategoryName.length; i++) {
                            let numberOfSubCategory = subCategoryName.filter((value) => {
                                return value.main_category_name === subCategoryName[i].sub_category_name;
                            });

                            if (numberOfSubCategory.length > 0) {
                                category_.push(subCategoryName[i].sub_category_name)
                            } else {
                                subCategory_.push(subCategoryName[i])

                            }

                        }

                        // console.log(subCategory_);
                        res.json({ categoryName: category_, subCategoryName: subCategory_ });
                    }
                })
            }
        })
    },

    getProductKeyValues: async (req, res) => {
        console.log('category - ' + req.params.mainCategory);
        try {
            const mainCategoryList = await new Promise((resolve, reject) => {
                productsModels.getProductsCategoryNamesModel((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const vendorNames = await new Promise((resolve, reject) => {
                productsModels.getVendorsNames((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            const isMain = mainCategoryList.some(value => value.category_name == req.params.mainCategory);

            if (!isMain) {
                const subCategoryList = await new Promise((resolve, reject) => {
                    productsModels.getProductsSubCategoryNamesModel((err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                for (let i = 0; i < subCategoryList.length; i++) {
                    if (req.params.mainCategory == subCategoryList[i].sub_category_name) {

                        const tableColumnNames = await FindTableCategory(subCategoryList[i].main_category_name);
                        console.log(tableColumnNames);
                        return res.json({ tableColumnNames: tableColumnNames, tableName: subCategoryList[i].main_category_name, vendorNames: vendorNames });
                    }
                }
            } else {

                const tableColumnNames = await FindTableCategory(req.params.mainCategory);
                console.log(tableColumnNames);
                return res.json({ tableColumnNames: tableColumnNames, tableName: req.params.mainCategory, vendorNames: vendorNames });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    }


}