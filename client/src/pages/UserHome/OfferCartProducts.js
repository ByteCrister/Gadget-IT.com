import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import styles from '../../styles/HomePageStyles/OfferCartProducts.module.css';
import { useData } from '../../context/useData';
import OfferCountdown from '../../HOOKS/OfferCountdown';
import ProductCart from '../../HOOKS/ProductCart';

const OfferCartProducts = () => {
    const { dataState } = useContext(useData);
    const { title } = useParams();
    const [OfferCartProductsStore, setOfferCartProductsStore] = useState({
        title: '',
        start: null,
        end: null,
        carts: [],
        store: [],
        prices: []
    });
    useEffect(() => {
        if (dataState?.productStorage?.OfferStorage?.OfferCarts && dataState?.productStorage?.OfferStorage?.OfferCartProducts && dataState?.productStorage?.product_prices) {
            const SelectedCart = dataState.productStorage.OfferStorage.OfferCarts.find((cart) => cart.cart_title === title) || dataState.productStorage.OfferStorage.OfferCarts[0];
            const selectedProductCarts = dataState.productStorage.OfferStorage.OfferCartProducts.filter((cart) => cart.offer_cart_no === SelectedCart.cart_no).sort((a, b) => a.serial_no - b.serial_no);
            let carts = [];
            selectedProductCarts.forEach((cart) => {
                dataState.productStorage.product_table.forEach((table) => {
                    table.table_products.forEach((product) => product.product_id === cart.product_id && carts.push(product));
                });
            });

            setOfferCartProductsStore({
                title: SelectedCart.cart_title,
                start: SelectedCart.offer_start,
                end: SelectedCart.offer_end,
                carts: [...carts],
                store: [...carts],
                prices: [...dataState.productStorage.product_prices]
            });
            window.scrollTo(0, 0);
        }

    }, [dataState.productStorage, title]);

    const getPrice = useCallback((product_id) => {
        return OfferCartProductsStore.prices.find((product) => product.product_id === product_id)?.price || 0;
    }, [OfferCartProductsStore.prices]);

    const handleSort = useCallback((e) => {
        let carts = [...OfferCartProductsStore.store];
        if (e.target.value === 'price-tow-to-high') {
            carts.sort((a, b) => getPrice(a.product_id) - getPrice(b.product_id));
        } else if (e.target.value === 'price-high-to-low') {
            carts.sort((a, b) => getPrice(b.product_id) - getPrice(a.product_id));
        }
        setOfferCartProductsStore((prev) => ({
            ...prev,
            carts: [...carts]
        }));
    }, [OfferCartProductsStore.store, getPrice]);


    return (
        <section className={styles['offer-main-products-container']}>
            <section className={styles['offer-main-products-upper']}>
                <div className={styles['offer-main-products-sort-section']}>
                    <span className={styles['offer-main-products-sort-text']}>{OfferCartProductsStore.title}</span>
                    <div className={styles['offer-main-products-sort-section-div']}>
                        <span>Sort by: </span>
                        <select onChange={handleSort}>
                            <option value={'default'}>Default</option>
                            <option value={'price-tow-to-high'}>Price Low to High</option>
                            <option value={'price-high-to-low'}>Price High to Low</option>
                        </select>
                    </div>
                </div>
                {<OfferCountdown startDate={OfferCartProductsStore.start} endDate={OfferCartProductsStore.end} />}
            </section>

            <section className={styles['offer-main-products-lower']}>
                {
                    OfferCartProductsStore.carts &&
                    OfferCartProductsStore.carts.length > 0 &&
                    OfferCartProductsStore.carts.map((product) => {
                        return <ProductCart product={product} />
                    })
                }
            </section>
        </section>
    )
}

export default React.memo(OfferCartProducts);