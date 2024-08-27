import React, { useContext } from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styles from '../../styles/HomePageStyles/SwiperMainAdd.module.css';
import { useData } from '../../context/useData';

const SwiperMainAdd = () => {
    const { dataState } = useContext(useData);

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
                    >
                        {
                            dataState.UserHomeContents?.advertisements.filter((item) => {
                                return item.position === 'main'
                            }).map((item, i) => {
                                return <SwiperSlide>
                                    <img src={item.img} alt={`Advertisement-${i}`} />
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
                            return <img src={item.img} alt={`Advertisement-${i}`} />
                        })
                    }
                </div>
            </section>
        )
    );
};

export default SwiperMainAdd;
