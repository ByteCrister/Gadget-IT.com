import React, { useState } from 'react'
import styles from '../../styles/HomePageStyles/ViewProduct.module.css';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { Link } from 'react-router-dom';

const UpperFeature = ({ viewProduct, product_id }) => {
    const [stateNumber, setStateNumber] = useState(1);

    const getStatus = () => {
        const reserved = viewProduct.product_prices.reserved;
        const quantity = viewProduct.product_prices.quantity;

        return quantity === 0 ? 'Out of Stock' : quantity <= reserved ? 'Low Stock' : 'In Stock'
    }

    const handleNewState = (state) => {
        state === 'increment' ? setStateNumber((prev) => prev + 1) : stateNumber !== 1 && setStateNumber((prev) => prev - 1);
    }

    return (
        <div className={styles.upper_features}>

            <section className={styles.name_status}>
                <span className={styles.product_name}>{viewProduct.productInformation.product_name}</span>
                <div className={styles.product_status}>
                    <span>Price: <b>{viewProduct.product_prices.price}৳</b></span>
                    <span>Regular Price: <b><del>{viewProduct.product_prices.cut_price}৳</del></b></span>
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
                            <span>{GetCategoryName(item.key_feature_column)}:  {viewProduct.productInformation[item.key_feature_column]}</span>
                    })
                }
            </section>

            <section className={styles.purchase_buttons}>
                <div className={styles.decrease_increase}>
                    <button onClick={() => handleNewState('decrement')}>-</button>
                    <span>{stateNumber}</span>
                    <button onClick={() => handleNewState('increment')}>+</button>
                </div>

                <Link className={styles.buy_now}>
                    <button>Buy Now</button>
                </Link>

                <Link className={styles.add_to_cart}>
                    <button>Add to Cart</button>
                </Link>
            </section>
        </div>
    )
}

export default UpperFeature