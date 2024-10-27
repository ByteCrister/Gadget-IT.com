import React, { useContext, useEffect, useState } from 'react';
import { TiShoppingCart } from "react-icons/ti";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';

import { useData } from '../../context/useData';
import styles from '../../styles/HomePageStyles/ProductSectionCart.module.css';

const Carts = () => {
  const { dataState, dispatch } = useContext(useData);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (dataState?.CartStorage?.length > 0 && dataState?.productStorage?.product_prices) {

      const totalPrice = dataState.CartStorage.reduce((acc, product) => acc + Number(Number(product.quantity) * Number(product.price)), 0);
      setTotal(totalPrice);
      window.scrollTo(0, 0);
    }
  }, [dataState, dataState.CartStorage, dataState.productStorage]);

  const handleQuantity = (productID, Quantity, state) => {
    if (dataState?.CartStorage) {
      dispatch({
        type: 'update_product_from_cart',
        payload: dataState.CartStorage.map((product) =>
          product.product_id === productID
            ? { ...product, quantity: state === '+' ? Number(Quantity) + 1 : Number(Quantity) !== 1 ? Number(Quantity) - 1 : Quantity }
            : product
        )
      });
    }
  };

  const removeCart = (productID) => {
    dispatch({ type: 'remove_product_from_cart', payload: productID });
  };




  if (!dataState?.CartStorage || dataState.CartStorage.length === 0) {
    return (
      <div className={styles.EmptyCartSection}>
        <TiShoppingCart className={styles.CartIcon} />
        <p className={styles.p_1}>Your Cart is <span>Empty</span></p>
        <p className={styles.p_2}>Must add items to the cart before you proceed to checkout</p>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <section className={styles.MainOuterCartSection}>
      <section className={styles.MainInnerCartSection}>
        <section className={styles.Upper}>
          <span className={styles.CartHead}>Shopping Cart</span>
          <table className={styles['product-table']}>
            <thead>
              <tr>
                <th><div>Image</div></th>
                <th><div>Product Name</div></th>
                <th className={styles['hide-on-mobile']}><div>Model</div></th>
                <th><div>Quantity</div></th>
                <th className={styles['hide-on-mobile']}><div>Unit Price</div></th>
                <th><div>Total</div></th>
              </tr>
            </thead>
            <tbody>
              {dataState?.CartStorage?.map((product) => (
                <React.Fragment key={product.product_id}>
                  <tr>
                    <td><div className={styles.ImgCartDiv}><img src={product.image} alt={product.product_name} /></div></td>
                    <td><span className={styles.ProductNameCart}>{product.product_name}</span></td>
                    <td className={styles['hide-on-mobile']}><p className={styles.ProductModelCart}>Brand : <span>{product.brand}</span></p></td>
                    <td><div className={styles.IncDecBtn}>
                      <button onClick={() => handleQuantity(product.product_id, product.quantity, '-')}>-</button>
                      <span>{product.quantity}</span>
                      <button onClick={() => handleQuantity(product.product_id, product.quantity, '+')}>+</button>
                    </div></td>
                    <td className={styles['hide-on-mobile']}><span className={styles.ProductNameCart}>{product.price}৳</span></td>
                    <td><div className={styles.CartDeleteDiv}><span>{Number(product.quantity) * Number(product.price)}৳</span><RiDeleteBinLine className={styles.CartDeleteIcon} onClick={() => removeCart(product.product_id)} /></div></td>
                  </tr>
                  <tr>
                    <td colSpan="6"><hr className={styles['hr-style']}/></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>
        <section className={styles.TotalText}>
          <p>Total : <span>BDT {total}</span></p>
        </section>
        <section className={styles.CartLastBtn}>
          <Link to={dataState.pathSettings.currPath}><button>Continue Shopping</button></Link>
          <Link to={''}><button>Checkout</button></Link>
        </section>
      </section>
    </section>
  );
};

export default Carts;
