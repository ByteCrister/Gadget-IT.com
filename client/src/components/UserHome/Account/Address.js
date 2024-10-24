import React, { useCallback, useContext, useState } from 'react'
import styles from '../../../styles/HomePageStyles/Address.module.css';
import axios from 'axios';
import { useData } from '../../../context/useData';

const Address = ({ AddressInfo, setUserAddress }) => {
    const { dataState } = useContext(useData);
    const [address, setAddress] = useState({});
    const [returnState, setReturnState] = useState({
        success: false,
        error: false
    });

    useState(() => {
        if (AddressInfo) {
            Object.entries(AddressInfo).forEach(([key, value]) => setAddress((prev) => ({ ...prev, [key]: value })));
        }
    }, []);

    const handleOnChange = useCallback((e) => {
        setAddress((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }, []);

    const checkValidation = () => {
        Object.entries(address).forEach(([key, value]) => {
            if (value && String(value).trim().length === 0) {
                return false;
            }
        })

        return true;
    };

    const handleState = (state) => {
        setReturnState((prev) => ({
            ...prev,
            [state]: !prev[state]
        }));

        setTimeout(() => {
            setReturnState((prev) => ({
                ...prev,
                [state]: !prev[state]
            }));
        }, 2000);
    };

    const updateAddress = () => {
        Object.entries(address).forEach(([key, value]) => {
            setUserAddress((prev) => ({
                ...prev,
                [key]: value
            }));
        })
    };

    const handleSubmit = async () => {
        if (checkValidation()) {
            try {
                await axios.post('http://localhost:7000/update-user-address', address, {
                    headers: {
                        Authorization: dataState.token
                    }
                });
                handleState('success');
                updateAddress();

            } catch (error) {
                handleState('error');
                console.log(error);
            }
        }
    };

    return (
        <section className={styles.MainOuterAddress}>
            <section className={styles.Upper}>
                <span>{
                    returnState.error ? '***There occurs an Error! Please try again.***' : returnState.success ? '*Address Updated Successfully*' : 'Update Address'
                }</span>
            </section>

            <section className={styles.Bottom}>
                <section>
                    <div>
                        <label>First Name<sup>*</sup></label>
                        <input type='text' name='first_name' value={address.first_name} onChange={handleOnChange}></input>
                    </div>
                    <div>
                        <label>Last Name<sup>*</sup></label>
                        <input type='text' name='last_name' value={address.last_name} onChange={handleOnChange}></input>
                    </div>
                </section>
                <section>
                    <div>
                        <label>Phone Number<sup>*</sup></label>
                        <input type='number' name='phone_number' value={address.phone_number} onChange={handleOnChange}></input>
                    </div>
                    <div>
                        <label>Email<sup>*</sup></label>
                        <input type='text' name='email' value={address.email} onChange={handleOnChange}></input>
                    </div>
                </section>
                <div>
                    <label>Address 1<sup>*</sup></label>
                    <input type='text' name='address_1' value={address.address_1} onChange={handleOnChange}></input>
                </div>
                <div>
                    <label>Address 2<sup>*</sup></label>
                    <input type='text' name='address_2' value={address.address_2} onChange={handleOnChange}></input>
                </div>
            </section>

            <section className={styles.Button}>
                <button onClick={handleSubmit}>Update Address</button>
            </section>
        </section>
    )
}

export default Address