import React, { useState } from 'react';
import OrdersTable from '../../OrdersTable.json';
import styles from '../../styles/AdminHome/PageFour.module.css';
import { IoFilter } from "react-icons/io5";
import OrderPageFilter from '../../components/AdminHome/OrderPageFilter';
import NewOrderPlaced from '../../components/AdminHome/NewOrderPlaced';
import Pagination from '../../HOOKS/Pagination';

const PageFour = () => {
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [mainProducts, setMainProduct] = useState(OrdersTable.orders);
  const [filteredProducts, setFilteredProducts] = useState(OrdersTable.orders);

  const [filterActiveState, setFilterActiveState] = useState(false);
  const [newOrderPage, setNewOrderPage] = useState(false);

  const handleOrderPageData = (state, actionText) => {
    if (state === 1) {
      setMainProduct(OrdersTable.orders);
    } else {
      setMainProduct(
        OrdersTable.orders.filter((data) => {
          return data.action === actionText;
        })
      )
    }
  }

  const handleFilteredData = (data) => {
    setFilteredProducts((prev) => data);
  }

  const orderCount = {
    AllOrders: OrdersTable.orders.length,
    Processing: OrdersTable.orders.filter((value) => value.action === 'Order Is Processing').length,
    OrderPlaced: OrdersTable.orders.filter((value) => value.action === 'Order Placed').length,
    OnTheWay: OrdersTable.orders.filter((value) => value.action === 'Way to Destination').length,
    ReadyToCollect: OrdersTable.orders.filter((value) => value.action === 'Ready to Collect').length,
    Cancel: OrdersTable.orders.filter((value) => value.action === 'Canceled').length,
  };
  const getActionText = (text) => {
    return text === 'Order Is Processing' ? '#d0ffd4' : text === 'Order Placed' ? '#a9fffb' : text === 'Way to Destination' ? '#c3dfff' : text === 'Ready to Collect' ? '#74ff74' : '#ffc0a7';

  }
  const handleActionChange = (event, orderIndex) => {
    // Handle action change logic here

    console.log(`Order ${orderIndex} action changed to ${event.target.value}`);
  };

  // ----------------------------------------------------------------------------------------------


  return (
    <>
      <section id={styles.mainSection}>
        {/* --------------------------------------- */}
        <section id={styles.section_1}>
          <span>Orders</span>
          <button onClick={() => { setNewOrderPage(!newOrderPage) }}>+New Order</button>
        </section>
        {/* --------------------------------------- */}



        {/* --------------------------------------- */}
        <section id={styles.OrderButtons}>
          <div id={styles.OrderStateButtons}>
            <div
              className={currentOrderPage === 1 ? styles.active_button : ''}
              onClick={() => { setCurrentOrderPage(1); handleOrderPageData(1, '') }}
            >
              <span>All Orders</span>
              <span>{orderCount.AllOrders}</span>
            </div>
            <div
              className={currentOrderPage === 2 ? styles.active_button : ''}
              onClick={() => { setCurrentOrderPage(2); handleOrderPageData(2, 'Order Is Processing') }}
            >
              <span>Processing</span>
              <span>{orderCount.Processing}</span>
            </div>
            <div
              className={currentOrderPage === 3 ? styles.active_button : ''}
              onClick={() => { setCurrentOrderPage(3); handleOrderPageData(3, 'Order Placed') }}
            >
              <span>Order Placed</span>
              <span>{orderCount.OrderPlaced}</span>
            </div>
            <div
              className={currentOrderPage === 4 ? styles.active_button : ''}
              onClick={() => { setCurrentOrderPage(4); handleOrderPageData(4, 'Way to Destination') }}
            >
              <span>On The Way</span>
              <span>{orderCount.OnTheWay}</span>
            </div>
            <div
              className={currentOrderPage === 5 ? styles.active_button : ''}
              onClick={() => { setCurrentOrderPage(5); handleOrderPageData(5, 'Ready to Collect') }}
            >
              <span>Ready To Collect</span>
              <span>{orderCount.ReadyToCollect}</span>
            </div>
            <div
              className={currentOrderPage === 6 ? styles.active_button : ''}
              onClick={() => { setCurrentOrderPage(6); handleOrderPageData(6, 'Canceled') }}
            >
              <span>Canceled</span>
              <span>{orderCount.Cancel}</span>
            </div>
          </div>

          <div id={styles.FilterButton} onClick={() => { setFilterActiveState(!filterActiveState) }}>
            <IoFilter id={styles.filterIcon} />
            <span>Filter</span>
          </div>
        </section>
        {/* --------------------------------------- */}



        <section id={styles.percentage}>
          <div style={{ width: `${(100 / 6) * currentOrderPage}%`, height: '3px', backgroundColor: '#bbbbbb', transition: 'ease-in-out 0.3s' }}></div>
        </section>
        {/* --------------------------------------- */}




        <section className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th><div id={styles.HeadCheckBox}><input type='checkbox' id='Table_head'></input><span>Product Name</span></div></th>
                <th>Product ID</th>
                <th>Incoming</th>
                <th>Category</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((order, index) => (
                <tr key={index}>
                  <td><div id={styles.HeadCheckBox}><input type='checkbox' id={`Table_column-${index}`}></input><span>{order.productName}</span></div></td>
                  <td>{order.productID}</td>
                  <td>{order.incoming}</td>
                  <td>{order.category}</td>
                  <td>{order.date}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td><select
                    className={styles.dropdown}
                    style={{ backgroundColor: getActionText(order.action) }}
                    value={order.action}
                    onChange={(event) => handleActionChange(event, index)}
                  >
                    <option value="Order Is Processing">Order Is Processing</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Way to Destination">Way to Destination</option>
                    <option value="Ready to Collect">Ready to Collect</option>
                    <option value="Canceled">Canceled</option>
                  </select></td>
                </tr>
              ))}
            </tbody>
          </table>


          <Pagination productsData={mainProducts} handleFilteredData={handleFilteredData} />

        </section>


      </section>



      {/* ------------------------------------------------------------ */}
      {
        filterActiveState && <OrderPageFilter filterActiveState={filterActiveState} setFilterActiveState={setFilterActiveState} />
      }
      {
        newOrderPage && <NewOrderPlaced newOrderPage={newOrderPage} setNewOrderPage={setNewOrderPage} />
      }


    </>
  );
};

export default PageFour;
