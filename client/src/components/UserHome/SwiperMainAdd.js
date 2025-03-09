import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

    if(!dataState.UserHomeContents?.advertisements || !dataState.UserHomeContents) return <SkeletonLoader />

    return (
        dataState.UserHomeContents?.advertisements?.length > 0 && (
            <section className={styles.SectionOne}>
                <div className={styles.AddMainContainer}>
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
                        key={uuidv4()}
                    >
                        {
                            dataState.UserHomeContents?.advertisements.filter((item) => {
                                return item.position === 'main'
                            }).map((item, i) => {
                                return <SwiperSlide key={uuidv4()}>
                                    <img key={uuidv4()} src={item.img} alt={`Advertisement-${i}`} />
                                </SwiperSlide>
                            })
                        }
                    </Swiper>
                </div>

                <div className={styles.subCoverImg}>
                    {
                        dataState.UserHomeContents?.advertisements.filter((item) => {
                            return item.position === 'sub'
                        }).slice(0, 2).map((item, i) => {
                            return <img key={uuidv4()} src={item.img} alt={`Advertisement-${i}`} />
                        })
                    }
                </div>
            </section>
        )
    );
};

export default SwiperMainAdd;
