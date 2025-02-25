import React, { useContext, useEffect, useState } from 'react'
import styles from '../../styles/HomePageStyles/VerifyOrderEmail.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/useData';
import axios from 'axios';

const VerifyOrderEmail = ({ handleUserEntryPage }) => {
    const { dataState, dispatch } = useContext(useData);

    const location = useLocation();
    const navigate = useNavigate();
    const [OrderInformation, setOrderInformation] = useState(null);
    const [isErrorState, setError] = useState({ isError: false, message: '' });
    const [SixDigitNumber, setSixDigitNumber] = useState(null);
    const [InputDigits, setInputDigits] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
    const [isLoading, setIsLoading] = useState(false);

    const renderSixDigitVerification_Api = async () => {
        try {
            setIsLoading(true);
            const Digits = Math.floor(100000 + Math.random() * 900000);
            setSixDigitNumber(Digits);
            setError({ isError: true, message: '' });
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify-order-email`, {
                email: OrderInformation.FormInfo.email,
                digits: Digits
            }, {
                headers: {
                    Authorization: dataState.token
                }
            });
            if (!res.data.success) {
                setError({ isError: true, message: res.data.message });
            } else {
                setError({
                    isError: true,
                    message: `***We send 6 digit verification number on ${OrderInformation.FormInfo.email}. Please enter the Digits carefully***`
                });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            window.localStorage.removeItem('token');
            handleUserEntryPage(1); //* Toggle signup-login form
        }
    };

    useEffect(() => {
        if (location.state) {
            setOrderInformation(location.state);
            if (OrderInformation) {
                renderSixDigitVerification_Api();
                console.log(location.state);
                window.scrollTo(0, 0);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OrderInformation, location.state]);

    const handleDigitInput = (e) => {
        const value = e.target.value;
        if (value.length > 1) return;

        setError({ isError: false, message: '' });
        setInputDigits(prev => ({
            ...prev,
            [e.target.id]: !isNaN(Number(value)) ? value : null
        }));
    };

    const handleConfirm = async () => {
        const enteredDigits = Object.values(InputDigits).join('');
        if (enteredDigits !== String(SixDigitNumber)) {
            setError({ isError: true, message: 'Digits are not matching!' });
        } else {
            if (OrderInformation.payMethodState === 'Cash on Delivery') {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/insert-new-order`, {
                    store: OrderInformation.store,
                    FormInfo: OrderInformation.FormInfo,
                    payMethodState: OrderInformation.payMethodState
                }, {
                    headers: {
                        Authorization: dataState.token
                    }
                });
                navigate('/user-orders-page', {
                    state: { OrderInfo: res.data.OrderInfo[0], OrderProducts: res.data.OrderProducts }
                });
            } else {
                navigate('/user-orders-payment-page', {
                    state: {
                        store: OrderInformation.store,
                        FormInfo: OrderInformation.FormInfo,
                        payMethodState: OrderInformation.payMethodState
                    }
                });
            }
        }
    };



    return (
        <section className={styles['verification-order-email-main-section']}>
            {
                OrderInformation &&
                <div className={styles['verification-order-email-inner-main-section']}>{
                    isLoading ? <span className={styles['text-span']}>
                        Loading... please wait...
                    </span>
                        : <span className={styles['text-span']}> {isErrorState.message}</span>
                }

                    <div className={styles['verification-inner-input-div']}>
                        {Array.from({ length: 6 }).map((_, index) => {
                            const id = (index + 1).toString();
                            return (
                                <input
                                    key={id}
                                    type='text'
                                    value={InputDigits[id] || ''}
                                    onChange={handleDigitInput}
                                    id={id}
                                />
                            );
                        })}
                    </div>

                    <div className={styles['verification-inner-button-div']}>
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={() => !isLoading && renderSixDigitVerification_Api()}>Resend</button>
                    </div>
                </div>
            }
        </section>
    )
}

export default React.memo(VerifyOrderEmail);