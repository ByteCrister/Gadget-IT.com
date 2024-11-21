import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';

import styles from '../../styles/AdminHome/SalesManagement.module.css';
import { useData } from '../../context/useData';
import { Api_Dashboard } from '../../api/Api_Dashboard';

const SalesManagement = () => {
    const { dataState, dispatch } = useContext(useData);

    const [costState, setCostState] = useState({ cost: '', cost_purchase: '' });

    useEffect(() => {
        if (dataState.Dashboard_Page) {
            setCostState({
                cost: dataState.Dashboard_Page.dashboard.cost,
                cost_purchase: dataState.Dashboard_Page.dashboard.cost_purchase,
            });
            console.log(dataState.Dashboard_Page);
        }
    }, [dataState.Dashboard_Page]);

    const handleCostChange = (e) => {
        setCostState(prev => ({
            ...prev,
            [e.target.id]: [e.target.value]
        }));
    };

    const handleSalesChange = async () => {
        try {
            await axios.patch('http://localhost:7000/set-new-sales', { costState }); //*to -> admin.dashboard.router
            await Api_Dashboard(dispatch);
        } catch (error) {
            console.log(error);
            window.alert('error on handleSalesChange: ' + error.message);
        }
    };

    return (
        <section className={styles['sales-main-container']}>
            <section className={styles['sales-inner-profit-info']}>
                <span>Total Sales: {dataState.Dashboard_Page.dashboard.total_sales}</span>
                <span>Revenue: {dataState.Dashboard_Page.dashboard.revenue}</span>
                <span>Profit: {dataState.Dashboard_Page.dashboard.profit}</span>
            </section>

            <section className={styles['sales-inner-profit-input-div']}>
                <div>
                    <label>Management Cost: </label>
                    <input type='number' id='cost' min={0} value={costState.cost} onChange={handleCostChange}></input>
                </div>
                <div>
                    <label>Inventory Cost: </label>
                    <input type='number' id='cost_purchase' min={0} value={costState.cost_purchase} onChange={handleCostChange}></input>
                </div>
                <button onClick={handleSalesChange}>Save Changes</button>
            </section>
        </section>
    )
}

export default React.memo(SalesManagement);