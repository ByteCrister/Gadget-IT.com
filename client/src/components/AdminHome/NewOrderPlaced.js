import React, { useRef, useState, useEffect } from 'react';
import styles from '../../styles/AdminHome/NewOrderPlaced.module.css';
import { MdMarkEmailRead } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { PiShoppingCartSimpleDuotone } from "react-icons/pi";


const NewOrderPlaced = ({ newOrderPage, setNewOrderPage }) => {

  // ----------------------- Use States Starts-------------------------------------
  const [numberOfProductCategory, setNumberOfProductCategory] = useState(0);
  const [isCategorySet, setIsCategorySet] = useState(false);
  const [products, setProducts] = useState([]);
  const emailRef = useRef();
  const [OrderProductInfo, setOrderProductInfo] = useState({
    userEmail: '',
    Products: []
  });
  // ----------------------- Use States Ends-------------------------------------


  // ------------------------use effect ----------------------------
  useEffect(() => {
    if (isCategorySet) {
      createProductsArrayOfObject(numberOfProductCategory);
    }
  }, [isCategorySet, numberOfProductCategory]);
  // --------------------------------------------------------------------


  const createProductsArrayOfObject = (numberProducts) => {
    const products = [];
    for (let i = 0; i < numberProducts; i++) {
      products.push({
        product_id: '',
        product_quantity: ''
      });
    }
    setProducts(products);
  };

  const handleOnChangeProduct_id = (index, value) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      product_id: value
    };
    setProducts(newProducts);
  };

  const handleOnChangeProduct_quantity = (index, value) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      product_quantity: value
    };
    setProducts(newProducts);
  };

  const handlePlaceOrder = () => {
    const orderInfo = {
      userEmail: emailRef.current.value,
      Products: products
    };
    setOrderProductInfo(orderInfo);
    alert(JSON.stringify(orderInfo.Products, null, 2));
  };

  return (
    <section id={styles.OrderMainContainer}>

      <div>
        <div id={styles.UserEmailInput}>
          <input type='text' id='user_email' placeholder='User Email' ref={emailRef}></input>
          <span><MdMarkEmailRead /></span>
        </div>

        <div id={styles.InputOrderDiv}>
          {
            !isCategorySet ?
              <div id={styles.NumberOfCategory} >
                <input
                  type='number'
                  min={0}
                  placeholder='Enter Number of Category'
                  onChange={(e) => { setNumberOfProductCategory(parseInt(e.target.value, 10) || 0); }}
                ></input>
                <button onClick={() => { setIsCategorySet(true); }}>Set</button>
              </div>
              :
              <section id={styles.ReturnInputDiv}>
                {products.map((_, index) => (
                  <div key={index} >
                    <div id={styles.ProductId}>
                      <input
                        type='text'
                        id={`product_${index}`}
                        placeholder='Product ID'
                        onChange={(e) => { handleOnChangeProduct_id(index, e.target.value); }}
                      ></input>
                      <span><FaKey /></span>
                    </div>
                    <div id={styles.Quantity}>
                      <input
                        type='number'
                        min={0}
                        id={`quantity_${index}`}
                        placeholder='Quantity'
                        onChange={(e) => { handleOnChangeProduct_quantity(index, e.target.value); }}
                      ></input>
                      <span><PiShoppingCartSimpleDuotone /></span>
                    </div>
                  </div>
                ))}
              </section>
          }
        </div>

        <div id={styles.OrderButtons}>
          <button onClick={() => { setNewOrderPage(!newOrderPage); }}>Back</button>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>

    </section>
  )
}

export default NewOrderPlaced;
