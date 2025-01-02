import React, { useContext, useState } from 'react';
import { MdRemoveRedEye } from "react-icons/md";
import { IoEyeOffSharp } from "react-icons/io5";
import axios from 'axios';

import styles from '../../../styles/HomePageStyles/ChangePassword.module.css';
import { useData } from '../../../context/useData';

const ChangePassword = () => {
  const { dataState } = useContext(useData);
  const [returnState, setReturnState] = useState({ success: false, error: false });

  const [inputStates, setInputStates] = useState({
    old_password: { value: '', show: false },
    new_password: { value: '', show: false },
    confirm_new_password: { value: '', show: false }
  });

  const [errors, setErrors] = useState({});

  const handleChangePass = (e) => {
    setInputStates((prev) => ({
      ...prev,
      [e.target.name]: { ...prev[e.target.name], value: e.target.value }
    }));
  };

  const handleShowChange = (state) => {
    setInputStates((prev) => ({
      ...prev,
      [state]: { ...prev[state], show: !prev[state].show }
    }));
  };

  const handleReturnState = (state) => {
    setReturnState((prev) => ({
      ...prev,
      [state]: !prev[state]
    }));
    setTimeout(() => {
      setReturnState((prev) => ({
        ...prev,
        [state]: !prev[state]
      }));
    }, 2500);
  };

  const validateForm = () => {
    const newErrors = {};
    const { old_password, new_password, confirm_new_password } = inputStates;

    if (!old_password.value) {
      newErrors.old_password = "Old password is required";
    }

    if (!new_password.value) {
      newErrors.new_password = "New password is required";
    } else if (new_password.value.length < 6) {
      newErrors.new_password = "New password must be at least 6 characters long";
    } else if (!'zxcvbnmasdfghjklpoiuytrewq'.includes(new_password.value)) {
      newErrors.new_password = "New password must contain a lowercase letter.";
    } else if (!'ZXCVBNMLKJHGFDSAQWERTYUIOP'.includes(new_password.value)) {
      newErrors.new_password = "New password must contain a Uppercase letter.";
    } else if (!'~`!@#$%^&*()_-?><,.:;"'.includes(new_password.value)) {
      newErrors.new_password = "New password must contain a special character.";
    }

    if (!confirm_new_password.value) {
      newErrors.confirm_new_password = "Confirm new password is required";
    } else if (confirm_new_password.value !== new_password.value) {
      newErrors.confirm_new_password = "Passwords must match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log('Password change values:', inputStates);

      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/update-user-password`, inputStates, {
          headers: {
            Authorization: dataState.token
          }
        })
        handleReturnState('success');

      } catch (error) {
        console.log(error);
        handleReturnState('error');
      }

    } else {
      setErrors(formErrors);
      handleReturnState('error');
    }
  };

  return (
    <section className={styles.MainOuterPassChange}>
      <section className={styles.MainPassChangeForm}>
        <span> {returnState.success === true ? 'Password changed Successfully' : returnState.error === true ? '**There is something wrong, please check your password**' : 'Change Password'}</span>

        <section className={styles.InputSection}>

          <div>
            {errors.old_password && <p className={styles.error}>{errors.old_password}</p>}
            <label htmlFor='old_password'>Old Password<sup>*</sup></label>
            <div className={styles.InputDiv}>
              <input
                type={inputStates.old_password.show ? 'text' : 'password'}
                name='old_password'
                value={inputStates.old_password.value}
                onChange={handleChangePass}
              />
              <div className={styles.IconDiv} onClick={() => handleShowChange('old_password')}>
                {inputStates.old_password.show ? <MdRemoveRedEye className={styles.eyeIcon} /> : <IoEyeOffSharp className={styles.eyeIcon} />}
              </div>
            </div>
          </div>

          <div>
            {errors.new_password && <p className={styles.error}>{errors.new_password}</p>}
            <label htmlFor='new_password'>New Password<sup>*</sup></label>
            <div className={styles.InputDiv}>
              <input
                type={inputStates.new_password.show ? 'text' : 'password'}
                name='new_password'
                value={inputStates.new_password.value}
                onChange={handleChangePass}
              />
              <div className={styles.IconDiv} onClick={() => handleShowChange('new_password')}>
                {inputStates.new_password.show ? <MdRemoveRedEye className={styles.eyeIcon} /> : <IoEyeOffSharp className={styles.eyeIcon} />}
              </div>
            </div>
          </div>

          <div>
            {errors.confirm_new_password && <p className={styles.error}>{errors.confirm_new_password}</p>}
            <label htmlFor='confirm_new_password'>Confirm New Password<sup>*</sup></label>
            <div className={styles.InputDiv}>
              <input
                type={inputStates.confirm_new_password.show ? 'text' : 'password'}
                name='confirm_new_password'
                value={inputStates.confirm_new_password.value}
                onChange={handleChangePass}
              />
              <div className={styles.IconDiv} onClick={() => handleShowChange('confirm_new_password')}>
                {inputStates.confirm_new_password.show ? <MdRemoveRedEye className={styles.eyeIcon} /> : <IoEyeOffSharp className={styles.eyeIcon} />}
              </div>
            </div>
          </div>

        </section>

        <button onClick={handleSubmit}>Update Password</button>
      </section>
    </section>
  );
};

export default ChangePassword;
