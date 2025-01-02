import React, { useContext, useEffect, useState } from 'react'

import styles from '../../styles/AdminHome/ManageFooter.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';

const ManageFooter = () => {
    const { dataState, dispatch } = useContext(useData);

    const [Footer, setFooter] = useState({
        phone: '',
        location: '',
        connected_text: ''
    });

    useEffect(() => {
        if (dataState.Setting_Page) {
            // console.log(dataState.Setting_Page);
            setFooter({
                phone: dataState.Setting_Page.footer_information.phone,
                location: dataState.Setting_Page.footer_information.location,
                connected_text: dataState.Setting_Page.footer_information.connected_text
            });
        }
    }, [dataState.Setting_Page]);


    const handleOnChange = (e) => {
        setFooter((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleUpdate = async () => {
        if (window.confirm('Do want to update the footer?')) {
            try {
                await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/update-footer-changes`, Footer);
                dispatch({ type: 'update_setting_footer', payload: Footer })
            } catch (error) {
                console.log(error);
                window.alert("Error on manage footer: " + error.message);
            }
        }
    };

    return (
        <section className={styles['manage-footer-section']}>
            <div className={styles['support-text-div']}>
                <h2>Support Text</h2>
                <div>
                    <label>Phone</label>
                    <input type='text' id='phone' value={Footer.phone} placeholder='phone' onChange={handleOnChange}></input>
                </div>
                <div>
                    <label>Location</label>
                    <input type='text' id='location' value={Footer.location} placeholder='share the location' onChange={handleOnChange}></input>
                </div>
            </div>

            <div className={styles['connected-text-div']}>
                <h2>Stay Connected Text</h2>
                <input type='text' id='connected_text' value={Footer.connected_text} placeholder='text1 | text2' onChange={handleOnChange}></input>
            </div>
            <button className={styles['footer-button']} onClick={handleUpdate}>Update</button>
        </section>
    )
}

export default React.memo(ManageFooter);