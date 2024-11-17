import React from 'react';
import { LuInbox } from "react-icons/lu";

import styles from '../../../styles/HomePageStyles/MyOrders.module.css';
import UserOrders from './UserOrders';

const MyOrders = ({ Orders }) => {
    return (
        <section className={styles.OuterMainOrderHistory}>
            <span className={styles.OrderHeadLine}>My Orders</span>
            {
                Orders && Orders.length === 0
                    ? <section className={styles.EmptyData}>
                        <LuInbox className={styles.LuInbox} />
                        <span>No messages found!</span>
                    </section>

                    : <UserOrders Orders={Orders} />
            }
        </section>
    )
}

export default MyOrders