import React from 'react'
import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/HomePageStyles/ProductDEscription.module.css';

const ProductDescription = ({ Descriptions }) => {
    return (
        <div className={styles.MainDescription}>
            {
                Descriptions && Descriptions.map((product) => {
                    return <div key={uuidv4()}>
                        <span className={styles.DesHead}>{product.head}</span>
                        <span className={styles.DesValue}>{product.head_value}</span>
                    </div>
                })
            }
        </div>
    )
}

export default ProductDescription