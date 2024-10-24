import React from 'react'
import styles from '../../styles/HomePageStyles/RecentView.module.css';
import { Link } from 'react-router-dom';

const RecentProducts = ({ Products }) => {
    return (
        <section className={styles.RecentSection}>
            <div className={styles.SectionName}>
                <span>Recently Viewed</span>
                <hr></hr>
            </div>

            {
                Products && Products.map((product, index) => {
                    return <>
                        <div className={styles.MainRecentCart}>
                            <Link to={product.path}><div className={styles.RecentCartImage}><img src={product.image} alt={product.name}></img></div></Link>
                            <div className={styles.RecentCartNames}>
                                <Link to={product.path}><span className={styles.R_name}>{product.name}</span></Link>
                                <span className={styles.R_price}>{product.price}৳</span>
                                <Link><button className={styles.buyNowButton}>Buy Now</button></Link>
                            </div>
                        </div>
                        {
                            index !== Products.length-1 ? <hr className={styles.div_hr}></hr> : null
                        }
                    </>
                })
            }
        </section>
    )
}

export default RecentProducts