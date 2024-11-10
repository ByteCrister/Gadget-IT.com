import React, { useContext, useEffect, useState } from 'react';
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { Link } from 'react-router-dom';

import styles from '../../styles/HomePageStyles/UserOfferCartPage.module.css';
import { useData } from '../../context/useData'

const Offers = () => {
    const { dataState } = useContext(useData);
    const [OfferCarts, setOfferCarts] = useState([]);
    useEffect(() => {
        if (dataState?.productStorage?.OfferStorage?.OfferCarts) {
            setOfferCarts(dataState.productStorage.OfferStorage.OfferCarts);
        }
        window.scrollTo(0, 0);
    }, [dataState]);

    if (!OfferCarts || OfferCarts.length === 0) {
        return <div className={styles['.no-offers']}>Sorry, currently no Offers available!</div>;
    }

    const getDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    return (
        <section className={styles['offer-cart-main-container']}>
            <section className={styles['offer-cart-carts-container']}>
                {
                    OfferCarts &&
                    OfferCarts.map((OfferCart) => {
                        return <div className={styles['offer-cart-cart']}>
                            <div className={styles['offer-cart-img']}>
                                <img src={OfferCart.cart_image} alt={'offer-img-' + OfferCart.cart_image}></img>
                            </div>
                            <div className={styles['cart-lower']}>
                                <div className={styles['offer-cart-date-and-title']}>
                                    <span className={styles['offer-cart-date']}><HiOutlineCalendarDays /> {getDate(OfferCart.offer_start)} - {getDate(OfferCart.offer_end)}</span>
                                    <span className={styles['offer-cart-title']}>{OfferCart.cart_title}</span>
                                </div>
                                <div className={styles['offer-cart-description-and-button']}>
                                    <span className={styles['offer-cart-description']}>{OfferCart.cart_description}</span>
                                    <Link to={`/offers/${OfferCart.cart_title}`} className={styles['offer-cart-button']}><button>View Details</button></Link>
                                </div>
                            </div>
                        </div>
                    })
                }
            </section>
        </section>
    )
};

export default Offers