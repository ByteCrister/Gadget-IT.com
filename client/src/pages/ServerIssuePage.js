import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/ErrorAndLoading/ServerIssuePage.module.css';
import { useData } from '../context/useData';

const ServerIssuePage = () => {
    const { dataState, dispatch } = useContext(useData);

    const handleClick = () => {
        window.localStorage.removeItem('token');
        dispatch({ type: 'toggle_isServerIssue', payload: false });
        window.location.href = '/';
    }
    return (
        <div className={styles["server-issue-container"]}>
            <div className={styles["server-issue-content"]}>
                <h1>Server Issue Detected</h1>
                <p> It looks like something might have changed locally.</p>
                <p>Please log in again to continue.</p>
                <Link to={'/'} ><button className={styles["login-button"]} onClick={handleClick}>Back to home.</button></Link>
            </div>
        </div>
    );
};

export default ServerIssuePage;
