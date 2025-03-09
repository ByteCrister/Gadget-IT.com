import React, { useContext } from 'react';
import { useData } from '../../context/useData';
import styles from '../../styles/HomePageStyles/ExtraAdd.module.css';
import SkeletonLoader from '../ui/SkeletonLoader';

const ExtraSubAdd = () => {
    const { dataState } = useContext(useData);

    const advertisements = dataState.UserHomeContents?.advertisements || [];

    if(!dataState.UserHomeContents?.advertisements || !dataState.UserHomeContents) return <SkeletonLoader />

    const filteredAds = advertisements
        .filter(item => item.position === 'sub')
        .slice(2); 

    return (
        <div className={styles.extraSubAdd}>
            {filteredAds.length > 0 ? (
                filteredAds.map((item, i) => (
                    <div key={i}>
                        <img src={item.img} alt={`Advertisement-${i}`} />
                    </div>
                ))
            ) : (
                <p>No advertisements available</p> 
            )}
        </div>
    );
}

export default ExtraSubAdd;
