import React, { useContext } from 'react'
import styles from '../../styles/HomePageStyles/UserHomeDescription..module.css';
import { useData } from '../../context/useData';

const UserHomeDescription = () => {
    const { dataState } = useContext(useData);

    return (
        <section className={styles.mainDescription}>
            {
                dataState.UserHomeContents.home_descriptions &&
                dataState.UserHomeContents.home_descriptions.length > 0 &&
                dataState.UserHomeContents.home_descriptions.map((item, i) => {
                    return <div key={`main-des-${i}`} className={styles.innerDescription}>
                        <span className={i !== 0 ? styles.head_des : styles.first_head}>
                            {item.des_head}
                        </span>
                        <span className={styles.head_value}>
                            {item.des_value}
                        </span>
                    </div>
                })
            }
        </section>
    )
}

export default UserHomeDescription