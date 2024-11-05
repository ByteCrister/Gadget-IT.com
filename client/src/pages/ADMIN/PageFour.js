import React, { useContext, useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";

import styles from "../../styles/AdminHome/PageFour.module.css";
import OrderPageFilter from "../../components/AdminHome/OrderPageFilter";
import NewOrderPlaced from "../../components/AdminHome/NewOrderPlaced";
import Pagination from "../../HOOKS/Pagination";
import { useData } from "../../context/useData";
import axios from "axios";

const PageFour = () => {
  const { dataState, dispatch } = useContext(useData);
  const [OrderStore, setOrderStore] = useState({
    MainProducts: [],
    filteredProducts: [],
  });
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [filterActiveState, setFilterActiveState] = useState(false);
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
            (order) => order.order_status === "Order Is Processing"
          ).length || 0,
        OrderPlaced:
          PageData.filter((order) => order.order_status === "Order Placed")
            .length || 0,
        OnTheWay:
          PageData.filter(
            (order) => order.order_status === "Way to Destination"
          ).length || 0,
        ReadyToCollect:
          PageData.filter((order) => order.order_status === "Ready to Collect")
            .length || 0,
        Cancel:
          PageData.filter((order) => order.order_status === "Canceled")
            .length || 0,
      });
      console.log(PageData);
    }
  }, [dataState.Order_Page]);

  const handleOrderDetail = (Order) => {
    setOrderDetail({
      isOrderDetailOn: !OrderDetail.isOrderDetailOn,
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
        <section id={styles.section_1}>
          <span>Orders</span>
          <button
            onClick={() => {
              setNewOrderPage(!newOrderPage);
            }}
          >
            +New Order
          </button>
        </section>
        {/* --------------------------------------- */}

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

          <div id={styles.FilterButton} onClick={() => { setFilterActiveState(!filterActiveState); }}>
            <IoFilter id={styles.filterIcon} />
            <span>Filter</span>
          </div>
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
                <th>
                  <div id={styles.HeadCheckBox}>
                    <input type="checkbox" onClick={(e) => handleSelectCheckbox(e, 0, 0)} id="Table_head"></input>
                    <span>Order ID</span>
                  </div>
                </th>
                <th>User ID</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Order Type</th>
                <th>Payment Status</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {OrderStore?.filteredProducts &&
                OrderStore.filteredProducts.length > 0 &&
                OrderStore.filteredProducts.map((order, index) => (
                  <tr key={index}>
                    <td onClick={() => handleOrderDetail(order)}>
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
                    <td onClick={() => handleOrderDetail(order)}>{order.OrderInfo.order_type}</td>
                    <td onClick={() => handleOrderDetail(order)}>{order.OrderInfo.payment_status}</td>
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

      {/* ------------------------------------------------------------ */}
      {filterActiveState && (<OrderPageFilter filterActiveState={filterActiveState} setFilterActiveState={setFilterActiveState} />)}
      {newOrderPage && (<NewOrderPlaced newOrderPage={newOrderPage} setNewOrderPage={setNewOrderPage} />)}
    </>
  );
};

export default React.memo(PageFour);