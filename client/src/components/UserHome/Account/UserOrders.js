import React, { useContext, useEffect, useState } from 'react'
import { useData } from '../../../context/useData';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { GiCheckMark } from "react-icons/gi";


import styles from '../../../styles/HomePageStyles/UserOrder.module.css';

const UserOrders = ({ Orders }) => {
    const { dataState, dispatch } = useContext(useData);
    const [MainOrder, setMainOrder] = useState([]);
    const [OrderDetail, setOrderDetail] = useState({
        isOrderDetailOn: false,
        OrderDetail: {},
        OrderProducts: []
    });
    const findPrice = (product_id) => {
        const product = dataState.productStorage.product_prices.find((product) => product.product_id === product_id);
        return product ? product.price : 0;
    };

    const getImgAndName = (product_id) => {
        for (let i = 0; i < dataState.productStorage.product_table.length; i++) {
            const ProductMainTable = dataState.productStorage.product_table[i].table_products;
            for (let j = 0; j < ProductMainTable.length; j++) {
                if (ProductMainTable[j].product_id === product_id) {
                    return {
                        name: ProductMainTable[j].product_name,
                        image: ProductMainTable[j].image
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (dataState?.productStorage?.product_prices && Orders && Orders.length > 0) {
            setMainOrder(
                Orders.map((order) => ({
                    ...order,
                    OrderProducts: order.OrderProducts.map((order_) => ({
                        ...order_,
                        price: findPrice(order_.product_id),
                        ...getImgAndName(order_.product_id)
                    }))
                }))
            );
            console.log(MainOrder);
        }
    }, [Orders]);

    const renderOrderProducts = (OrderProducts) => {
        return <div className={styles['single-order-product-main-div']}>
            {
                OrderProducts.map((order_) => {
                    return <section className={styles['single-order-product-section']}>
                        <div className={styles['single-order-product-section-img-main-div']}>
                            <div className={styles['single-order-product-section-img-div']}>
                                <img src={order_.image} alt='order-image'></img>
                            </div>
                            <span className={styles['single-order-product-section-name-span']}>{order_.name}</span>
                        </div>
                        <span className={styles['single-order-product-total-price']}>{order_.price} * {order_.quantity} ={order_.price * order_.quantity}</span>
                    </section>
                })
            }
        </div>
    };

    return (
        <section className={styles['user-orders-main-container']}>
            {
                !OrderDetail.isOrderDetailOn &&
                    MainOrder &&
                    MainOrder.length !== 0 ?
                    MainOrder.map((order) => {
                        return <section className={styles['single-order-section']}>
                            <div className={styles['single-order-upper-div']}>
                                <div className={styles['order-upper-left-div']}>
                                    <span className={styles['order-id-span']}>ORD-{order.OrderInfo.order_id}</span>
                                    <span className={styles['order-place-date-span']}>Placed At: {new Date(order.OrderInfo.order_date).toLocaleString()}</span>
                                </div>
                                <div className={styles['order-upper-right-div']}>
                                    <span className={styles['order-price-span']}>{order.OrderProducts.reduce((s, c) => s + c.price, 0)}BDT</span>
                                    <span className={styles['order-status-span']}>{order.OrderInfo.order_status}</span>
                                    <button onClick={() => setOrderDetail({ isOrderDetailOn: true, OrderDetail: order.OrderInfo, OrderProducts: order.OrderProducts })}><GoArrowRight /></button>
                                </div>
                            </div>
                            {
                                order.OrderProducts &&
                                order.OrderProducts.length !== 0 &&
                                renderOrderProducts(order.OrderProducts)

                            }
                        </section>
                    })
                    :
                    <section className={styles['single-order-section']}>
                        <div className={styles['single-order-upper-div']}>
                            <div className={styles['order-upper-left-div']}>
                                <span className={styles['order-id-span']}>Order Id: {OrderDetail.OrderDetail.order_id}</span>
                                <span className={styles['order-place-date-span']}>Placed At: {new Date(OrderDetail.OrderDetail.order_date).toLocaleString()}</span>
                            </div>
                            <div className={styles['order-upper-right-div']}>
                                <button onClick={() => setOrderDetail({ isOrderDetailOn: false, OrderDetail: {}, OrderProducts: [] })}><GoArrowLeft /></button>
                            </div>
                        </div>
                        <div className={styles['order-status-main-container']}>
                            <div className={styles['order-status-pool-active']}>
                                <span className={styles['order-status-pool-text']} >Order is Processing</span>
                                <GiCheckMark className={styles['order-status-pool-check-mark']} />
                            </div>
                            <div className={
                                OrderDetail.OrderDetail.order_status === 'Order Placed' ||
                                    OrderDetail.OrderDetail.order_status === 'Way to Destination' ||
                                    OrderDetail.OrderDetail.order_status === 'Ready to Collect'
                                    ? styles['order-status-pool-active'] : styles['order-status-pool-default']
                            }
                            >
                                <span className={styles['order-status-pool-text']}>Order Placed</span>
                                <GiCheckMark className={styles['order-status-pool-check-mark']} />
                            </div>
                            <div className={
                                OrderDetail.OrderDetail.order_status === 'Way to Destination' ||
                                    OrderDetail.OrderDetail.order_status === 'Ready to Collect'
                                    ? styles['order-status-pool-active'] : styles['order-status-pool-default']
                            }>
                                <span className={styles['order-status-pool-text']}>Way to Destination</span>
                                <GiCheckMark className={styles['order-status-pool-check-mark']} />
                            </div>
                            <div className={
                                OrderDetail.OrderDetail.order_status === 'Ready to Collect'
                                    ? styles['order-status-pool-active'] : styles['order-status-pool-default']
                            }>
                                <span className={styles['order-status-pool-text']}>Ready to Collect</span>
                                <GiCheckMark className={styles['order-status-pool-check-mark']} />
                            </div>
                        </div>
                        {renderOrderProducts(OrderDetail.OrderProducts)}

                        <div className={styles['order-detail-lower-main-div']}>
                            <div className={styles['single-order-upper-div']}>
                                <span className={styles['order-address-div-span']}>Shipping Address</span>
                            </div>
                            <div className={styles['order-detail-lower-div']}>
                                <div>
                                    <span>Name: {OrderDetail.OrderDetail.name}</span>
                                    <span>Email: {OrderDetail.OrderDetail.email}</span>
                                    <span>Phone Number: {OrderDetail.OrderDetail.phone_number}</span>
                                    <span>Address: {OrderDetail.OrderDetail.full_address}</span>
                                </div>
                                <span>Payment Type: {OrderDetail.OrderDetail.order_type}</span>
                            </div>
                        </div>
                    </section>
            }
        </section>
    )
}

export default UserOrders;