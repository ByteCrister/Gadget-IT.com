import React, { useContext, useEffect, useState } from 'react'
import styles from '../../styles/HomePageStyles/VerifyOrderEmail.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/useData';
import axios from 'axios';

const VerifyOrderEmail = () => {
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
            const res = await axios.post('http://localhost:7000/verify-order-email', {
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
            dispatch({ type: 'toggle_isServerIssue', payload: true });
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

    }, [OrderInformation]);

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
                const res = await axios.post('http://localhost:7000/insert-new-order', {
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
                        Loading...
                    </span>
                        : <span className={styles['text-span']}> {isErrorState.message}</span>
                }

                    <div className={styles['verification-inner-input-div']}>
                        <input type='text' value={InputDigits['1']} onChange={handleDigitInput} id='1'></input>
                        <input type='text' value={InputDigits['2']} onChange={handleDigitInput} id='2'></input>
                        <input type='text' value={InputDigits['3']} onChange={handleDigitInput} id='3'></input>
                        <input type='text' value={InputDigits['4']} onChange={handleDigitInput} id='4'></input>
                        <input type='text' value={InputDigits['5']} onChange={handleDigitInput} id='5'></input>
                        <input type='text' value={InputDigits['6']} onChange={handleDigitInput} id='6'></input>
                    </div>
                    <div className={styles['verification-inner-button-div']}>
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={() => renderSixDigitVerification_Api()}>Resend</button>
                    </div>
                </div>
            }
        </section>
    )
}

export default VerifyOrderEmail