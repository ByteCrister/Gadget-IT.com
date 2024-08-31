import React, { useContext, useEffect, useState } from 'react';
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
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';

const ViewProduct = () => {
    const { dataState, dispatch } = useContext(useData);
    const [viewProduct, setViewProduct] = useState({
        images: [],
        productInformation: [],
        description: [],
        ratings: [],
        askedQuestion: [],
        keyFeature: [],
        product_prices: {}
    });
    const [MainTableData, setMainTableData] = useState([]);
    const [currSectionState, setCurrSectionState] = useState(1);

    const location = useLocation();

    const params = useParams();
    const { category, 'product-id': product_id } = params;

    useEffect(() => {
        if (!dataState || !dataState.productStorage || !category || !product_id) {
            return;
        }

        const MainTable = GetMainTable(category, dataState.productStorage.category, dataState.productStorage.subCategory);

        if (!MainTable) return;
        const ProductTable = dataState.productStorage.product_table?.find((item) => item.table === MainTable);

        if (!ProductTable) return;


        const productInformation = ProductTable.table_products?.find((item) => Number(item.product_id) === Number(product_id));
        const productDescription = ProductTable.product_descriptions?.filter((item) => Number(item.product_id) === Number(product_id));
        const productImages = productInformation?.image ? [productInformation.image] : [];
        const productKeyFeature = ProductTable.product_keyFeature?.filter((item) => item.category === MainTable);

        const extraImages = ProductTable.product_extraImages?.filter((item) => Number(item.product_id) === Number(product_id)).map((item) => item.image);

        setMainTableData((prev) => ProductTable.table_products?.filter((item) => item.sub_category === productInformation.sub_category));

        setViewProduct((prev) => ({
            ...prev,
            productInformation,
            description: productDescription,
            images: [...productImages, ...extraImages],
            keyFeature: productKeyFeature,
            product_prices: dataState.productStorage.product_prices.find((item) => item.product_id === Number(product_id))
        }));

    }, [category, product_id, dataState]);

    useEffect(() => {
        dispatch({ type: 'set_path_setting', payload: { prevPath: dataState.pathSettings.currPath, currPath: location.pathname } });
    }, [dispatch, dataState.pathSettings.currPath, location.pathname]);


    return (
        <section className={styles.view_product_container}>
            <section className={styles.categoryDescendant} id='top-section'>
                <div>
                    <IoHomeSharp className={styles.home_icon} />{' '}
                    {
                        MakeDefendants(category, viewProduct.productInformation.sub_category)
                    }
                </div>
            </section>

            <section className={styles.upper_image_and_feature}>

                <UpperImage viewProduct={viewProduct} product_id={product_id} />

                <UpperFeature viewProduct={viewProduct} product_id={product_id} />
            </section>

            {
                MainTableData.length > 0 && MainTableData &&
                <section className={styles.readyForOrders}>
                    <h1>Related Products</h1>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        navigation={true}
                        autoplay={{
                            delay: 10000,
                            disableOnInteraction: false,
                        }}
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 5 },
                            768: { slidesPerView: 3, spaceBetween: 10 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                            1280: { slidesPerView: 6, spaceBetween: 30 }
                        }}
                        className={styles.ready_carts}
                    >
                        {

                            MainTableData.filter(item => item.sub_category === viewProduct.productInformation.sub_category && item.product_id !== viewProduct.productInformation.product_id)
                                .map((item, i) => (
                                    <SwiperSlide key={i}>
                                        <ProductCart product={item} />
                                    </SwiperSlide>
                                ))
                        }
                    </Swiper>
                </section>
            }




            <section className={styles.sections_and_recent_views} id='sections_and_recent_views'>
                <section className={styles.main_sections}>
                    <div className={styles.section_buttons}>
                        <div className={styles.section_buttons_names}>
                            <span className={currSectionState === 1 ? styles.section_buttons_names_active : styles.section_buttons_names_span} onClick={() => setCurrSectionState(1)}>Specification</span>
                            <span className={currSectionState === 2 ? styles.section_buttons_names_active : styles.section_buttons_names_span} onClick={() => setCurrSectionState(2)}>Description</span>
                            <span className={currSectionState === 3 ? styles.section_buttons_names_active : styles.section_buttons_names_span} onClick={() => setCurrSectionState(3)}>Questions</span>
                            <span className={currSectionState === 4 ? styles.section_buttons_names_active : styles.section_buttons_names_span} onClick={() => setCurrSectionState(4)}>Ratings</span>
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
                                {
                                    Object.keys(viewProduct.productInformation).map(key => {
                                        return key !== 'product_id' &&
                                            key !== 'hide' &&
                                            key !== 'main_category' &&
                                            key !== 'sub_category' &&
                                            key !== 'image' &&
                                            key !== 'vendor_no' &&
                                            viewProduct.productInformation[key] &&
                                            viewProduct.productInformation[key].length > 0 &&
                                            <tr>
                                                <td>{GetCategoryName(key)}</td>
                                                <td>{viewProduct.productInformation[key]}</td>
                                            </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                </section>

                <section className={styles.recent_views}>
                    Hi this is me!
                </section>
            </section>


        </section>
    );
};

export default React.memo(ViewProduct);
