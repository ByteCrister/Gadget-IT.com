import React, { useContext } from 'react';
import styles from '../styles/HomePageStyles/ProductCart.module.css';
import { Link } from 'react-router-dom';
import { useData } from '../context/useData';
import GetDiscountedPrice from '../HOOKS/GetDiscountedPrice';

const ProductCart = ({ product }) => {
    const { dataState, dispatch } = useContext(useData);

    const getPrices = (product_id, keyState) => {
        const productPrice = dataState.productStorage.product_prices.find((item) => item.product_id === product_id);
        return productPrice ? productPrice[keyState] : null;
    };

    const price = product.price !== undefined && product.price !== null ? product.price : getPrices(product.product_id, 'price');
    // console.log(product);
    const calculatedDiscountPrice = GetDiscountedPrice(price, product.discount_type, product.discount_value);
    const DiscountPrice = product.discount_type === 'percentage' ? `${product.discount_value}% OFF` : `৳${calculatedDiscountPrice}`;


    return (
        <div className={styles['product-cart']}>
            <Link to={`/view/${product.main_category}/${product.product_id}`} className={styles.mainProductLink}>
                {
                    product.discount_value !== 0 &&
                    <div className={styles['discount-info']}>
                        {DiscountPrice}
                    </div>

                }
                <div className={styles['product-image']}>
                    <img src={product.image} alt={`ready-for-order-image-${product.product_id}`} />
                </div>
                <div className={styles['product-name']}>{product.product_name}</div>
                <div className={styles['product-prices']}>
                    <span className={styles['price']}>{calculatedDiscountPrice}৳</span>
                    {product.discount_value !== 0 && <span className={styles['crossed-price']}>৳{price}</span>}
                </div>
            </Link>
            <div className={styles['buttons']}>
                <Link to={{ pathname: '/easy-checkout' }} state={{ source: 'product', product_id: Number(product.product_id), price: price, quantity: 1, image: product.image, main_category: product.main_category, product_name: product.product_name }} ><button className={styles['buy-now']}>Buy Now</button></Link>
                <button onClick={() => dispatch({ type: 'add_product_to_cart', payload: { product_id: Number(product.product_id), quantity: 1 } })} className={styles['add-to-cart']}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCart;
