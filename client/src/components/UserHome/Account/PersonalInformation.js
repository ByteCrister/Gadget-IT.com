import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';

import styles from '../../../styles/HomePageStyles/PersonalInformation.module.css';
import { useData } from '../../../context/useData';

const PersonalInformation = ({ UserInformation }) => {
    const { dataState } = useContext(useData);
    const [userForm, setUserForm] = useState({});

    const [updateMessage, setUpdateMessage] = useState({ isSuccess: false, isError: false });

    useEffect(() => {
        if (UserInformation && UserInformation.f_name) {
            setUserForm((prev) => ({
                ...prev,
                f_name: UserInformation.f_name,
                l_name: UserInformation.l_name,
                email: UserInformation.email
            }))
        }
    }, [UserInformation]);

    const handleChange = (e) => {
        setUserForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleUpdateMessage = (state) => {
        setUpdateMessage((prev) => ({
            ...prev,
            [state]: !prev[state]
        }));
        setTimeout(() => {
            setUpdateMessage((prev) => ({
                ...prev,
                [state]: !prev[state]
            }));
        }, 2000);

    }

    const handleChangeInformation = async () => {
        if (userForm.f_name.trim().length !== 0 && userForm.f_name.trim().length > 3 && userForm.l_name.trim().length !== 0 && userForm.l_name.trim().length > 3) {
            try {
                await axios.post('http://localhost:7000/update-user-personal-information', userForm, {
                    headers: {
                        Authorization: dataState.token
                    }
                });

                handleUpdateMessage('isSuccess');
            } catch (error) {
                handleUpdateMessage('isError');
                console.log(error);
            }
        }
    }

    return (
        <section className={styles.MainPersonalFormOuter}>
            <section className={styles.PersonalInformationOuter}>
                {
                    updateMessage.isSuccess && <span className={styles.updateLine}><sup>*</sup>Your Information updated successfully.</span>
                }
                {
                    updateMessage.isError && <span className={styles.updateLine}><sup>***</sup>There occurs an error!. Please try again later.</span>
                }
                <span className={styles.headline}>Personal Info</span>

                <section>
                    <div>
                        <label>First Name</label>
                        <input type='text' name='f_name' placeholder={userForm.f_name} value={userForm.f_name} onChange={(e) => handleChange(e)}></input>
                    </div>

                    <div>
                        <label>Last Name</label>
                        <input type='text' name='l_name' placeholder={userForm.l_name} value={userForm.l_name} onChange={(e) => handleChange(e)}></input>
                    </div>
                </section>

                <div className={styles.userEmail}>
                    <label>Email</label>
                    <input type='text' name='email' value={userForm.email} disabled></input>
                </div>

                <button onClick={handleChangeInformation}>Update</button>
            </section>
        </section>
    )
}

export default PersonalInformation