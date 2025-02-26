import React from 'react';
import { LuCable } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdInventory2 } from "react-icons/md";
import { RiStore3Fill } from "react-icons/ri";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { MdReportGmailerrorred } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { AiFillWarning } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";

import styles from '../../styles/AdminHome/admin.home.module.css';
import AdminSearchBar from './AdminSearchBar';

const ButtonStore = [
    {
        title: "Dashboard",
        icon: <LuLayoutDashboard />
    },
    {
        title: "Inventory",
        icon: <MdInventory2 />
    },
    {
        title: "Production",
        icon: <RiStore3Fill />
    },
    {
        title: "Orders",
        icon: <MdOutlineLocalGroceryStore />
    },
    {
        title: "Reports",
        icon: <MdReportGmailerrorred />
    },
    {
        title: "Users",
        icon: <FaUsers />
    },
    {
        title: "Support",
        icon: <AiFillWarning />
    },
    {
        title: "Setting",
        icon: <IoSettingsSharp />
    }
]

const LeftSide = ({ page, handlePage }) => {

    return (
        <>
            <div className={styles.log_name}>
                <span className={styles.logo}><LuCable /></span>
                <span className={styles.name}>GADGET IT</span>
            </div>

            <AdminSearchBar />

            <div className={styles.button}>
                {
                    ButtonStore.map((item, index) => {
                        return <div key={`admin-btn-state-${index}`} onClick={() => { handlePage(index + 1) }} className={`${page === index + 1 ? styles.active_background : styles.buttons}`}>
                            <span className={`${page === index + 1 ? styles.active_text_logo : styles.ButtonLogo}`}>{item.icon}</span>
                            <span className={`${page === index + 1 ? styles.active_text : styles.ButtonName}`}>{item.title}</span>
                        </div>
                    })
                }
            </div>
        </>

    );
}

export default LeftSide;
