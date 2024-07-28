import React from 'react';
import styles from '../../styles/AdminHome/PageThree.module.css';

const ProductionTableManage = ({ data }) => {
  const data1 = data.data1 || [];
  const data2 = data.data2?.map((value2) => value2.head_points)[0] || [];

  return (
    <section className={styles.ProductTableManageMainContainer}>
      {data1.map((value1) => (
        <div key={value1.productId} className={styles.ProductEntry}>
          <div className={styles.ProductInfo}>
            <p className={styles.ProductDetail}>Product ID: {value1.productId}</p>
            <p className={styles.ProductDetail}>Name: {value1.productName}</p>
            <p className={styles.ProductDetail}>Category: {value1.category}</p>
          </div>

          <div className={styles.MainPoints}>
            {data2.map((value2) => (
              <div key={value2.head_name} className={styles.HeadPoint}>
                <label htmlFor={value2.head_name} className={styles.HeadLabel}>
                  {value2.head_name}
                </label>
                <input
                  type='text'
                  value={value2.head_value}
                  className={styles.HeadInput}
                  onChange={(e) => console.log(e.target.value)} 
                />
                <button className={styles.DeleteButton}>Delete</button>
              </div>
            ))}
            <button className={styles.AddHeadButton}>+ Add New Head</button>
          </div>

          <div className={styles.DigitNames}>
            <div className={styles.DigitGroup}>
              <label htmlFor='incoming' className={styles.DigitLabel}>
                Incoming
              </label>
              <input
                type='number'
                min={0}
                value={value1.incoming}
                className={styles.DigitInput}
                onChange={(e) => console.log(e.target.value)} 
              />
            </div>
            <div className={styles.DigitGroup}>
              <label htmlFor='reserved' className={styles.DigitLabel}>
                Reserved
              </label>
              <input
                type='number'
                min={0}
                value={value1.reserved}
                className={styles.DigitInput}
                onChange={(e) => console.log(e.target.value)} 
              />
            </div>
            <div className={styles.DigitGroup}>
              <label htmlFor='quantity' className={styles.DigitLabel}>
                Quantity
              </label>
              <input
                type='number'
                min={0}
                value={value1.quantity}
                className={styles.DigitInput}
                onChange={(e) => console.log(e.target.value)} 
              />
            </div>
            <div className={styles.DigitGroup}>
              <label htmlFor='price' className={styles.DigitLabel}>
                Price
              </label>
              <input
                type='number'
                min={0}
                value={value1.price}
                className={styles.DigitInput}
                onChange={(e) => console.log(e.target.value)} 
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductionTableManage;
