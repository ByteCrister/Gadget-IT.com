import React, { useContext } from 'react';
import { ImFire } from 'react-icons/im';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import styles from '../../styles/HomePageStyles/ReadyForOrder.module.css';
import { useData } from '../../context/useData';
import ProductCart from '../../HOOKS/ProductCart';

const ReadyForOrder = () => {
    const { dataState } = useContext(useData);
    const userHomeProducts = dataState?.UserHomeContents?.user_home_products || [];

    return (
        userHomeProducts.length > 0 && userHomeProducts &&
        <section className={styles.readyForOrders}>
            <h1>Ready for Order <ImFire className={styles.fire_icon} /></h1>
            <Swiper
                slidesPerView={5}
                spaceBetween={35}
                navigation={true}
                centeredSlides={true}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                modules={[Navigation, Autoplay]}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        centeredSlides: true,  
                        spaceBetween : 0
                    },
                    400: {
                        slidesPerView: 2,
                        centeredSlides: false, 
                    },
                    639: {
                        slidesPerView: 3,
                        centeredSlides: false,
                    },
                    865: {
                        slidesPerView: 4,
                        centeredSlides: false,
                    },
                    1000: {
                        slidesPerView: 5,
                        centeredSlides: false,
                    },
                    1500: {
                        slidesPerView: 6,
                        centeredSlides: false,
                    },
                    1700: {
                        slidesPerView: 7,
                        centeredSlides: false,
                    }
                }}
                className={styles.ready_carts}
            >
                {
                    userHomeProducts.length > 0 && userHomeProducts
                        .filter(item => item.position === 'ready_for_orders')
                        .map((item, i) => (
                            <SwiperSlide key={i}>
                                <ProductCart product={item} />
                            </SwiperSlide>
                        ))
                }
            </Swiper>
        </section>
    );
};

export default ReadyForOrder;
