import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom';
import validationSchema from '../../components/UserHome/SignInValidations';

import { SignInPost } from '../../api/SignInPost';
import styles from '../../styles/HomePageStyles/SignIn.module.css';

const UserSignIn = ({ handleUserEntryPage }) => {
  const location = useLocation();
  const currentRoute = location.pathname;

  const [dataState, setDataState] = useState({
    isButtonLoading: false,
    isEmailExist: false,
    isEmailSend: false,
    emailNotFound: false,
    error: false
  })

  const [passwordVisible, setPasswordVisible] = useState(false);


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await SignInPost(setDataState, { ...values, currentRoute });
    },
  });

  useEffect(() => {
    if (dataState.isEmailSend) {
      const timer = setTimeout(() => {
        // Open a new tab
        window.open('/', '_blank');

        // Attempt to close the current tab
        // Note: This might not work in all cases due to browser restrictions
        window.close();
      }, 120000); // 2 minutes in milliseconds

      return () => clearTimeout(timer); // Cleanup the timer if component unmounts
    }
  }, [dataState.isEmailSend]);

  return (
    <div className={`${styles.blurForm}`}>
      <form className={`${styles['form-wrapper-sign-in']}`} onSubmit={formik.handleSubmit}>
        <div className={styles.container}>
          <span className={styles.Header_name}>Sign Up</span>
          <p className={styles.para_head}><sup>*</sup>Please fill this form to create an account.</p>
          <hr />

          <div>
            {formik.touched.firstName && formik.errors.firstName ? <span><sup>*</sup>{formik.errors.firstName}</span> : <label htmlFor="firstName"><b><sup>*</sup>First Name</b></label>}
            <br /><input
              type="text"
              placeholder="first name"
              name="firstName"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
          </div>

          <div>
            {formik.touched.lastName && formik.errors.lastName ? <span><sup>*</sup>{formik.errors.lastName}</span> : <label htmlFor="lastName"><b><sup>*</sup>Last Name</b></label>}
            <br />
            <input
              type="text"
              placeholder="last name"
              name="lastName"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
          </div>

          <div>
            {formik.touched.email && formik.errors.email ? <span><sup>*</sup>{formik.errors.email}</span>
              : dataState.isEmailExist ? <span><sup>*</sup>Email already exists. Please try with another one.</span>
                : dataState.emailNotFound ? <span><sup>*</sup>Email Not Found. Please try with another email.</span>
                  : <label htmlFor="email"><b><sup>*</sup>Email</b></label>}
            <br />
            <input
              type="email"
              placeholder="email"
              name="email"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </div>

          <div>
            {formik.touched.password && formik.errors.password ? <span><sup>*</sup>{formik.errors.password}</span> : <label htmlFor="password"><b><sup>*</sup>Password</b></label>}
            <br />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="password"
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
              />
              Show Password
            </label>
          </div>


          <br />
          {dataState.isEmailSend ? <span className={styles.returnMessage}><sup>*</sup>Email Confirmation sent. Please confirm it.</span>
            : dataState.error ? <span className={styles.returnMessage}><sup>*</sup>There is something wrong!</span>
              : <p>I already have an account <Link onClick={() => handleUserEntryPage(2)}>Log In</Link>.</p>}

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
                dataState.isButtonLoading ? <AiOutlineLoading3Quarters className={styles.loading_icon} /> : 'Sign In'
              }</button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default UserSignIn;
