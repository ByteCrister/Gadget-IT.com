import React, { useContext, useEffect } from 'react'
import styles from '../../styles/AdminHome/admin.home.module.css';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useData } from '../../context/useData';

const AdminSearchBar = () => {
    const { dataState } = useContext(useData);
    const handleSearch = (e) => {
        if (dataState?.Search_Function) {
            dataState.Search_Function.function(e.target.value,
                ...Object.values(dataState.Search_Function.params)
            );
        }
    };

    useEffect(()=>{
        console.log("New search params added...");
    }, [dataState?.Search_Function]);

    return (
        <div className={styles.search_bar}>
            <span className={styles.search_logo}><BiSearchAlt2 /></span>
            <input type='text' onChange={handleSearch} name='search' id={styles.search} placeholder='Search...'></input>
        </div>
    )
}

export default AdminSearchBar