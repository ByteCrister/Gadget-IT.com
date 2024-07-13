import React, { useState } from 'react';
import { useFormik } from 'formik';
import styles from '../../styles/HomePageStyles/SignIn.module.css';
import { Link, useLocation } from 'react-router-dom';
import validationSchema from '../../components/UserHome/SignInValidations';
import { SignInPost } from '../../api/SignInPost';

const UserSignIn = ({ handleUserEntryPage }) => {

  const location = useLocation();  
  const currentRoute = location.pathname;
  // alert(currentRoute)

  const [dataState, setDataState] = useState({
    isButtonLoading:false,
    isEmailExist:false,
    isEmailSend:false,
    emailNotFound:false
  })
  const handlesignInStates = (state_1, state_2, state_3, state_4)=>{
    setDataState({
      isButtonLoading: state_1,
      isEmailExist: state_2,
      isEmailSend: state_3,
      emailNotFound: state_4

    })

  }

  const [passwordVisible, setPasswordVisible] = useState(false);


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      SignInPost(handlesignInStates,dataState, {...values, currentRoute});
    },
  });

  



  return (
    <div className={`${styles.blurForm}`}>
      <form className={`${styles['form-wrapper']}`} onSubmit={formik.handleSubmit}>
        <div className={styles.container}>
          <h1 className={styles.Header_name}>Sign Up</h1>
          <p className={styles.para_head}>Please fill in this form to create an account.</p>
          <hr />

          <label htmlFor="firstName"><b>First Name</b></label><br />
          {formik.touched.firstName && formik.errors.firstName && <span>{formik.errors.firstName}</span>}<br />
          <input
            type="text"
            placeholder="Enter First Name"
            name="firstName"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />

          <label htmlFor="lastName"><b>Last Name</b></label><br />
          {formik.touched.lastName && formik.errors.lastName && <span>{formik.errors.lastName}</span>}<br />
          <input
            type="text"
            placeholder="Enter Last Name"
            name="lastName"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />

          <label htmlFor="email"><b>Email</b></label><br />
          {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}<br />
          {dataState.isEmailExist && <span>Email already exists or there is an issue with this email. Please try another one.</span>}
          {dataState.emailNotFound && <span>Email Not Found. Please try with another email.</span>}
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
          {dataState.isEmailSend && <span>Email Confirmation sent. Please confirm it.</span>}
          <br />

          <p>I already have an account <Link onClick={() => handleUserEntryPage(2)} style={{ color: 'dodgerblue' }}>Log In</Link>.</p>

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
              dataState.isButtonLoading ? 'Loading...please wait' : 'Sign In'
            }</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserSignIn;
