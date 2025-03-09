import React, { useContext } from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styles from '../../styles/HomePageStyles/SwiperMainAdd.module.css';
import { useData } from '../../context/useData';
import SkeletonLoader from '../ui/SkeletonLoader';

const SwiperMainAdd = () => {
    const { dataState } = useContext(useData);

    const hasAdvertisements = dataState.UserHomeContents?.advertisements?.length > 0;
    const advertisements = dataState.UserHomeContents?.advertisements || [];

    // ? Filter advertisements for main and sub positions
    const mainAds = advertisements.filter((item) => item.position === 'main');
    const subAds = advertisements.filter((item) => item.position === 'sub').slice(0, 2);

    return (
        <section className={styles.SectionOne}>
            {/* Main Ads Section */}
            <div className={styles.AddMainContainer}>
                {
                    !hasAdvertisements || mainAds.length === 0 ? (
                        <SkeletonLoader />
                    ) : (
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={true}
                            className={styles.mySwiper}
                        >
                            {mainAds.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <img src={item.img} alt={`Advertisement-${item.id}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )
                }
            </div>

            {/* Sub Ads Section */}
            <div className={styles.subCoverImg}>
                {
                    !hasAdvertisements || subAds.length === 0 ? (
                        <SkeletonLoader />
                    ) : (
                        subAds.map((item) => (
                            <img key={item.id} src={item.img} alt={`Advertisement-${item.id}`} />
                        ))
                    )
                }
            </div>
        </section>
    );
};

export default SwiperMainAdd;
