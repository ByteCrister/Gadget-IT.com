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
    }
}