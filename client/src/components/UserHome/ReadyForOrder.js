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
