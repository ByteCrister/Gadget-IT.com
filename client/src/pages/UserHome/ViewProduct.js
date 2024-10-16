import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../../context/useData';
import styles from '../../styles/HomePageStyles/ViewProduct.module.css';
import { GetMainTable } from '../../HOOKS/GetMainTable';
import UpperImage from '../../components/UserHome/UpperImage';
import UpperFeature from '../../components/UserHome/UpperFeature';
import { IoHomeSharp } from 'react-icons/io5';
import { MakeDefendants } from '../../HOOKS/MakeDefendants';


import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import RandomErrorPage from '../RandomErrorPage';
import ViewProductSwiper from '../../components/UserHome/ViewProductSwiper';
import RecentProducts from '../../components/UserHome/RecentProducts';
import ProductDescription from '../../components/UserHome/ProductDescription';
import UserQuestions from '../../components/UserHome/UserQuestions';
import UserRating from '../../components/UserHome/UserRating';

const ViewProduct = ({ setUserEntryState }) => {
    const { dataState, dispatch } = useContext(useData);
    const [MainTableData, setMainTableData] = useState([]);
    const [currSectionState, setCurrSectionState] = useState(1);

    const [isInvalidCategory, setIsInvalidCategory] = useState(false);

    const location = useLocation();
    const { category, 'product-id': product_id } = useParams();


    const [viewProduct, setViewProduct] = useState({
        images: [],
        productInformation: {},
        description: [],
        keyFeature: [],
        product_prices: {},
        RecentProducts: [],
        product_questions: [],
        product_ratings: []
    });

    const [QuestionAndReviewElement, setQuestionAndReviewElement] = useState({ product_name: '', product_id: '' });

    useEffect(() => {
        if (!category) {
            setIsInvalidCategory(true);
            return;
        }

        if (!dataState || !dataState.productStorage || !category || !product_id) return;

        const MainTable = GetMainTable(category, dataState.productStorage.category, dataState.productStorage.subCategory);
        if (!MainTable) return;

        const ProductTable = dataState.productStorage.product_table?.find(item => item.table === MainTable);
        if (!ProductTable) return;

        const productInformation = ProductTable.table_products?.find(item => Number(item.product_id) === Number(product_id));
        const productDescription = ProductTable.product_descriptions?.filter(item => Number(item.product_id) === Number(product_id));
        // console.log(productInformation);
        const productImages = productInformation?.image ? [productInformation.image] : [];
        const productKeyFeature = ProductTable.product_keyFeature?.filter(item => item.category === MainTable);
        const extraImages = ProductTable.product_extraImages?.filter(item => Number(item.product_id) === Number(product_id)).map(item => item.image);
        const relatedProducts = ProductTable.table_products?.filter(item => item.sub_category === productInformation.sub_category && item.main_category === category);
        const productPrices = dataState.productStorage.product_prices?.find(item => item.product_id === Number(product_id)) || {};
        const productQuestions = dataState.productStorage.product_questions.filter((question) => question.product_id === Number(product_id));
        const productRatings = dataState.productStorage.product_ratings.filter((rating) => rating.product_id === Number(product_id));
        // console.log(dataState.productStorage.product_ratings);

        setViewProduct((prev) => ({
            ...prev,
            productInformation: productInformation || {},
            description: productDescription || [],
            images: [...productImages, ...extraImages],
            keyFeature: productKeyFeature || [],
            product_prices: productPrices,
            RecentProducts: dataState.RecentProducts,
            product_questions: productQuestions,
            product_ratings: productRatings
        }));

        setMainTableData(relatedProducts || []);
        window.scrollTo(0, 0);
    }, [dataState.productStorage.product_ratings, product_id, category]);

    useEffect(() => {
        if (viewProduct.productInformation && viewProduct.productInformation.product_name && viewProduct.productInformation.product_id) {
            setQuestionAndReviewElement({
                product_name: viewProduct.productInformation.product_name,
                product_id: viewProduct.productInformation.product_id,
                path: location.pathname
            });
        }
    }, [viewProduct.productInformation, location.pathname]);


    useEffect(() => {
        dispatch({
            type: 'set_path_setting',
            payload: { prevPath: dataState.pathSettings.currPath, currPath: location.pathname }
        });
    }, [dispatch, location.pathname, dataState.pathSettings.currPath]);

    useEffect(() => {
        if (viewProduct && viewProduct.productInformation && viewProduct.images[0]) {
            const CurrProduct = {
                id: product_id,
                name: viewProduct.productInformation.product_name,
                price: viewProduct.product_prices.price,
                image: viewProduct.images[0],
                path: location.pathname
            };

            dispatch({
                type: 'set_recent_product',
                payload: CurrProduct
            });
        }
    }, [viewProduct, product_id, location.pathname, dispatch]);




    const getPrices = useCallback((product_id) => {
        const productPrice = dataState.productStorage.product_prices.find((item) => item.product_id === product_id);
        return productPrice ? productPrice.price : null;
    }, [dataState.productStorage.product_prices]);

    const relatedProductsMemo = useMemo(() => {
        const viewProductPrice = Number(viewProduct.product_prices?.price || 0);

        const lowerBound = viewProductPrice - (20 / 100) * viewProductPrice;
        const upperBound = viewProductPrice + (30 / 100) * viewProductPrice;

        return MainTableData.filter(item => item.product_id !== viewProduct.productInformation.product_id &&
            getPrices(item.product_id) >= lowerBound &&
            getPrices(item.product_id) <= upperBound);
    }, [MainTableData, getPrices, viewProduct.productInformation.product_id, viewProduct.product_prices.price]);




    if (isInvalidCategory) {
        return <RandomErrorPage />;
    }

    return (
        <section className={styles.view_product_container} id='view-product-main-container'>
            {/* ------------------------------------ category Descendant -------------------------- */}
            <section className={styles.categoryDescendant} id='top-section'>
                <div>
                    <IoHomeSharp className={styles.home_icon} />{' '}
                    {MakeDefendants(category, viewProduct.productInformation.sub_category)}
                </div>
            </section>

            {/* ----------------------------------- upper_image_and_feature ------------------------------ */}
            <section className={styles.upper_image_and_feature}>
                <UpperImage viewProduct={viewProduct} product_id={product_id} />
                <UpperFeature viewProduct={viewProduct} product_id={product_id} />
            </section>


            {/* -------------------------------------- related products ---------------------------------------- */}
            {relatedProductsMemo && relatedProductsMemo.length > 0 && (
                <section className={styles.readyForOrders}>
                    <span className={styles.product_cart_head}>Related Products</span>
                    <ViewProductSwiper relatedProductsMemo={relatedProductsMemo} />
                </section>
            )}

            {/* --------------------------------------- Section Buttons, Product Details and Recent product starts ---------------------------------------- */}
            <section className={styles.sections_and_recent_views} id='sections_and_recent_views'>
                {/* --------------------------------------- Buttons and details start ------------------------------------------- */}
                <section className={styles.main_sections}>
                    <div className={styles.section_buttons}>
                        <div className={styles.section_buttons_names}>
                            <span
                                className={currSectionState === 1 ? styles.section_buttons_names_active : styles.section_buttons_names_span}
                                onClick={() => setCurrSectionState(1)}
                            >
                                Specification
                            </span>
                            <span
                                className={currSectionState === 2 ? styles.section_buttons_names_active : styles.section_buttons_names_span}
                                onClick={() => setCurrSectionState(2)}
                            >
                                Description
                            </span>
                            <span
                                className={currSectionState === 3 ? styles.section_buttons_names_active : styles.section_buttons_names_span}
                                onClick={() => setCurrSectionState(3)}
                            >
                                Questions
                            </span>
                            <span
                                className={currSectionState === 4 ? styles.section_buttons_names_active : styles.section_buttons_names_span}
                                onClick={() => setCurrSectionState(4)}
                            >
                                Ratings
                            </span>
                        </div>
                        <div className={styles.hr}></div>
                    </div>

                    <div className={styles.main_section_contents}>
                        <div className={styles.section_name}>
                            <span>Specification</span>
                            <div className={styles.section_hr}></div>
                        </div>

                        {/*-------------- table start :  product main information ---------------  */}
                        <table>
                            <tbody>
                                {Object.entries(viewProduct.productInformation).map(([key, value]) => (
                                    key !== 'product_id' &&
                                    key !== 'hide' &&
                                    key !== 'main_category' &&
                                    key !== 'sub_category' &&
                                    key !== 'image' &&
                                    key !== 'vendor_no' &&
                                    value && (
                                        <tr key={key}>
                                            <td>{GetCategoryName(key)}</td>
                                            <td>{value}</td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                        {/* ----------------------- table end -------------------------- */}
                    </div>
                </section>
                {/* -------------------------------------------- Button and Detail ends ------------------------------------------ */}

                {/* ---------------------- Recent Product starts-------------------- */}
                <section className={styles.recent_views}>
                    <RecentProducts Products={viewProduct.RecentProducts} />
                </section>
                {/* ---------------------- Recent Product ends -------------------- */}
            </section>
            {/* ----------------------------------------------- Section Buttons, Product Details and Recent product Ends ---------------------------------------------- */}


            {/* ---------------------------------------- Product Description Starts -------------------------------------------- */}
            {
                viewProduct.description && viewProduct.description.length !== 0 && (
                    <section className={styles.ProductMainDescription}>
                        <ProductDescription Descriptions={viewProduct.description} />
                    </section>
                )
            }
            {/* ---------------------------------------- Product Description Ends -------------------------------------------- */}


            {/* ---------------------------------------- Question && Ratings -------------------------------------- */}
            <section className={styles.QuestionAndRating}>
                <UserQuestions setUserEntryState={setUserEntryState} askedQuestion={viewProduct.product_questions} QuestionAndReviewElement={QuestionAndReviewElement} />
                <UserRating setUserEntryState={setUserEntryState} ratings={viewProduct.product_ratings} QuestionAndReviewElement={QuestionAndReviewElement} />
            </section>
        </section>
    );
};

export default React.memo(ViewProduct);
