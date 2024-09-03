import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from '../../styles/HomePageStyles/SignIn.module.css';
import { Link, useLocation } from 'react-router-dom';
import LoginValidations from '../../components/UserHome/LoginValidations';
import { LoginPost } from '../../api/LoginPost';
import { useData } from '../../context/useData';

const UserLogin = ({ handleUserEntryPage }) => {
  const { dispatch } = useContext(useData)
  const location = useLocation();
  const path = location.pathname;

  const [dataState, setDataState] = useState({
    isButtonLoading: false,
    emailNotFound: false,
    passNotMatch: false,
    adminPassNotMatched : false,
    isExternalError : false
  });


  const [passwordVisible, setPasswordVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginValidations,
    onSubmit: async (values) => {
      await LoginPost(setDataState, {...values, path}, dispatch, handleUserEntryPage);
    },
  });

  return (
    <div className={`${styles.blurForm}`}>
      <form className={`${styles['form-wrapper']}`} onSubmit={formik.handleSubmit}>
        <div className={styles.container}>
          <span className={styles.Header_name}>Log In</span>
          <p className={styles.para_head}><sup>*</sup>Please fill this form to log in to your account.</p>
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
            {dataState.passNotMatch && <span><sup>*</sup>Password not matched. Please try again</span>}
            {dataState.adminPassNotMatched && <span><sup>*</sup> Admin password not matched. Please try again</span>}
            {dataState.isExternalError && <span><sup>*</sup> There is some external errors. Please try again</span>}
            <label htmlFor="password"><b><sup>*</sup>Password</b></label><br />
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

          <br />
          <p>I don't have an account <Link onClick={() => handleUserEntryPage(1)}>Sign Up</Link>.</p>
          <p><Link onClick={() => handleUserEntryPage(4)}>Forgot Password!</Link>.</p>

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
                dataState.isButtonLoading ? <AiOutlineLoading3Quarters className={styles.loading_icon} /> : 'Log In'
              }</button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
