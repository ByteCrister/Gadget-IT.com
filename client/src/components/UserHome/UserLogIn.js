import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import styles from '../../styles/HomePageStyles/SignIn.module.css';
import { Link } from 'react-router-dom';
import LoginValidations from '../../components/UserHome/LoginValidations';
import { LoginPost } from '../../api/LoginPost';
import { useData } from '../../context/useData';

const UserLogin = ({ handleUserEntryPage }) => {
  const { dispatch } = useContext(useData)

  const [dataState, setDataState] = useState({
    isButtonLoading: false,
    emailNotFound: false,
    passNotMatch: false
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
    validationSchema: LoginValidations,
    onSubmit: (values) => {
      LoginPost(handleLoginStates, values, dispatch, handleUserEntryPage);
    },
  });

  return (
    <div className={`${styles.blurForm}`}>
      <form className={`${styles['form-wrapper']}`} onSubmit={formik.handleSubmit}>
        <div className={styles.container}>
          <h1 className={styles.Header_name}>Log In</h1>
          <p className={styles.para_head}>Please fill in this form to log in to your account.</p>
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

          <label htmlFor="password"><b>Password</b></label><br />
          {formik.touched.password && formik.errors.password && <span>{formik.errors.password}</span>}<br />
          {dataState.passNotMatch && <span>Password not matched. Please try again</span>}
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
          <p>I don't have an account <Link onClick={() => handleUserEntryPage(1)} style={{ color: 'dodgerblue' }}>Sign Up</Link>.</p>
          <p><Link onClick={() => handleUserEntryPage(4)} style={{ color: 'dodgerblue' }}>Forgot Password!</Link>.</p>

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
                dataState.isButtonLoading ? 'Loading... please wait' : 'Log In'
              }</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
