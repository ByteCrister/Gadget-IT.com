import React, { useContext, useEffect, useState } from 'react';
import { IoNotifications } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

import axios from 'axios';

import styles from '../../styles/AdminHome/admin.home.module.css';
import { useData } from '../../context/useData';

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


    // *---------------- Admin LogOut ------------------------
    const handleLogout = () => {
        if (window.confirm('Do want to log out?')) {
            dispatch({ type: 'set_home_view', payload: { isAdmin: false, isUserLoggedIn: false, token: false } })
            window.localStorage.clear();
        }
    }

    return (
        <div className={styles.upperSide}>
            <div className={styles.contents}>

                <section>
                    <div onClick={() => { handleUpper(2); }} className={styles.adminProfile}>
                        <span className={styles.adminLogo}><RiAdminFill /></span>
                    </div>
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
                </section>

                <button onClick={handleLogout}><FiLogOut className={styles.logoutIcon} /></button>
            </div>
            <hr></hr>
        </div>
    );
}

export default UpperSide;
