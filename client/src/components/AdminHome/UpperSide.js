import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/admin.home.module.css';
import { IoNotifications } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { useData } from '../../context/useData';
import axios from 'axios';

const UpperSide = ({ handleUpper }) => {
    const { dataState, dispatch } = useContext(useData);
    const [Notifications, setNotifications] = useState(0);

    useEffect(() => {
        if (dataState?.Outer_Page) {
            setNotifications(dataState.Outer_Page.notification_admin.length - dataState.Outer_Page.admin_count);
            // console.log(dataState.Outer_Page);
        }
    }, [dataState.Outer_Page]);

    const UpdateAdminCountApi = async (count) => {
        try {
            await axios.patch(`http://localhost:7000/update-admin-count/${count}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = async () => {
        dispatch({
            type: 'set_new_admin_count',
            payload: await dataState.Outer_Page.notification_admin.length
        });
        await UpdateAdminCountApi(dataState.Outer_Page.notification_admin.length);
    };

    return (
        <div className={styles.upperSide}>
            <div className={styles.contents}>
                <div onClick={() => {
                    if (dataState.Outer_Page.notification_admin.length > 0) {
                        handleUpper(1);
                        handleClick();
                    }
                }}
                    className={styles.notifications}>
                    <span className={styles.bellLogo}><IoNotifications /></span>
                    <span className={styles.notificationCount}>{Notifications}</span>
                </div>
                <div onClick={() => { handleUpper(2); }} className={styles.adminProfile}>
                    <span className={styles.adminLogo}><RiAdminFill /></span>
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default UpperSide;
