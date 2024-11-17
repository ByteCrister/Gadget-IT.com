import React from 'react'
import { useLocation } from 'react-router-dom';
import UserOrders from './UserOrders';

const OrdersPage = () => {
    const location = useLocation();
    const { OrderInfo, OrderProducts } = location.state || {};

    return (
        <section>
            <UserOrders Orders={[{ OrderInfo: OrderInfo, OrderProducts: OrderProducts }]} />
        </section>
    )
}

export default OrdersPage