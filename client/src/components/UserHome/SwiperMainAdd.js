import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styles from '../../styles/HomePageStyles/SwiperMainAdd.module.css';
import image1 from '../../assets/main/iPhone-15-Pro-Max-Slider-2949.webp';
import image2 from '../../assets/main/Galaxy-Z-Fold6-Slider-3091.webp';

import img1 from '../../assets/sub/07_01-6712.jpg'
import img2 from '../../assets/sub/Apple-Airpods-pro-2nd-Gen-Type-C-4990.webp';

const SwiperMainAdd = () => {
    return (
        <section className={styles.SectionOne}>
            <div className={styles.AddMainContainer}>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={0} // No space between slides
                    slidesPerView={1} // Show one slide at a time
                    navigation
                    pagination={{ clickable: true }} // Enable clickable pagination
                    scrollbar={{ draggable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 seconds
                    loop={true}
                    className={styles.mySwiper} // Apply CSS module class
                >
                    <SwiperSlide>
                        <img src={image1} alt="Advertisement 1" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={image2} alt="Advertisement 2" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={image1} alt="Advertisement 3" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={image2} alt="Advertisement 4" />
                    </SwiperSlide>
                </Swiper>
            </div>

            <div className={styles.subCoverImg}>
                <img src={img1} alt='img1'></img>
                <img src={img2} alt='img2'></img>
            </div>
        </section>
    );
};

export default SwiperMainAdd;
