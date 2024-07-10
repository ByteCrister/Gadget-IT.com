import React, { useState } from 'react';
import styles from '../../styles/admin.home.module.css';
import { RiMessage2Fill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";

const UpperSide = ({ handleUpper }) => {
    const [numberOf, setNumber] = useState({
        messages: 3,
        notifications: 5
    });

    return (
        <div className={styles.upperSide}>
            <div className={styles.contents}>
                <div onClick={() => { setNumber({ messages: 0, notifications: numberOf.notifications }); handleUpper(1) }} className={styles.messageBox}>
                    <span className={styles.messageLogo}><RiMessage2Fill /></span>
                    <span className={styles.messageCount}>{numberOf.messages}</span>
                </div>
                <div onClick={() => { setNumber({ messages: numberOf.messages, notifications: 0 }); handleUpper(2) }} className={styles.notifications}>
                    <span className={styles.bellLogo}><IoNotifications /></span>
                    <span className={styles.notificationCount}>{numberOf.notifications}</span>
                </div>
                <div onClick={() => { handleUpper(3) }} className={styles.adminProfile}>
                    <span className={styles.adminLogo}><RiAdminFill /></span>
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default UpperSide;
