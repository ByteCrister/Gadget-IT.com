import React from 'react';
import styles from '../styles/ErrorAndLoading/ServerIssuePage.module.css';
import { Link } from 'react-router-dom';

const ServerIssuePage = () => {
    return (
        <div className={styles["server-issue-container"]}>
            <div className={styles["server-issue-content"]}>
                <h1>Server Issue Detected</h1>
                <p> It looks like something might have changed locally.</p>
                <p>Please log in again to continue.</p>
                <Link to={'/'} ><button className={styles["login-button"]} onClick={() => window.location.reload()}>Log In Again</button></Link>
            </div>
        </div>
    );
};

export default ServerIssuePage;
