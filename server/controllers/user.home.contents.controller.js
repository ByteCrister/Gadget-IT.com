const productsModels = require("../models/products.models");
const userHomeContentsModel = require("../models/user.home.contents.model");

module.exports = {
    getUserHomeContents: async (req, res) => {
        try {
            let user_home_products = [];

            // Fetch category names
            const category = await new Promise((resolve, reject) => {
                productsModels.getProductsCategoryNamesModel((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            for (const item of category) {
                const product = await new Promise((resolve, reject) => {
                    userHomeContentsModel.getHomeProduct(item.category_name, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                if (product && product.length > 0) {
                    product.forEach((item) => {
                        user_home_products.push(item);
                    });
                }
            }

            // Fetch advertisements
            const advertisements = await new Promise((resolve, reject) => {
                userHomeContentsModel.getAdvertisement((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            // Fetch home descriptions
            const home_descriptions = await new Promise((resolve, reject) => {
                userHomeContentsModel.getHomeDescription((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            // Fetch home featured icons
            const featured_icon = await new Promise((resolve, reject) => {
                userHomeContentsModel.getFeaturedIcon((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            // console.log(JSON.stringify(home_descriptions, null, 2));

            res.json({
                user_home_products: user_home_products,
                advertisements: advertisements,
                home_descriptions: home_descriptions,
                featured_icon: featured_icon
            });

        } catch (error) {
            console.log("Failed getUserHomeContents");
            res.status(500).json({ error });
        }
    },

    getUserProducts: async (req, res) => {
        try {
            const category = await new Promise((resolve, reject) => {
                productsModels.getProductsCategoryNamesModel((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
    
            const subCategory = await new Promise((resolve, reject) => {
                productsModels.getProductsSubCategoryNamesModel((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
    
            // Use Promise.all to wait for all promises to resolve
            const product_table = await Promise.all(
                category.map(async (item) => {
                    const table_products = await new Promise((resolve, reject) => {
                        userHomeContentsModel.getProductFromTable(item.category_name, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });
    
                    const product_extraImages = await new Promise((resolve, reject) => {
                        userHomeContentsModel.getProductExtraImages(item.category_name, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });
    
                    const product_descriptions = await new Promise((resolve, reject) => {
                        userHomeContentsModel.getProductDescriptions(item.category_name, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });
    
                    const product_keyFeature = await new Promise((resolve, reject) => {
                        userHomeContentsModel.getProductKeyFeature(item.category_name, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });
    
                    const product_sorting = await new Promise((resolve, reject) => {
                        userHomeContentsModel.getProductSorting(item.category_name, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });

    
                    // Return the structured product data
                    return {
                        table: item.category_name,
                        table_products,
                        product_extraImages,
                        product_descriptions,
                        product_keyFeature,
                        product_sorting
                    };
                })
            );

            const product_prices = await new Promise((resolve, reject) => {
                userHomeContentsModel.getProductPrices((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const product_questions = await new Promise((resolve, reject) => {
                userHomeContentsModel.getProductQuestions((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            const product_ratings = await new Promise((resolve, reject) => {
                userHomeContentsModel.getProductRatings((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });



    
            
            // console.log(product_table);
            res.json({
                category: category,
                subCategory: subCategory,
                product_table: product_table,
                product_prices :  product_prices,
                product_questions : product_questions,
                product_ratings : product_ratings
            });
    
        } catch (error) {
            console.log("Failed getUserProducts:", error);
            res.status(500).json({ error });
        }
    }
    
};
