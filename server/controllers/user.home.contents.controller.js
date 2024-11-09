require('dotenv').config();
const productSettingModel = require("../models/product.setting.model");
const productsModels = require("../models/products.models");
const userHomeContentsModel = require("../models/user.home.contents.model");

const passport = require('passport');
const authenticateUser = (req, res, next, callback) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred during authentication' });
        }
        if (!user) {
            if (info && info.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            } else if (info && info.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
            } else {
                return res.status(401).json({ message: 'Unauthorized. Token is missing or invalid.' });
            }
        }
        callback(user);
    })(req, res, next);
};

const performQuery = async (queryFunction, ...params) => {
    return await new Promise((resolve, reject) => {
        queryFunction(...params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

module.exports = {
    getUserHomeContents: async (req, res) => {
        try {
            let user_home_products = [];

            // Fetch category names
            const category = await performQuery(productsModels.getProductsCategoryNamesModel);

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
            const advertisements = await performQuery(userHomeContentsModel.getAdvertisement);

            // Fetch home descriptions
            const home_descriptions = await performQuery(userHomeContentsModel.getHomeDescription);

            // Fetch home featured icons
            const featured_icon = await performQuery(userHomeContentsModel.getFeaturedIcon);

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
            const category = await performQuery(productsModels.getProductsCategoryNamesModel);
            const subCategory = await performQuery(productsModels.getProductsSubCategoryNamesModel);

            // Use Promise.all to wait for all promises to resolve
            const product_table = await Promise.all(
                category.map(async (item) => {

                    const table_products = await performQuery(userHomeContentsModel.getProductFromTable, item.category_name);
                    const product_extraImages = await performQuery(userHomeContentsModel.getProductExtraImages, item.category_name);
                    const product_descriptions = await performQuery(userHomeContentsModel.getProductDescriptions, item.category_name);
                    const product_keyFeature = await performQuery(userHomeContentsModel.getProductKeyFeature, item.category_name);
                    const product_sorting = await performQuery(userHomeContentsModel.getProductSorting, item.category_name);

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

            const product_prices = await performQuery(userHomeContentsModel.getProductPrices);
            const product_questions = await performQuery(userHomeContentsModel.getProductQuestions);
            const product_ratings = await performQuery(userHomeContentsModel.getProductRatings);

            const OfferStorage = {
                OfferCarts: await performQuery(productSettingModel.productSettingModel_OfferCarts),
                OfferCartProducts: await performQuery(productSettingModel.productSettingModel_OfferCartsProducts)
            };

            res.json({
                category: category,
                subCategory: subCategory,
                product_table: product_table,
                product_prices: product_prices,
                product_questions: product_questions,
                product_ratings: product_ratings,
                OfferStorage: OfferStorage
            });

        } catch (error) {
            console.log("Failed getUserProducts:", error);
            res.status(500).json({ error });
        }
    }

};