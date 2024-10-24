import React, { useContext } from 'react';
import styles from '../styles/HomePageStyles/ProductCart.module.css';
import { Link } from 'react-router-dom';
import { useData } from '../context/useData';

const ProductCart = ({ product }) => {
    const { dataState, dispatch } = useContext(useData);

    const getPrices = (product_id, keyState) => {
        const productPrice = dataState.productStorage.product_prices.find((item) => item.product_id === product_id);
        return productPrice ? productPrice[keyState] : null;
    };

    const price = product.price !== undefined && product.price !== null ? product.price : getPrices(product.product_id, 'price');
    const cutPrice = product.cut_price !== undefined && product.cut_price !== null ? product.cut_price : getPrices(product.product_id, 'cut_price');

    const discount = cutPrice ? Math.floor(((cutPrice - price) / cutPrice) * 100) : 0;

    return (
        <div className={styles['product-cart']}>
            <Link to={`/view/${product.main_category}/${product.product_id}`} className={styles.mainProductLink}>
                <div className={styles['discount-info']}>
                    {discount} % OFF
                </div>
                <div className={styles['product-image']}>
                    <img src={product.image} alt={`ready-for-order-image-${product.product_id}`} />
                </div>
                <div className={styles['product-name']}>{product.product_name}</div>
                <div className={styles['product-prices']}>
                    <span className={styles['price']}>{price}</span>
                    <span className={styles['crossed-price']}>{cutPrice}</span>
                </div>
            </Link>
            <div className={styles['buttons']}>
                <Link to={`/easy-checkout`}><button className={styles['buy-now']}>Buy Now</button></Link>
                <button onClick={() => dispatch({ type: 'add_product_to_cart', payload: product.product_id })} className={styles['add-to-cart']}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCart;
