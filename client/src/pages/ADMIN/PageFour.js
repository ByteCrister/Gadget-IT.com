import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { IoFilter } from "react-icons/io5";
import { TbTrashOff } from "react-icons/tb";
import { IoShieldCheckmark, IoShieldCheckmarkOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


import Pagination from "../../HOOKS/Pagination";
import { useData } from "../../context/useData";
import styles from "../../styles/AdminHome/PageFour.module.css";

const PageFour = () => {
  const { dataState, dispatch } = useContext(useData);
  const [OrderStore, setOrderStore] = useState({
    MainProducts: [],
    filteredProducts: [],
  });
  const [filterState, setFilterState] = useState(0);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  // const [newOrderPage, setNewOrderPage] = useState(false);
  const [OrderCount, setOrderCount] = useState({});

  const [OrderDetail, setOrderDetail] = useState({
    isOrderDetailOn: false,
    UserOrderInfo: {},
    OrderProductInfo: []
  });

  useEffect(() => {
    if (dataState?.Order_Page && dataState.Order_Page.length !== 0) {
      const PageData = [...dataState.Order_Page];
      setOrderStore((prev) => {
        if (prev.MainProducts.length === dataState.Order_Page.length) return prev; // Prevent redundant updates
        return {
          ...prev,
          MainProducts: PageData,
          filteredProducts: PageData,
        };
      });
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
      // console.log(PageData);
      // console.log(dataState.Production_Page.TableRows);
    }
  }, [dataState?.Order_Page]);

  const sortedOrders = useMemo(() => {
    let Updated = [...OrderStore.MainProducts];
    switch (filterState) {
      case 1:
      case 2:
        Updated.sort((a, b) => filterState === 1 ? a.OrderInfo.order_id - b.OrderInfo.order_id : b.OrderInfo.order_id - a.OrderInfo.order_id);
        break;
      case 3:
      case 4:
        Updated.sort((a, b) => filterState === 3 ? a.OrderInfo.user_id - b.OrderInfo.user_id : b.OrderInfo.user_id - a.OrderInfo.user_id);
        break;
      case 5:
      case 6:
        Updated.sort((a, b) => filterState === 5 ? a.OrderInfo.phone_number.localeCompare(b.OrderInfo.phone_number) : b.OrderInfo.phone_number.localeCompare(a.OrderInfo.phone_number));
        break;
      case 7:
      case 8:
        Updated.sort((a, b) => filterState === 7 ? new Date(a.OrderInfo.order_date) - new Date(b.OrderInfo.order_date) : new Date(b.OrderInfo.order_date) - new Date(a.OrderInfo.order_date));
        break;
      case 9:
      case 10:
        Updated.sort((a, b) => filterState === 9 ? a.OrderInfo.order_status.localeCompare(b.OrderInfo.order_status) : b.OrderInfo.order_status.localeCompare(a.OrderInfo.order_status));
        break;
      default:
        break;
    }
    return Updated;
  }, [filterState, OrderStore.MainProducts]);

  const handleFilter = () => {
    setFilterState(prev => (prev === 10 ? 0 : prev + 1));
    setOrderStore(prev => ({ ...prev, MainProducts: sortedOrders }));
  };

  const renderProductDetail = () => {
    return (
      <section className={styles['product-detail-section']}>
        <div className={styles['product-detail-user-info']}>
          <span>Name: {OrderDetail.UserOrderInfo.name}</span>
          <span>Address: {OrderDetail.UserOrderInfo.full_address}</span>
          <span>Email: {OrderDetail.UserOrderInfo.email}</span>
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
                OrderDetail.OrderProductInfo.map((product, index) => {
                  return <tr key={`order product info-${index}`}>
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
      const OrderProducts = OrderStore.MainProducts.find((item) => item.OrderInfo.order_id === order_id).OrderProducts;
      const Products = dataState.Production_Page.TableRows.filter((item) => OrderProducts.some((item_) => item_.product_id === item.id));
      const price = Products.reduce((s, c) => s + c.price, 0);
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-order/${order_id}/${price}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleDeleteOrder = async (selected, order_id) => {
    if (selected && window.confirm(`Do you want to delete order - ${order_id}?`)) {
      try {
        await performDeleteData(order_id);
        let Updated = [...dataState.Order_Page];
        Updated = Updated.filter((order) => {
          return order.OrderInfo.order_id !== order_id
        });
        setOrderStore((prev) => ({
          ...prev,
          MainProducts: Updated,
        }));
        dispatch({ type: "set_order_page", payload: Updated });
      } catch (error) {
        window.alert("Error on deleting data: " + error.message);
      }
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
  if (JSON.stringify(OrderStore.filteredProducts) !== JSON.stringify(resolvedData)) {
    setOrderStore(prev => ({ ...prev, filteredProducts: resolvedData }));
  }
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

    return "Canceled";
  };

  const handleNewUserOrderNotification = async (user_id, order_id, status) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/new-order-user-notification`, {
        user_id: user_id,
        order_id: order_id,
        status: status
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleUpdateOrderStatus = async (currStatus, newStatus, order_id, price) => {
    try {
      dispatch({ type: "toggle_loading", payload: true });

      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/update/order-status`, {
        currStatus,
        newStatus,
        order_id,
        price
      });

      setOrderStore(prev => ({
        ...prev,
        MainProducts: prev.MainProducts.map(order =>
          order.OrderInfo.order_id === order_id
            ? { ...order, OrderInfo: { ...order.OrderInfo, order_status: newStatus } }
            : order
        )
      }));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "toggle_loading", payload: false });
    }
  };

  const handleReturnMoneyApi = async (OrderInfo, OrderProducts) => {
    try {
      const Products = dataState.Production_Page.TableRows.filter((item) => OrderProducts.some((item_) => item_.product_id === item.id));
      const price = Products.reduce((s, c) => s + c.price, 0);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post-return-money`, { OrderInfo: { ...OrderInfo, price }, OrderProducts: OrderProducts });
    } catch (error) {
      console.log("handle Return Money Api error: " + error);
      throw error;
    }
  };

  const handleActionChange = async (e) => {
    try {
      dispatch({ type: "toggle_loading", payload: true });
      let Updated = await Promise.all(OrderStore.MainProducts.map(async (item) => {
        const newStatus = getNewOrderStatus(item.OrderInfo.order_status, e.target.value);
        // console.log('new status: ' + newStatus + ', enteredStatus: ' + e.target.value);
        if (item.OrderInfo.selected && newStatus === e.target.value) {

          const Products = dataState.Production_Page.TableRows.filter((item_1) => item.OrderProducts.some((item_2) => item_2.product_id === item_1.id));
          const price = Products.reduce((s, c) => s + c.price, 0);

          await handleUpdateOrderStatus(item.OrderInfo.order_status, newStatus, item.OrderInfo.order_id, price);
          await handleNewUserOrderNotification(item.OrderInfo.user_id, item.OrderInfo.order_id, newStatus);
          if (item.OrderInfo.order_type === 'Online Payment' && item.OrderInfo.order_status !== 'Canceled' && newStatus === 'Canceled') await handleReturnMoneyApi(item.OrderInfo, item.OrderProducts);

          return {
            ...item,
            OrderInfo: {
              ...item.OrderInfo,
              order_status: newStatus,
            },
          };
        }
        return item;
      }));
      dispatch({ type: "set_order_page", payload: Updated });
      dispatch({ type: "toggle_loading", payload: false });
    } catch (error) {
      window.alert('Error on action change: ' + error.message);
      dispatch({ type: "toggle_loading", payload: false });
    }
  };


  const handleSelectCheckbox = (e, state, order_id) => {
    const isChecked = e.target.checked;
    setOrderStore(prev => ({
      ...prev,
      MainProducts: prev.MainProducts.map(order =>
        (state === 0 || order.OrderInfo.order_id === order_id)
          ? { ...order, OrderInfo: { ...order.OrderInfo, selected: isChecked } }
          : order
      ),
    }));
  };

  const renderInvoiceChange_Api = async (Order) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post-new-order-invoice`, {
        Order
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const handleInvoiceChange = async (order_id) => {

    const product = OrderStore.MainProducts.find((Order) => Order.OrderInfo.order_id === order_id);
    const isSelected = product?.OrderInfo?.selected || false;

    if (isSelected && !product.OrderInfo.invoiceLoading) {
      try {
        //* Set invoice loading state to true (optimizing state update by only calling setOrderStore once)
        setOrderStore((prev) => ({
          MainProducts: prev.MainProducts.map((order) =>
            order.OrderInfo.order_id === order_id
              ? { ...order, OrderInfo: { ...order.OrderInfo, invoiceLoading: true } }
              : order
          )
        }));

        //* Update invoice status in the local store
        const updated = OrderStore.MainProducts.map((Order) =>
          Order.OrderInfo.order_id === order_id
            ? { ...Order, OrderInfo: { ...Order.OrderInfo, invoice_status: 1 } }
            : Order
        );

        // *Call the API to render the invoice
        await renderInvoiceChange_Api(product);

        //* After API call succeeds, reset the invoice loading and selected state
        setOrderStore((prev) => ({
          MainProducts: prev.MainProducts.map((order) =>
            order.OrderInfo.order_id === order_id
              ? { ...order, OrderInfo: { ...order.OrderInfo, invoiceLoading: false, selected: false } }
              : order
          )
        }));

        //* Update the page state with the updated order status
        dispatch({ type: "set_order_page", payload: updated });
      } catch (error) {
        //* Reset loading and selection state in case of error
        setOrderStore((prev) => ({
          MainProducts: prev.MainProducts.map((order) =>
            order.OrderInfo.order_id === order_id
              ? { ...order, OrderInfo: { ...order.OrderInfo, invoiceLoading: false, selected: false } }
              : order
          )
        }));
        window.alert(`Error: ${error.message}`);
        console.error('Invoice change failed:', error);
      }
    }
  };



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
                <th className={styles['default-th']}>Invoice Status</th>
                <th className={filterState >= 9 && filterState <= 10 ?
                  styles['pageFour-order-page-filter-style'] : styles['default-th']}>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {OrderStore?.filteredProducts &&
                OrderStore.filteredProducts.length > 0 &&
                OrderStore.filteredProducts.map((order, index) => (
                  <tr key={`order-store-filtered-products-${index}`}>
                    <td>
                      <div id={styles.HeadCheckBox}>
                        <input type="checkbox" name="order-info-checkbox" defaultChecked={order.OrderInfo.selected} onClick={(e) => handleSelectCheckbox(e, -1, order.OrderInfo.order_id)} id={`Table_column-${index}`} ></input>
                        <span>{order.OrderInfo.order_id}</span>
                      </div>
                    </td>
                    <td onClick={() => handleOrderDetail(order)}>{order.OrderInfo.user_id}</td>
                    <td onClick={() => handleOrderDetail(order)}>{order.OrderInfo.phone_number}</td>
                    <td onClick={() => handleOrderDetail(order)}>
                      {new Date(order.OrderInfo.order_date).toLocaleString()}
                    </td>
                    <td>{order.OrderInfo.order_type === 'Cash on Delivery' && order.OrderInfo.order_status !== 'Canceled'
                      ? <span className={styles['page-four-order-trash']}>{order.OrderInfo.order_type}<TbTrashOff onClick={() => handleDeleteOrder(order.OrderInfo.selected, order.OrderInfo.order_id)} className={styles['page-four-order-trash-btn']} /></span>
                      : order.OrderInfo.order_type}
                    </td>
                    <td>
                      <div className={styles['invoice-button-div']}>
                        {order.OrderInfo.invoiceLoading
                          ? <AiOutlineLoading3Quarters className={styles['invoice-loading-button-icon']} />
                          : order.OrderInfo.invoice_status === 0
                            ? <button onClick={() => handleInvoiceChange(order.OrderInfo.order_id)} className={styles['invoice-button']}> <IoShieldCheckmarkOutline className={styles['invoice-button-icon-inactive']} /></button>
                            : <button className={styles['invoice-button']}><IoShieldCheckmark className={styles['invoice-button-icon-active']} /></button>
                        }
                      </div>
                    </td>
                    <td>
                      <select id="select-order-status" className={styles.dropdown} style={{ backgroundColor: getActionText(order.OrderInfo.order_status) }} value={order.OrderInfo.order_status} onChange={(e) => handleActionChange(e)}>
                        {
                          ["", "Order is Processing", "Order Placed", "Way to Destination", "Ready to Collect", "Canceled"].map((item, index) => {
                            return <option id={`order-status-option-${index}`} key={`order status-${index}`} value={item}>{item}</option>
                          })
                        }
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