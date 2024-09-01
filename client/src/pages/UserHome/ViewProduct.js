import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../../context/useData';
import styles from '../../styles/HomePageStyles/ViewProduct.module.css';
import { GetMainTable } from '../../HOOKS/GetMainTable';
import UpperImage from '../../components/UserHome/UpperImage';
import UpperFeature from '../../components/UserHome/UpperFeature';
import { IoHomeSharp } from 'react-icons/io5';
import { MakeDefendants } from '../../HOOKS/MakeDefendants';
import ProductCart from '../../HOOKS/ProductCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import RandomErrorPage from '../RandomErrorPage';

const ViewProduct = () => {
    const { dataState, dispatch } = useContext(useData);
    const [viewProduct, setViewProduct] = useState({
        images: [],
        productInformation: {},
        description: [],
        ratings: [],
        askedQuestion: [],
        keyFeature: [],
        product_prices: {}
    });
    const [MainTableData, setMainTableData] = useState([]);
    const [currSectionState, setCurrSectionState] = useState(1);

    const [isInvalidCategory, setIsInvalidCategory] = useState(false);

    const location = useLocation();
    const { category, 'product-id': product_id } = useParams();


    useEffect(() => {
        if (!category) {
            setIsInvalidCategory(true);
            return;
        }

        if (!dataState || !category || !product_id) return;

        const MainTable = GetMainTable(category, dataState.productStorage.category, dataState.productStorage.subCategory);
        if (!MainTable) return;

        const ProductTable = dataState.productStorage.product_table?.find(item => item.table === MainTable);
        if (!ProductTable) return;

        const productInformation = ProductTable.table_products?.find(item => Number(item.product_id) === Number(product_id));
        const productDescription = ProductTable.product_descriptions?.filter(item => Number(item.product_id) === Number(product_id));
        const productImages = productInformation?.image ? [productInformation.image] : [];
        const productKeyFeature = ProductTable.product_keyFeature?.filter(item => item.category === MainTable);
        const extraImages = ProductTable.product_extraImages?.filter(item => Number(item.product_id) === Number(product_id)).map(item => item.image);

        const relatedProducts = ProductTable.table_products?.filter(item => item.sub_category === productInformation.sub_category);

        setViewProduct({
            productInformation,
            description: productDescription,
            images: [...productImages, ...extraImages],
            keyFeature: productKeyFeature,
            product_prices: dataState.productStorage.product_prices?.find(item => item.product_id === Number(product_id))
        });

        setMainTableData(relatedProducts || []);

    }, [category, product_id, dataState]);

    useEffect(() => {
        dispatch({
            type: 'set_path_setting',
            payload: { prevPath: dataState.pathSettings.currPath, currPath: location.pathname }
        });
    }, [dispatch, location.pathname, dataState.pathSettings.currPath]);

    const relatedProductsMemo = useMemo(() => {
        return MainTableData?.filter(item => item.product_id !== viewProduct.productInformation.product_id);
    }, [MainTableData, viewProduct.productInformation.product_id]);

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
            {MainTableData.length > 0 && (
                <section className={styles.readyForOrders}>
                    <h1>Related Products</h1>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        navigation
                        autoplay={{ delay: 10000, disableOnInteraction: false }}
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 5 },
                            768: { slidesPerView: 3, spaceBetween: 10 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                            1280: { slidesPerView: 6, spaceBetween: 30 }
                        }}
                        className={styles.ready_carts}
                    >
                        {relatedProductsMemo.map(item => (
                            <SwiperSlide key={item.product_id}>
                                <ProductCart product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            )}

            {/* --------------------------------------- sections_and_recent_views ---------------------------------------- */}
            <section className={styles.sections_and_recent_views} id='sections_and_recent_views'>
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
                    </div>
                </section>

                <section className={styles.recent_views}>
                    Hi, this is me!
                </section>
            </section>
        </section>
    );
};

export default React.memo(ViewProduct);
