import React from 'react'
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/HomePageStyles/RecentView.module.css';

const RecentProducts = ({ Products }) => {
  
    return (
        <section key={uuidv4()} className={styles.RecentSection}>
            <div className={styles.SectionName}>
                <span>Recently Viewed</span>
                <hr></hr>
            </div>

            {
                Products && Products.map((product, index) => {
                    return <>
                        <div key={uuidv4()} className={styles.MainRecentCart}>
                            <Link to={product.path}><div className={styles.RecentCartImage}><img src={product.image} alt={product.name}></img></div></Link>
                            <div className={styles.RecentCartNames}>
                                <Link to={product.path}><span className={styles.R_name}>{product.name}</span></Link>
                                <span className={styles.R_price}>{product.price}৳</span>
                                <Link to={{ pathname: '/easy-checkout' }}
                                    state={{
                                        source: 'product',
                                        product_id: Number(product.id),
                                        price: product.price,
                                        quantity: 1,
                                        image: product.image,
                                        main_category: product.path.split('/')[1],
                                        product_name: product.name
                                    }}>
                                    <button className={styles.buyNowButton}>Buy Now</button>
                                </Link>
                            </div>
                        </div>
                        {
                            index !== Products.length - 1 ? <hr className={styles.div_hr}></hr> : null
                        }
                    </>
                })
            }
        </section>
    )
}

export default RecentProducts