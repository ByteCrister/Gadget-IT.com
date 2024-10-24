import React, { useState } from 'react'
import { LuInbox } from "react-icons/lu";

import styles from '../../../styles/HomePageStyles/MyOrders.module.css';

const MyOrders = () => {
    const [OrderMessages, setOrderMessages] = useState([]);
    return (
        <section className={styles.OuterMainOrderHistory}>
            <span className={styles.OrderHeadLine}>Order Messages</span>
            {
                OrderMessages && OrderMessages.length === 0
                    ? <section className={styles.EmptyData}>
                        <LuInbox className={styles.LuInbox} />
                        <span>No Messages are Found!</span>
                    </section>

                    : <section>

                    </section>
            }
        </section>
    )
}

export default MyOrders