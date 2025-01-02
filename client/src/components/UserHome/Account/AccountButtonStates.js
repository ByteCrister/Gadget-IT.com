import React, { useContext, useEffect, useState } from 'react'
import { RiAccountCircleLine } from "react-icons/ri";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineReport } from "react-icons/md";

import { BsKey } from "react-icons/bs";
import { SlLogout } from "react-icons/sl";


import styles from '../../../styles/HomePageStyles/Account.module.css';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../../context/useData';
import axios from 'axios';

const AccountButtonStates = ({ UserInformation }) => {
    const { dataState, dispatch } = useContext(useData);
    const navigate = useNavigate();
    const [CountOfNotifications, setCountOfNotifications] = useState(0);

    useEffect(() => {
        if (dataState?.User_Notifications) {
            setCountOfNotifications(dataState.User_Notifications.notifications.length - dataState.User_Notifications.user_notification_count);
        }
    }, [dataState.User_Notifications]);

    const UpdateCountApi = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/update-user-notification-count/${dataState.User_Notifications.notifications.length}`, {
                headers: {
                    Authorization: dataState.token
                }
            });
        } catch (error) {
            dispatch({ type: 'isServerIssue', payload: true });
            console.log(error);
        }
    }

    const handleUpdateCount = async () => {
        await UpdateCountApi();
        dispatch({ type: 'set_user_new_notification_count', payload: dataState.User_Notifications.notifications.length });
    };

    const handleLogout = () => {
        if (window.confirm('Do you want to logout?')) {
            window.localStorage.removeItem('token');
            navigate('/');
            window.location.reload();
        }
    }

    return (
        <div className={styles.OuterMainMyOrder}>
            <div className={styles.MainOuterStates}>

                <section>
                    <button onClick={() => dispatch({ type: 'set_profile_button_state', payload: 0 }) }>
                        <RiAccountCircleLine className={styles.BtnIcon} />
                        <span>{UserInformation.f_name} {UserInformation.l_name}</span>
                    </button>
                    <hr></hr>
                </section>

                <button className={styles['count-of-message-main-div']} onClick={() => { dispatch({ type: 'set_profile_button_state', payload: 1 }); handleUpdateCount(); }}>
                    <span className={styles['count-of-message-span']}>{`( ${CountOfNotifications} )`}</span>
                    <HiOutlineShoppingCart className={styles.BtnIcon} />
                    <span>Messages</span>
                </button>
                <button onClick={() => dispatch({ type: 'set_profile_button_state', payload: 2 }) }>
                    <HiOutlineShoppingCart className={styles.BtnIcon} />
                    <span>My Orders</span>
                </button>

                <button onClick={() => dispatch({ type: 'set_profile_button_state', payload: 3 }) }>
                    <MdOutlineReport className={styles.BtnIcon} />
                    <span>Report</span>
                </button>
                <button onClick={() => dispatch({ type: 'set_profile_button_state', payload: 4 })}>
                    <FaMapLocationDot className={styles.BtnIcon} />
                    <span>Address</span>
                </button>

                <button onClick={() =>dispatch({ type: 'set_profile_button_state', payload: 5 })}>
                    <BsKey className={styles.BtnIcon} />
                    <span>Change Password</span>
                </button>

                <button onClick={handleLogout}>
                    <SlLogout className={styles.BtnIcon} />
                    <span>Logout</span>
                </button>

            </div>
        </div>
    )
}

export default AccountButtonStates