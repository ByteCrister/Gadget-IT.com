import React, { useContext, useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import { TbTrashOff } from "react-icons/tb";


import styles from "../../styles/AdminHome/PageFour.module.css";
import Pagination from "../../HOOKS/Pagination";
import { useData } from "../../context/useData";
import axios from "axios";

const PageFour = () => {
  const { dataState, dispatch } = useContext(useData);
  const [OrderStore, setOrderStore] = useState({
    MainProducts: [],
    filteredProducts: [],
  });
  const [filterState, setFilterState] = useState(0);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [newOrderPage, setNewOrderPage] = useState(false);
  const [OrderCount, setOrderCount] = useState({});

  const [OrderDetail, setOrderDetail] = useState({
    isOrderDetailOn: false,
    UserOrderInfo: {},
    OrderProductInfo: []
  });

  useEffect(() => {
    if (dataState?.Order_Page && dataState.Order_Page.length !== 0) {
      const PageData = [...dataState.Order_Page];
      setOrderStore((prev) => ({
        ...prev,
        MainProducts: PageData,
        filteredProducts: PageData,
      }));
      setOrderCount({
        AllOrders: PageData.length,
        Processing:
          PageData.filter(
            (order) => order.OrderInfo.order_status === "Order is Processing"
          ).length,
        OrderPlaced:
          PageData.filter((order) => order.OrderInfo.order_status === "Order Placed")
            .length,
        OnTheWay:
          PageData.filter(
            (order) => order.OrderInfo.order_status === "Way to Destination"
          ).length,
        ReadyToCollect:
          PageData.filter((order) => order.OrderInfo.order_status === "Ready to Collect")
            .length,
        Cancel:
          PageData.filter((order) => order.OrderInfo.order_status === "Canceled")
            .length,
      });
      console.log(PageData);
    }
  }, [dataState.Order_Page]);

  const handleFilter = () => {
    setFilterState(prev => prev === 10 ? 0 : prev + 1);
    let Updated = [...dataState.Order_Page];
    console.log(filterState);
    const state = filterState + 1;
    if (state >= 1 && state <= 2) {
      Updated = Updated.sort((a, b) => state === 1 ? a.OrderInfo.order_id - b.OrderInfo.order_id : b.OrderInfo.order_id - a.OrderInfo.order_id);
    } else if (state >= 3 && state <= 4) {
      Updated = Updated.sort((a, b) => state === 3 ? a.OrderInfo.user_id - b.OrderInfo.user_id : b.OrderInfo.user_id - a.OrderInfo.user_id);
    } else if (state >= 5 && state <= 6) {
      Updated = Updated.sort((a, b) => state === 5 ? a.OrderInfo.phone_number.localeCompare(b.OrderInfo.phone_number) : b.OrderInfo.phone_number.localeCompare(a.OrderInfo.phone_number));
    } else if (state >= 7 && state <= 8) {
      Updated = Updated.sort((a, b) => state === 7 ? new Date(a.OrderInfo.order_date) - new Date(b.OrderInfo.order_date) : new Date(b.OrderInfo.order_date) - new Date(a.OrderInfo.order_date) );
    } else if (state >= 9 && state <= 10) {
      Updated = Updated.sort((a, b) => state === 9 ? a.OrderInfo.order_status.localeCompare(b.OrderInfo.order_status) : b.OrderInfo.order_status.localeCompare(a.OrderInfo.order_status));
    }

    setOrderStore((prev) => ({
      ...prev,
      MainProducts: [...Updated]
    }));
  };

  const renderProductDetail = () => {
    return (
      <section className={styles['product-detail-section']}>
        <div className={styles['product-detail-user-info']}>
          <span>Name: {OrderDetail.UserOrderInfo.name}</span>
          <span>Address: {OrderDetail.UserOrderInfo.full_address}</span>
        </div>
        <section className={styles['product-detail-table-section']}>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {
                OrderDetail.OrderProductInfo.map((product) => {
                  return <tr>
                    <td>{product.product_id}</td>
                    <td>{product.quantity}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </section>
        <button onClick={() => setOrderDetail(prev => ({ ...prev, isOrderDetailOn: false }))}>Back</button>
      </section>
    )
  };

  const performDeleteData = async (order_id) => {
    try {
      await axios.delete(`http://localhost:7000/delete-order/${order_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrder = async (selected, order_id) => {
    if (selected && window.confirm(`Do you want to delete order - ${order_id}?`)) {
      let Updated = [...dataState.Order_Page];
      Updated = Updated.filter((order) => {
        return order.OrderInfo.order_id !== order_id
      });
      setOrderStore((prev) => ({
        ...prev,
        MainProducts: Updated,
      }));
      dispatch({ type: "set_order_page", payload: Updated });
      await performDeleteData(order_id);
    }
  };

  const handleOrderDetail = (Order) => {
    setOrderDetail({
      isOrderDetailOn: true,
      UserOrderInfo: Order.OrderInfo,
      OrderProductInfo: Order.OrderProducts
    });
  };

  const handleOrderPageData = (keyState) => {
    let Updated = [...dataState.Order_Page];
    if (keyState && keyState.length > 0) {
      Updated = Updated.filter((item) => {
        return item.OrderInfo.order_status === keyState;
      });
    }
    setOrderStore((prev) => ({
      ...prev,
      MainProducts: Updated,
    }));
  };

  const handleFilteredData = async (data) => {
    const resolvedData = await data;
    setOrderStore((prev) => ({
      ...prev,
      filteredProducts: resolvedData,
    }));
  };

  const getActionText = (text) => {
    return text === "Order is Processing"
      ? "#d0ffd4"
      : text === "Order Placed"
        ? "#a9fffb"
        : text === "Way to Destination"
          ? "#c3dfff"
          : text === "Ready to Collect"
            ? "#74ff74"
            : "#ffc0a7";
  };

  const getNewOrderStatus = (currStatus, newStatus) => {
    if (currStatus === "Canceled") return currStatus;

    if (currStatus === "Order is Processing" && newStatus === "Order Placed")
      return newStatus;

    if (currStatus === "Order Placed" && newStatus === "Way to Destination")
      return newStatus;

    if (currStatus === "Way to Destination" && newStatus === "Ready to Collect")
      return newStatus;

    return currStatus;
  };

  const handleUpdateOrderStatus = async (newStatus, order_id) => {
    try {
      await axios.patch(`http://localhost:7000/update/order-status`, {
        newStatus: newStatus,
        order_id: order_id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleActionChange = async (e) => {
    let Updated = [...OrderStore.MainProducts];
    Updated = Updated.map((item) => {
      const newStatus = getNewOrderStatus(
        item.OrderInfo.order_status,
        e.target.value
      );
      if (item.OrderInfo.selected && newStatus === e.target.value) {
        handleUpdateOrderStatus(newStatus, item.OrderInfo.order_id);
        return {
          ...item,
          OrderInfo: {
            ...item.OrderInfo,
            order_status: newStatus,
          },
        };
      }
      return item;
    });
    dispatch({ type: "set_order_page", payload: Updated });
  };

  const handleSelectCheckbox = (e, state, order_id) => {
    const isChecked = e.target.checked;
    let Updated = [...OrderStore.MainProducts];

    if (state === 0) {
      Updated = Updated.map((item) => {
        return {
          ...item,
          OrderInfo: { ...item.OrderInfo, selected: isChecked ? true : false },
        };
      });
    } else {
      Updated = Updated.map((item) => {
        return item.OrderInfo.order_id === order_id
          ? {
            ...item,
            OrderInfo: {
              ...item.OrderInfo,
              selected: isChecked ? true : false,
            },
          }
          : item;
      });
    }
    setOrderStore((prev) => ({
      ...prev,
      MainProducts: Updated,
    }));
  };

  // ----------------------------------------------------------------------------------------------

  return (
    <>
      <section id={styles.mainSection}>

        {/* --------------------------------------- */}
        <section id={styles.OrderButtons}>
          <div id={styles.OrderStateButtons}>

            <div className={currentOrderPage === 1 ? styles.active_button : ""}
              onClick={() => { setCurrentOrderPage(1); handleOrderPageData(""); }} >
              <span>All Orders</span>
              <span>{OrderCount.AllOrders}</span>
            </div>

            <div className={currentOrderPage === 2 ? styles.active_button : ""}
              onClick={() => { setCurrentOrderPage(2); handleOrderPageData("Order is Processing"); }} >
              <span>Processing</span>
              <span>{OrderCount.Processing}</span>
            </div>

            <div className={currentOrderPage === 3 ? styles.active_button : ""}
              onClick={() => { setCurrentOrderPage(3); handleOrderPageData("Order Placed"); }} >
              <span>Order Placed</span>
              <span>{OrderCount.OrderPlaced}</span>
            </div>

            <div className={currentOrderPage === 4 ? styles.active_button : ""}
              onClick={() => { setCurrentOrderPage(4); handleOrderPageData("Way to Destination"); }} >
              <span>On The Way</span>
              <span>{OrderCount.OnTheWay}</span>
            </div>

            <div className={currentOrderPage === 5 ? styles.active_button : ""}
              onClick={() => { setCurrentOrderPage(5); handleOrderPageData("Ready to Collect"); }} >
              <span>Ready To Collect</span>
              <span>{OrderCount.ReadyToCollect}</span>
            </div>

            <div className={currentOrderPage === 6 ? styles.active_button : ""}
              onClick={() => { setCurrentOrderPage(6); handleOrderPageData("Canceled"); }}>
              <span>Canceled</span>
              <span>{OrderCount.Cancel}</span>
            </div>
          </div>

          <button id={styles.FilterButton} onClick={handleFilter}>
            <IoFilter id={styles.filterIcon} />
            <span>Filter</span>
          </button>
        </section>
        {/* --------------------------------------- */}

        <section id={styles.percentage}>
          <div
            style={{
              width: `${(100 / 6) * currentOrderPage}%`,
              height: "3px",
              backgroundColor: "#bbbbbb",
              transition: "ease-in-out 0.3s",
            }}
          ></div>
        </section>
        {/* --------------------------------------- */}

        <section className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={filterState >= 1 && filterState <= 2 ?
                  styles['pageFour-order-page-filter-style'] : styles['default-th']}>
                  <div id={styles.HeadCheckBox}>
                    <input type="checkbox" onClick={(e) => handleSelectCheckbox(e, 0, 0)} id="Table_head"></input>
                    <span>Order ID</span>
                  </div>
                </th>
                <th className={filterState >= 3 && filterState <= 4 ?
                  styles['pageFour-order-page-filter-style'] : styles['default-th']}>User ID</th>
                <th className={filterState >= 5 && filterState <= 6 ?
                  styles['pageFour-order-page-filter-style'] : styles['default-th']}>Phone</th>
                <th className={filterState >= 7 && filterState <= 8 ?
                  styles['pageFour-order-page-filter-style'] : styles['default-th']}>Date</th>
                <th className={styles['default-th']}>Order Type</th>
                <th className={filterState >= 9 && filterState <= 10 ?
                  styles['pageFour-order-page-filter-style'] : styles['default-th']}>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {OrderStore?.filteredProducts &&
                OrderStore.filteredProducts.length > 0 &&
                OrderStore.filteredProducts.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <div id={styles.HeadCheckBox}>
                        <input type="checkbox" checked={order.OrderInfo.selected} onClick={(e) => handleSelectCheckbox(e, -1, order.OrderInfo.order_id)} id={`Table_column-${index}`} ></input>
                        <span>{order.OrderInfo.order_id}</span>
                      </div>
                    </td>
                    <td onClick={() => handleOrderDetail(order)}>{order.OrderInfo.user_id}</td>
                    <td onClick={() => handleOrderDetail(order)}>{order.OrderInfo.phone_number}</td>
                    <td onClick={() => handleOrderDetail(order)}>
                      {new Date(order.OrderInfo.order_date).toLocaleString()}
                    </td>
                    <td>{order.OrderInfo.order_type === 'Cash on Delivery'
                      ? <span className={styles['page-four-order-trash']}>{order.OrderInfo.order_type}<TbTrashOff onClick={() => handleDeleteOrder(order.OrderInfo.selected, order.OrderInfo.order_id)} className={styles['page-four-order-trash-btn']} /></span>
                      : order.OrderInfo.order_type}
                    </td>
                    <td>
                      <select className={styles.dropdown} style={{ backgroundColor: getActionText(order.OrderInfo.order_status) }} value={order.OrderInfo.order_status} onChange={(e) => handleActionChange(e)}>
                        <option value={null}></option>
                        <option value="Order is Processing" selected={order.OrderInfo.order_status === "Order is Processing"}> Order Is Processing</option>
                        <option value="Order Placed" selected={order.OrderInfo.order_status === "Order Placed"}>Order Placed</option>
                        <option value="Way to Destination" selected={order.OrderInfo.order_status === "Way to Destination"}>Way to Destination</option>
                        <option value="Ready to Collect" selected={order.OrderInfo.order_status === "Ready to Collect"}>Ready to Collect</option>
                        <option value="Canceled" selected={order.OrderInfo.order_status === "Canceled"}>Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <Pagination productsData={OrderStore.MainProducts || []} handleFilteredData={handleFilteredData} />
        </section>
      </section>

      {/* ---------------------------- Extra Section -------------------------------- */}
      {OrderDetail.isOrderDetailOn && renderProductDetail()}
    </>
  );
};

export default React.memo(PageFour);