import React from 'react'
import { CiMobile3 } from "react-icons/ci";
import { BiMessageCheck } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";

import styles from '../../styles/HomePageStyles/UserSupportBoxes..module.css';


const UserSupportBoxes = () => {
    return (
        <section className={styles.userSupportContainer}>

            <div className={styles.innerMain}>
                <div className={styles.logo_icon}>
                    <CiMobile3 className={styles.support_icon} />
                </div>
                <div className={styles.head_name}>
                    <h3>Outfit Finder</h3>
                    <span>Find Outfit for Gadgets</span>
                </div>
            </div>

            <div className={styles.innerMain}>
                <div className={styles.logo_icon}>
                    <BiMessageCheck className={styles.support_icon} />
                </div>
                <div className={styles.head_name}>
                    <h3>Share Experience</h3>
                    <span>We value your Feedback</span>
                </div>
            </div>

            <div className={styles.innerMain}>
                <div className={styles.logo_icon}>
                    <BsWhatsapp className={styles.support_icon} />
                </div>
                <div className={styles.head_name}>
                    <h3>Online Support</h3>
                    <span>Get Support On Whatsapp</span>
                </div>
            </div>

            <div className={styles.innerMain}>
                <div className={styles.logo_icon}>
                    <IoSettingsSharp className={styles.support_icon} />
                </div>
                <div className={styles.head_name}>
                    <h3>GadgetIT Care</h3>
                    <span>Repair Your Device</span>
                </div>
            </div>

        </section>
    )
}

export default UserSupportBoxes