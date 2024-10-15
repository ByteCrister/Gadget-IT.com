import React from 'react'
import { RiAccountCircleLine } from "react-icons/ri";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaMapLocationDot } from "react-icons/fa6";
import { BsKey } from "react-icons/bs";
import { SlLogout } from "react-icons/sl";


import styles from '../../../styles/HomePageStyles/Account.module.css';
import { useNavigate } from 'react-router-dom';

const AccountButtonStates = ({ setButtonState, UserInformation }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Do you want to logout?')) {
            window.localStorage.removeItem('token');
            navigate('/');
            window.location.reload();
        }
    }

    return (
        <div>
            <div className={styles.MainOuterStates}>

                <section>
                    <div onClick={() => setButtonState(0)}>
                        <RiAccountCircleLine className={styles.BtnIcon} />
                        <span>{UserInformation.f_name} {UserInformation.l_name}</span>
                    </div>
                    <hr></hr>
                </section>

                <div onClick={() => setButtonState(1)}>
                    <HiOutlineShoppingCart className={styles.BtnIcon} />
                    <span>My Orders</span>
                </div>

                <div onClick={() => setButtonState(2)}>
                    <FaMapLocationDot className={styles.BtnIcon} />
                    <span>Address</span>
                </div>

                <div onClick={() => setButtonState(3)}>
                    <BsKey className={styles.BtnIcon} />
                    <span>Change Password</span>
                </div>

                <div onClick={handleLogout}>
                    <SlLogout className={styles.BtnIcon} />
                    <span>Logout</span>
                </div>

            </div>
        </div>
    )
}

export default AccountButtonStates