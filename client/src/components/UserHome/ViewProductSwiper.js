import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from '../../styles/HomePageStyles/ViewProduct.module.css'
import ProductCart from '../../HOOKS/ProductCart';

const ViewProductSwiper = ({ relatedProductsMemo }) => {
    return (
        <Swiper
            slidesPerView={5}
            spaceBetween={50}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            modules={[Navigation, Autoplay]}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                },
                400: {
                    slidesPerView: 2,
                },
                639: {
                    slidesPerView: 3,
                },
                865: {
                    slidesPerView: 4
                },
                1000: {
                    slidesPerView: 5
                },
                1500: {
                    slidesPerView: 6
                },
                1700: {
                    slidesPerView: 7
                }
            }}
            centeredSlides={true}
            className={styles.ready_carts}
        >
            {relatedProductsMemo.map(item => (
                <SwiperSlide key={item.product_id}>
                    <ProductCart product={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default ViewProductSwiper