import React from 'react';
import styles from '../styles/ErrorAndLoading/ServerIssuePage.module';

const ServerIssuePage = () => {
    return (
        <div className={styles["server-issue-container"]}>
            <div className={styles["server-issue-content"]}>
                <h1>Server Issue Detected</h1>
                <p>Your game encountered a server issue. It looks like something might have changed locally.</p>
                <p>Please log in again to continue.</p>
                <button className={styles["login-button"]} onClick={() => window.location.reload()}>Log In Again</button>
            </div>
        </div>
    );
};

export default ServerIssuePage;
