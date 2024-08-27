import React, { useContext } from 'react'
import { useData } from '../../context/useData';
import styles from '../../styles/HomePageStyles/FeaturedProducts.module.css';
import ProductCart from '../../HOOKS/ProductCart';

const NewArrival = () => {
    const { dataState } = useContext(useData);
    const userHomeProducts = dataState?.UserHomeContents?.user_home_products || [];

    return (
        userHomeProducts.length > 0 && userHomeProducts &&
        <section className={styles.mainFeaturedContainer}>
            <section>
                <span>New Arrival</span>
                <div></div>
            </section>
            <div>
                {
                    userHomeProducts.length > 0 && userHomeProducts
                        .filter(item => item.position === 'new_arrival')
                        .map((item, i) => (
                            <ProductCart product={item} key={i} />
                        ))
                }
            </div>
        </section>
    )
}

export default NewArrival