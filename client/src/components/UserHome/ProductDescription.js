import React from 'react'
import styles from '../../styles/HomePageStyles/ProductDEscription.module.css';

const ProductDescription = ({ Descriptions }) => {
    return (
        <div className={styles.MainDescription}>
            {
                Descriptions && Descriptions.map((product) => {
                    return <div>
                        <span className={styles.DesHead}>{product.head}</span>
                        <span className={styles.DesValue}>{product.head_value}</span>
                    </div>
                })
            }
        </div>
    )
}

export default ProductDescription