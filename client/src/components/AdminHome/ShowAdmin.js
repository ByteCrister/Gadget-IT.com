import React, { useState } from 'react';
import { RiAdminFill, RiEyeFill, RiEyeCloseFill } from "react-icons/ri"; // Import eye icons for visibility toggle
import { FaSpinner, FaTimes } from 'react-icons/fa'; // Import close icon

import styles from '../../styles/AdminHome/MoreInformation.module.css';
import { SetAdmin } from '../../api/SetAdmin';

const ShowAdmin = ({handleUpper}) => {
  const [showPass, setShowPass] = useState(false);
  const [isNameShort, setIsNameShort] = useState(false);
  const [isPasswordShort, setIsPasswordShort] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = nameValue.trim();
    const trimmedPassword = passwordValue.trim();

    const values = {
      email : trimmedName,
      password : trimmedPassword
    }
    SetAdmin(values, handleUpper);
    

    if (trimmedName.length < 5) {
      setIsNameShort(true);
    } else {
      setIsNameShort(false);
    }

    if (trimmedPassword.length < 6) {
      setIsPasswordShort(true);
    } else {
      setIsPasswordShort(false);
    }

    if (trimmedName.length >= 5 && trimmedPassword.length >= 6) {
      setLoading(true);
     
      setTimeout(() => {
        setLoading(false);
       
      }, 2000); 
    }
  };



  return (
    <div id={styles.blurBackground}>
      <div id={styles.mainAdminForm}>
        <div id={styles.AdminCloseButton} onClick={()=>{ handleUpper(0) }}>
          <FaTimes />
        </div>
        <div id={styles.AdminFormLogoDiv}><RiAdminFill id={styles.adminFormLogo} /></div>
        <form onSubmit={handleSubmit} id={styles.adminForm}>

          <input
            type='text'
            id={styles.adminName}
            name='admin'
            placeholder='Enter new name'
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />

          <div id={styles.AdminPasswordContainer}>
            <input
              type={showPass ? 'text' : 'password'}
              id={styles.password}
              name='password'
              placeholder='Enter new password'
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <button type="button" id={styles.AdminTogglePasswordButton} onClick={() => { setShowPass(!showPass) }}>
              {showPass ? <RiEyeCloseFill /> : <RiEyeFill />}
            </button>
          </div>

          <button type='submit' id={styles.adminFormButton} disabled={loading}>
            {loading ? <FaSpinner id={styles.AdminFormSpinner} /> : 'Submit'}
          </button>

          <div id={styles.AdminErrorMessageBox}>
            {isNameShort && <p>Name is too short! (Must be at least 5 characters)</p>}
            {isPasswordShort && <p>Password is too short! (Must be at least 6 characters)</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShowAdmin;
