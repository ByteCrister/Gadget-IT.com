import React, { useCallback, useContext, useState } from 'react';
import axios from 'axios';

import styles from '../../../styles/HomePageStyles/Address.module.css';
import { useData } from '../../../context/useData';

const Address = ({ AddressInfo, setUserAddress }) => {
    const { dataState } = useContext(useData);
    const [address, setAddress] = useState({});
    const [returnState, setReturnState] = useState({
        success: false,
        error: false,
        validationError: ""
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

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        return phone.length >= 10 && phone.length <= 15; // Example range for phone number length
    };

    const checkValidation = () => {
        for (const [key, value] of Object.entries(address)) {
            if (!value || String(value).trim().length === 0) {
                setReturnState(prev => ({
                    ...prev,
                    validationError: `${key.replace('_', ' ')} is required`
                }));
                return false;
            }
        }

        if (!validateEmail(address.email)) {
            setReturnState(prev => ({
                ...prev,
                validationError: 'Invalid email format'
            }));
            return false;
        }

        if (!validatePhoneNumber(address.phone_number)) {
            setReturnState(prev => ({
                ...prev,
                validationError: 'Phone number must be between 10 and 15 digits'
            }));
            return false;
        }

        setReturnState(prev => ({
            ...prev,
            validationError: ''
        }));
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
        });
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
        <section className={styles.MainOuterFirstAddress}>
            <section className={styles.MainOuterAddress}>
                <section className={styles.Upper}>
                    <span>
                        {returnState.error ? '***There was an error! Please try again.***' :
                         returnState.success ? '*Address Updated Successfully*' :
                         returnState.validationError ? `*${returnState.validationError}*` :
                         'Update Address'}
                    </span>
                </section>

                <section className={styles.Bottom}>
                    <section>
                        <div>
                            <label>First Name<sup>*</sup></label>
                            <input
                                type='text'
                                name='first_name'
                                value={address.first_name || ''}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div>
                            <label>Last Name<sup>*</sup></label>
                            <input
                                type='text'
                                name='last_name'
                                value={address.last_name || ''}
                                onChange={handleOnChange}
                            />
                        </div>
                    </section>
                    <section>
                        <div>
                            <label>Phone Number<sup>*</sup></label>
                            <input
                                type='number'
                                name='phone_number'
                                value={address.phone_number || ''}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div>
                            <label>Email<sup>*</sup></label>
                            <input
                                type='text'
                                name='email'
                                value={address.email || ''}
                                onChange={handleOnChange}
                            />
                        </div>
                    </section>
                    <div>
                        <label>Address 1<sup>*</sup></label>
                        <input
                            type='text'
                            name='address_1'
                            value={address.address_1 || ''}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div>
                        <label>Address 2</label>
                        <input
                            type='text'
                            name='address_2'
                            value={address.address_2 || ''}
                            onChange={handleOnChange}
                        />
                    </div>
                </section>

                <section className={styles.Button}>
                    <button onClick={handleSubmit}>Update Address</button>
                </section>
            </section>
        </section>
    );
}

export default Address;
