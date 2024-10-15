import React, { useState } from 'react';
import { useFormik } from 'formik';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from '../../styles/HomePageStyles/SignIn.module.css';
import ForgotPassValidation from '../../components/UserHome/ForgotPassValidation';
import { ForgotPassApi } from '../../api/ForgotPassApi';

const ForgotPass = ({ handleUserEntryPage }) => {

    const [dataState, setDataState] = useState({
        isButtonLoading: false,
        emailNotFound: false,
        emailSend: false,
        error : false
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: ForgotPassValidation,
        onSubmit: async (values) => {
            await ForgotPassApi(values, setDataState);
        },
    });

    return (
        <div className={`${styles.blurForm}`}>
            <form className={`${styles['form-wrapper-forgot-pass']}`} onSubmit={formik.handleSubmit}>
                <div className={styles.container}>
                    <span className={styles.Header_name}>Forgot Password</span>
                    <hr />

                    <div>
                        {formik.touched.email && formik.errors.email && <span><sup>*</sup>{formik.errors.email}</span>}<br />
                        {dataState.emailNotFound && <span><sup>*</sup>Email not found. Please try another one.</span>}
                        <label htmlFor="email"><b><sup>*</sup>Email</b></label><br />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>


                    <div>
                        {formik.touched.password && formik.errors.password && <span><sup>*</sup>{formik.errors.password}</span>}<br />
                        {dataState.emailSend && <span><sup>*</sup>Email Confirmation sent. Please confirm it.</span>}
                        {dataState.error && <span><sup>*</sup>Internal server error. Please check you internet connection.</span>}
                        <label htmlFor="password"><b><sup>*</sup>Set New Password</b></label><br />
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter Password"
                            name="password"
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                    </div>

                    <div className={styles.showPassword}>
                        <label>
                            <input
                                type="checkbox"
                                checked={passwordVisible}
                                onChange={() => setPasswordVisible(!passwordVisible)}
                            /> Show Password
                        </label>
                    </div>



                    <section className={styles.clearfix}>
                        <button
                            type="button"
                            className={styles.cancelbtn}
                            onClick={() => { handleUserEntryPage(0) }}
                        >Cancel</button>
                        <button
                            type="submit"
                            className={styles.signupbtn}
                        >{
                                dataState.isButtonLoading ? <AiOutlineLoading3Quarters className={styles.loading_icon}/> : 'Send Email Confirmation'
                            }</button>
                    </section>
                </div>
            </form>
        </div>
    );
};

export default ForgotPass;
