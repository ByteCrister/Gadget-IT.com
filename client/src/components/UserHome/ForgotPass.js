import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import styles from '../../styles/HomePageStyles/SignIn.module.css';
import ForgotPassValidation from '../../components/UserHome/ForgotPassValidation';
import { useData } from '../../context/useData';
import { ForgotPassApi } from '../../api/ForgotPassApi';

const ForgotPass = ({ handleUserEntryPage }) => {

    const { dispatch } = useContext(useData)

    const [dataState, setDataState] = useState({
        isButtonLoading: false,
        emailNotFound: false,
        emailSend: false
    });

    const handleLoginStates = (newState) => {
        setDataState(prevState => ({
            ...prevState,
            ...newState
        }));
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: ForgotPassValidation,
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            ForgotPassApi(values, handleLoginStates);
        },
    });

    return (
        <div className={`${styles.blurForm}`}>
            <form className={`${styles['form-wrapper']}`} onSubmit={formik.handleSubmit}>
                <div className={styles.container}>
                    <h1 className={styles.Header_name}>Forgot Password</h1>
                    <hr />
                    <label htmlFor="email"><b>Email</b></label><br />
                    {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}<br />
                    {dataState.emailNotFound && <span>Email not found. Please try another one.</span>}
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />



                    <label htmlFor="password"><b>Set New Password</b></label><br />
                    {formik.touched.password && formik.errors.password && <span>{formik.errors.password}</span>}<br />
                    {dataState.emailSend && <span>Email Confirmation sent. Please confirm it.</span>}
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter Password"
                        name="password"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={passwordVisible}
                            onChange={() => setPasswordVisible(!passwordVisible)}
                        /> Show Password
                    </label>
                    <br />




                    <div className={styles.clearfix}>
                        <button
                            type="button"
                            className={styles.cancelbtn}
                            onClick={() => { handleUserEntryPage(0) }}
                        >Cancel</button>
                        <button
                            type="submit"
                            className={styles.signupbtn}
                        >{
                                dataState.isButtonLoading ? 'Loading... please wait' : 'Send Email Confirmation'
                            }</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ForgotPass;
