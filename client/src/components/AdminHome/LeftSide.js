import React from 'react';
import styles from '../../styles/admin.home.module.css';
import { LuCable } from "react-icons/lu";
import { BiSearchAlt2 } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdInventory2 } from "react-icons/md";
import { RiStore3Fill } from "react-icons/ri";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { MdReportGmailerrorred } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { AiFillWarning } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";


const LeftSide = ({ page, handlePage }) => {
    return (
        <>
            <div className={styles.log_name}>
                <span className={styles.logo}><LuCable /></span>
                <span className={styles.name}>GADGET IT</span>
            </div>

            <div className={styles.search_bar}>
                <span className={styles.search_logo}><BiSearchAlt2 /></span>
                <input type='text' name='search' id={styles.search} placeholder='Search...'></input>
            </div>

            <div className={styles.button}>

                <div onClick={() => { handlePage(1) }} className={`${page === 1 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 1 ? styles.active_text_logo : styles.ButtonLogo}`}><LuLayoutDashboard /></span>
                    <span className={`${page === 1 ? styles.active_text : styles.ButtonName}`}>Dashboard</span>
                </div>
                <div onClick={() => { handlePage(2) }} className={`${page === 2 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 2 ? styles.active_text_logo : styles.ButtonLogo}`}><MdInventory2 /></span>
                    <span className={`${page === 2 ? styles.active_text : styles.ButtonName}`}>Inventory</span>
                </div>
                <div onClick={() => { handlePage(3) }} className={`${page === 3 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 3 ? styles.active_text_logo : styles.ButtonLogo}`}><RiStore3Fill /></span>
                    <span className={`${page === 3 ? styles.active_text : styles.ButtonName}`}>Production</span>
                </div>
                <div onClick={() => { handlePage(4) }} className={`${page === 4 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 4 ? styles.active_text_logo : styles.ButtonLogo}`}><MdOutlineLocalGroceryStore /></span>
                    <span className={`${page === 4 ? styles.active_text : styles.ButtonName}`}>Orders</span>
                </div>
                <div onClick={() => { handlePage(5) }} className={`${page === 5 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 5 ? styles.active_text_logo : styles.ButtonLogo}`}><MdReportGmailerrorred /></span>
                    <span className={`${page === 5 ? styles.active_text : styles.ButtonName}`}>Reports</span>
                </div>
                <div onClick={() => { handlePage(6) }} className={`${page === 6 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 6 ? styles.active_text_logo : styles.ButtonLogo}`}><FaUsers /></span>
                    <span className={`${page === 6 ? styles.active_text : styles.ButtonName}`}>Users</span>
                </div>
                <div onClick={() => { handlePage(7) }} className={`${page === 7 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 7 ? styles.active_text_logo : styles.ButtonLogo}`}><AiFillWarning /></span>
                    <span className={`${page === 7 ? styles.active_text : styles.ButtonName}`}>Support</span>
                </div>
                <div onClick={() => { handlePage(8) }} className={`${page === 8 ? styles.active_background : styles.buttons}`}>
                    <span className={`${page === 8 ? styles.active_text_logo : styles.ButtonLogo}`}><IoSettingsSharp /></span>
                    <span className={`${page === 8 ? styles.active_text : styles.ButtonName}`}>Setting</span>
                </div>

            </div>
        </>

    );
}

export default LeftSide;
