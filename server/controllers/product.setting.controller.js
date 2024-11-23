const performQuery = require("../config/performQuery");
const productSettingModel = require("../models/product.setting.model");

module.exports = {
    getProductSetting: async (req, res) => {
        try {
            const advertisement_img = await performQuery(productSettingModel.productSettingModel_advertisement);
            const featured_category_icon = await performQuery(productSettingModel.productSettingModel_featured_category);
            const home_product_select = await performQuery(productSettingModel.productSettingModel_home_product_select);
            const home_description = await performQuery(productSettingModel.productSettingModel_home_description);
            const offer_carts = await performQuery(productSettingModel.productSettingModel_OfferCarts);
            const offer_carts_products = await performQuery(productSettingModel.productSettingModel_OfferCartsProducts);
            const footer_information = await performQuery(productSettingModel.productSettingModel_footer);

            res.json({
                advertisement_img,
                featured_category_icon,
                home_product_select,
                home_description,
                offer_carts,
                offer_carts_products,
                footer_information: footer_information[0]
            });
        } catch (error) {
            console.log("Error in getProductSetting: ", error);
            res.status(500).send("Server Error");
        }
    },

    CrudImages: async (req, res) => {
        const { currentImages, deleteImages, addNewImages } = req.body;

        try {
            // Handle update of current images
            if (currentImages && currentImages.length > 0) {
                await Promise.all(currentImages.map(async (item) =>
                    await performQuery(productSettingModel.updateAdvertiseImages, item)
                ));
            }

            // Handle addition of new images
            if (addNewImages && addNewImages.length > 0) {
                await Promise.all(addNewImages.map(async (item) =>
                    await performQuery(productSettingModel.addNewAdvertisementImages, item)
                ));
            }

            // Handle deletion of images
            if (deleteImages && deleteImages.length > 0) {
                await Promise.all(deleteImages.map(async (item) =>
                    await performQuery(productSettingModel.deleteAdvertisementImages, item)
                ));
            }

            console.log('Advertisement images changed successfully!');
            res.json({ message: 'Advertisement images changed successfully!' });

        } catch (error) {
            console.log("Error in CrudImages: ", error);
            res.status(500).send("Server Error");
        }
    },

    CrudFeaturedImages: async (req, res) => {
        const { featuredImages } = req.body;
        console.log(featuredImages);
        try {
            const FeaturedIcons = await performQuery(productSettingModel.productSettingModel_featured_category);
            let deleteWithZero = featuredImages.filter((item) => item.serial_no === 0 || (item.main_category && item.main_category.length === 0));
            let deleteDefault = FeaturedIcons.filter((item) => !featuredImages.some((item_) => item_.icon_no === item.icon_no));
            let update = FeaturedIcons.filter((item) => featuredImages.some((item_) => item_.icon_no === item.icon_no));
            update = update.filter((item) => item.serial_no !== 0 && (item.main_category && item.main_category.length !== 0));
            let insertIcon = featuredImages.filter((item) => item.icon_no === -1 && item.serial_no !== 0 && item.main_category && item.main_category.length !== 0);
            // console.log('---------------------\n\n');
            // console.log('deleteWithZero: '+JSON.stringify(deleteWithZero, null, 2));
            // console.log('deleteDefault: '+JSON.stringify(deleteDefault, null, 2));
            // console.log('update: '+JSON.stringify(update, null, 2));
            // console.log('insertIcon: '+JSON.stringify(insertIcon, null, 2));
            if (deleteWithZero && deleteWithZero.length > 0) {
                deleteWithZero.forEach(async (item) => {
                    await performQuery(productSettingModel.deleteFeaturedImages, item.icon_no);
                });
            }
            if (deleteDefault && deleteDefault.length > 0) {
                deleteDefault.forEach(async (item) => {
                    await performQuery(productSettingModel.deleteFeaturedImages, item.icon_no);
                });
            }
            if (update && update.length > 0) {
                update.forEach(async (item) => {
                    await performQuery(productSettingModel.updateFeaturedImages, item);
                });
            }
            if (insertIcon && insertIcon.length > 0) {
                insertIcon.forEach(async (item) => {
                    await performQuery(productSettingModel.addNewFeaturedImages, item);
                });
            }
            console.log('Featured images changed successfully!');
            res.json({ message: 'Featured images changed successfully!' });


        } catch (error) {
            console.log("Error in CrudFeaturedImages: ", error);
            res.status(500).send("Server Error");
        }
    },

    CrudHomeProductSelect: async (req, res) => {
        const { productPosition } = req.body;

        try {
            let positionArr = [];
            Object.entries(productPosition).forEach(async ([position, positionArr_]) => {
                positionArr = [...positionArr, ...positionArr_];
            });
            const selectProduct = await performQuery(productSettingModel.productSettingModel_home_product_select);

            let deleteWithZero = positionArr.filter((product) => product.serial_no === 0);
            let defaultDelete = selectProduct.filter((product) => !positionArr.some((product_) => product_.product_id === product.product_id));
            let insertProduct = positionArr.filter((product) => product.serial_no !== 0 && !selectProduct.some((product_) => product_.product_id === product.product_id));
            let updateProduct = positionArr.filter((product) => product.serial_no !== 0 && selectProduct.some((product_) => product_.product_id === product.product_id));

            if (deleteWithZero && deleteWithZero.length !== 0) {
                deleteWithZero.forEach(async (product) => {
                    await performQuery(productSettingModel.deletePositionQuery, product.product_id);
                });
            }
            if (defaultDelete && defaultDelete.length !== 0) {
                defaultDelete.forEach(async (product) => {
                    await performQuery(productSettingModel.deletePositionQuery, product.product_id);
                });
            }
            if (updateProduct && updateProduct.length !== 0) {
                updateProduct.forEach(async (product) => {
                    await performQuery(productSettingModel.updatePositionQuery, product);
                });
            }
            if (insertProduct && insertProduct.length !== 0) {
                insertProduct.forEach(async (product) => {
                    await performQuery(productSettingModel.insertPositionQuery, product);
                });
            }

            // console.log('\n\n');
            // console.log('deleteWithZero: ' + JSON.stringify(deleteWithZero, null, 2));
            // console.log('defaultDelete: ' + JSON.stringify(defaultDelete, null, 2));
            // console.log('insertProduct: ' + JSON.stringify(insertProduct, null, 2));
            // console.log('updateProduct: ' + JSON.stringify(updateProduct, null, 2));
            res.status(200).send("Processing complete");
        } catch (error) {
            console.log("Error in CrudHomeProductSelect: ", error);
            res.status(500).send("Server Error");
        }
    },

    CrudHomeDescription: async (req, res) => {
        const { mainDes, newDes, deleteDes } = req.body;

        try {
            if (deleteDes && deleteDes.length > 0) {
                await Promise.all(deleteDes.map(async (item) => {
                    await performQuery(productSettingModel.deleteHomeDes, item)
                })
                )
            }

            if (mainDes && mainDes.length > 0) {
                await Promise.all(mainDes.map(async (item) => {
                    await performQuery(productSettingModel.updateHomeDes, item)
                }));
            }

            if (newDes && newDes.length > 0) {
                await Promise.all(newDes.map(async (item) => {
                    await performQuery(productSettingModel.newHomeDes, item);
                }));
            }

            console.log('Home view description updated successfully!');
            res.json({ message: 'Home view description updated successfully!' });

        } catch (error) {
            console.log("Error in CrudHomeDescription: ", error);
            res.status(500).send("Server Error");
        }
    },

    postNewOffer: async (req, res) => {
        try {
            await performQuery(productSettingModel.postNewOfferModel, req.body.formFillUp);
            const offers = await performQuery(productSettingModel.productSettingModel_OfferCarts, req.body.formFillUp);
            res.send(offers);
        } catch (error) {
            console.log("Error in post new offer: ", error);
            res.status(500).send("Server Error");
        }
    },

    updateOffer: async (req, res) => {
        try {
            await performQuery(productSettingModel.updateOffer, req.body.formUpdateFillUp);
            const offers = await performQuery(productSettingModel.productSettingModel_OfferCarts);
            res.send(offers);
        } catch (error) {
            console.log("Error in update offer: ", error);
            res.status(500).send("Server Error");
        }
    },

    deleteOfferCart: async (req, res) => {
        try {
            await performQuery(productSettingModel.deleteOffer, req.params.cart_no);
            await performQuery(productSettingModel.deleteOfferProductByCartNo, req.params.cart_no);
            const offers = await performQuery(productSettingModel.productSettingModel_OfferCarts);
            res.send(offers);
        } catch (error) {
            console.log("Error in update offer: ", error);
            res.status(500).send("Server Error");
        }
    },
    CrudOfferProducts: async (req, res) => {
        const { UpdatedProducts, OfferShouldDelete } = req.body;
        try {
            const UpdatedProducts_ = UpdatedProducts.filter((offer) => offer.offer !== 0);
            const CurrOfferCarts = await performQuery(productSettingModel.productSettingModel_OfferCartsProducts);

            let OfferShouldDelete_withZero = UpdatedProducts_.filter((offer) => {
                return CurrOfferCarts.length !== 0 && offer.serial_no === 0 && CurrOfferCarts.some((offer_) => offer_.product_id === offer.product_id);
            });
            let OffersShouldUpdate = UpdatedProducts_.filter((offer) => {
                return CurrOfferCarts.length !== 0 && CurrOfferCarts.some((offer_) => offer_.product_id === offer.product_id) && offer.serial_no !== 0;
            });
            let OfferShouldInsert = UpdatedProducts_.filter((offer) => {
                return (CurrOfferCarts.length === 0 || !CurrOfferCarts.some((offer_) => offer_.product_id === offer.product_id))
                    && (OffersShouldUpdate.length === 0 || !OffersShouldUpdate.some((offer_) => offer_.product_id === offer.product_id));
            });

            if (OfferShouldDelete && OfferShouldDelete.length > 0) {
                OfferShouldDelete.map(async (product_id) => {
                    await performQuery(productSettingModel.deleteOfferProduct, product_id);
                });
            }
            if (OfferShouldDelete_withZero && OfferShouldDelete_withZero.length > 0) {
                OfferShouldDelete_withZero.map(async (Product) => {
                    await performQuery(productSettingModel.deleteOfferProduct, Product.product_id);
                });
            }
            if (OffersShouldUpdate && OffersShouldUpdate.length > 0) {
                OffersShouldUpdate.map(async (Product) => {
                    await performQuery(productSettingModel.UpdateOfferProducts, Product);
                });
            }
            if (OfferShouldInsert && OfferShouldInsert.length > 0) {
                OfferShouldInsert.map(async (Product) => {
                    await performQuery(productSettingModel.insertOfferProducts, Product);
                });
            }

            const OffersProducts = await performQuery(productSettingModel.productSettingModel_OfferCartsProducts);
            res.send(OffersProducts);

        } catch (error) {
            console.log("Error in Crud Offer Products: ", error);
            res.status(500).send(error);
        }
    },

    updateFooter: async (req, res) => {
        try {
            await performQuery(productSettingModel.updateFooterQuery, req.body);
            res.status(201).send({ success: true });
        } catch (error) {
            console.log("Error in updateFooter: " + error.message);
            res.status(500).send(error);
        }
    }

};

