import React from 'react';
import styles from './styles/skeleton.module.css';

const SkeletonLoader = () => {
    return (
        <div className={styles.skeletonContainer}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonAvatar}`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonButton}`}></div>
        </div>
    );
};

export default SkeletonLoader;
