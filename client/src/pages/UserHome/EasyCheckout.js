import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/HomePageStyles/EasyCheckout.module.css';
import { FaCheck } from 'react-icons/fa';
import { useData } from '../../context/useData';

const EasyCheckout = () => {
    const {  dispatch } = useContext(useData);
    const location = useLocation();
    const navigate = useNavigate();
    const [store, setStore] = useState([]);
    const [payMethodState, setPayMethodState] = useState(1);
    const [FormInfo, setFormInfo] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
    });

    const [totals, setTotals] = useState({
        subTotal: 0,
        total: 0
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (location.state?.source === 'product') {
            setStore([location.state]);
        } else if (location.state?.source === 'cart') {
            setStore(location.state.cartStorage || []);
        }
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        if (store.length > 0) {
            setTotals({
                subTotal: store.reduce((s, c) => s + Number(c.price), 0),
                total: store.reduce((s, c) => s + Number(c.price * c.quantity), 0),
            });
            console.log(store);
        }
    }, [store]);


    const getButtons = (buttonNo) => {
        return payMethodState === buttonNo ?
            <button className={styles['active-payBtn']} ><div><FaCheck className={styles['payBtn-icon']} /><span> {buttonNo === 1 ? 'Cash on Delivery' : 'Online Payment'}</span></div></button>
            : <button className={styles['default-payBtn']} onClick={() => setPayMethodState(buttonNo)}>{buttonNo === 1 ? 'Cash on Delivery' : 'Online Payment'}</button>
    };

    const handleForm = (e) => {
        setFormInfo(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    };


    const handleIncDec = (key, product_id) => {
        setStore((prev) => prev.map((product) => {
            return product.product_id === product_id
                ? {
                    ...product, quantity: key === '-' && product.quantity > 1
                        ? product.quantity - 1 : key === '+'
                            ? product.quantity + 1 : product.quantity
                }
                : product
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!FormInfo.full_name.trim()) {
            errors.full_name = 'Full Name is required';
        }
        if (!FormInfo.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(FormInfo.email)) {
            errors.email = 'Email address is invalid';
        }
        if (!FormInfo.phone_number.trim()) {
            errors.phone_number = 'Phone Number is required';
        } else if (!/^\d{11}$/.test(FormInfo.phone_number)) {
            errors.phone_number = 'Phone Number should be 11 digits';
        }
        if (!FormInfo.address.trim()) {
            errors.address = 'Address is required';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form is valid. Proceeding to payment or order confirmation.");
            navigate('/verify-order-email', {
                state: {
                    store: store,
                    FormInfo: FormInfo,
                    payMethodState: payMethodState === 1 ? 'Cash on Delivery' : 'Online Payment'
                }
            });
          
        } else {
            console.log("Form has errors. Fix errors before submitting.");
            dispatch({ type: 'toggle_isServerIssue', payload: true });
            console.log(JSON.stringify(errors, null, 2));
        }
    };


    return (
        <section className={styles['main-checkout-container']}>
            {/* --------- section 1 ------- */}
            <section className={styles['checkout-left-container']}>
                <div className={styles['pay-button-section']}>
                    <span>Payment Method</span>
                    <div className={styles['pay-buttons']}>
                        {getButtons(1)}
                        {getButtons(2)}
                    </div>
                </div>
                <div className={styles['checkout-main-form-container']}>
                    <form className={styles['checkout-form']} onSubmit={handleSubmit}>
                        <span className={styles['form-span']}>Billing Details</span>
                        <div className={styles['form-div-container']}>
                            <label htmlFor='Full Name'>{errors.full_name ? errors.full_name : 'Full Name'}<sup> *</sup></label>
                            <input type='text' id='full_name' value={FormInfo.full_name} onChange={handleForm} required placeholder='Full Name'></input>
                        </div>
                        <div className={styles['form-div-container']}>
                            <label htmlFor='email'>{errors.email ? errors.email : 'Email'}<sup> *</sup></label>
                            <input type='email' id='email' value={FormInfo.email} onChange={handleForm} required placeholder='Email'></input>
                        </div>
                        <div className={styles['form-div-container']}>
                            <label htmlFor='Phone Number'>{errors.phone_number ? errors.phone_number : 'Phone Number'}<sup> *</sup></label>
                            <input type='tel' id='phone_number' value={FormInfo.phone_number} required onChange={handleForm} placeholder='Phone Number'></input>
                        </div>
                        <div className={styles['form-div-container']}>
                            <label htmlFor='Full Address'>{errors.address ? errors.address : 'Full Address'}<sup> *</sup></label>
                            <textarea id='address' onChange={handleForm} required placeholder='Address... floor no., flat no., street, road, area name, district, division'></textarea>
                        </div>
                        <button type='submit' className={styles['checkout-btn']} >{payMethodState === 1 ? 'Confirm Order' : 'Process To Payment'}</button>
                    </form>
                </div>
            </section>

            {/* --------- section 2 ------- */}
            <section className={styles['checkout-right-container']}>
                <section className={styles['checkout-right-inner-container']}>
                    <span className={styles['checkout-right-inner-span']}>Your Order</span>

                    {
                        store &&
                        store.length > 0 &&
                        store.map((product) => {
                            return <section key={product.product_id} className={styles['checkout-product-orders']}>
                                <Link to={`/view/${product.main_category}/${product.product_id}`} className={styles['order-checkout-image-name-link']}>
                                    <div className={styles['order-checkout-image-name']}>
                                        <div>
                                            <img src={product.image} alt={product.product_id} ></img>
                                        </div>
                                        <span>{product.product_name}</span>
                                    </div>
                                </Link>
                                <div className={styles['checkout-inc-dec-div']}>
                                    <div className={styles['checkout-inc-dec']}>
                                        <button onClick={() => handleIncDec('-', product.product_id)}>-</button>
                                        <span>{product.quantity}</span>
                                        <button onClick={() => handleIncDec('+', product.product_id)}>+</button>
                                    </div>
                                    <span className={styles['checkout-span-price']}>{product.price}</span>
                                </div>
                            </section>
                        })

                    }

                    <div className={styles['checkout-hr-div']}></div>
                </section>
                <section className={styles['checkout-price-main-section']}>
                    <div className={styles['checkout-sub-total']}>
                        <span>Subtotal</span>
                        <span>BDT {totals.subTotal}</span>
                    </div>
                    <div className={styles['checkout-hr-div']}></div>
                    <div className={styles['checkout-total']}>
                        <span>Total</span>
                        <span>BDT {totals.total}</span>
                    </div>
                </section>
            </section>
        </section>
    );
};

export default EasyCheckout;
