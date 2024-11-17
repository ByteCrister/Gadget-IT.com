import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/HomePageStyles/ViewProduct.module.css';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { useData } from '../../context/useData';
import GetDiscountedPrice from '../../HOOKS/GetDiscountedPrice';

const UpperFeature = ({productInformation, viewProduct, product_id, price, image, category, product_name }) => {

    const { dispatch } = useContext(useData);
    const [stateNumber, setStateNumber] = useState(1);


    const getStatus = () => {
        const reserved = viewProduct.product_prices.reserved;
        const quantity = viewProduct.product_prices.quantity;

        return quantity === 0 ? 'Out of Stock' : quantity <= reserved ? 'Low Stock' : 'In Stock'
    }

    const handleNewState = (state) => {
        state === '+' ? setStateNumber((prev) => prev + 1) : stateNumber !== 1 && setStateNumber((prev) => prev - 1);
    }

    return (
        <div className={styles.upper_features}>

            <section className={styles.name_status}>
                <span className={styles.product_name}>{viewProduct.productInformation.product_name}</span>
                <div className={styles.product_status}>
                    <span>Price: <b>{GetDiscountedPrice(viewProduct.product_prices.price, productInformation.discount_type, productInformation.discount_value)}৳</b></span>
                    <span>Regular Price: <b><del>{viewProduct.product_prices.price}৳</del></b></span>
                    <span>Status: <b>{getStatus()}</b></span>
                    <span>Brand: <b>{viewProduct.productInformation.brand}</b></span>
                </div>
            </section>

            <section className={styles.key_features}>
                <span className={styles.feature_head}>
                    Key Features
                </span>
                {
                    viewProduct.keyFeature.map((item) => {
                        return viewProduct.productInformation[item.key_feature_column] &&
                            <span key={uuidv4()}>{GetCategoryName(item.key_feature_column)}:  {viewProduct.productInformation[item.key_feature_column]}</span>
                    })
                }
            </section>

            <section className={styles.purchase_buttons}>
                <div className={styles.decrease_increase}>
                    <button onClick={() => handleNewState('-')}>-</button>
                    <span>{stateNumber}</span>
                    <button onClick={() => handleNewState('+')}>+</button>
                </div>

                <Link className={styles.buy_now} to={{ pathname: '/easy-checkout' }} state={{ source: 'product', product_id: Number(product_id), price: price, quantity: stateNumber, image: image, main_category: category, product_name: product_name }}>
                    <button>Buy Now</button>
                </Link>

                <button className={styles.add_to_cart} onClick={() => dispatch({ type: 'add_product_to_cart', payload: { product_id: Number(product_id), quantity: stateNumber } })}>Add to Cart</button>
            </section>
        </div>
    )
}

export default UpperFeature