import React, { useContext, useEffect, useState } from 'react'
import { FaSearch, FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

import styles from "../../styles/AdminHome/UserRating.module.css";
import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import axios from 'axios';
import { SearchUserPreOrder } from '../../HOOKS/SearchUserPreOrder';
const UserPreOrder = () => {
    const { dataState, dispatch } = useContext(useData);
    const [PreOrders, setPreOrders] = useState({
        PreOrderStore: [],
        PreOrderMain: [],
        filteredPreOrders: [],
        sendPreOrder: []
    });
    const [sortButtonState, setSortButtonState] = useState({
        accedingState: 0,
        descendingState: 0
    });

    useEffect(() => {
        if (dataState?.Support_Page?.perOrders) {
            let preOrders = {};
            dataState?.Support_Page?.perOrders?.forEach((preOrder) => {
                preOrders = {
                    ...preOrders,
                    [preOrder.preorder_no]: {
                        product_id: '',
                        category: ''
                    }
                }
            });
            console.log(preOrders);

            setPreOrders({
                PreOrderStore: dataState?.Support_Page?.perOrders,
                PreOrderMain: dataState?.Support_Page?.perOrders,
                filteredPreOrders: dataState?.Support_Page?.perOrders,
                sendPreOrder: preOrders
            });
        }
    }, [dataState.Support_Page]);

    useEffect(() => {
        dispatch({
            type: 'set_search_function',
            payload: {
                function: SearchUserPreOrder,
                params: {
                    1: PreOrders.PreOrderStore,
                    2: setPreOrders
                }
            }
        });
    }, [dispatch]);

    const handleSearch = (e) => {
        SearchUserPreOrder(e.target.value, PreOrders.PreOrderStore, setPreOrders);
    };

    const handleFilteredData = (newPaginatedDate) => {
        setPreOrders((prev) => ({
            ...prev,
            filteredPreOrders: newPaginatedDate
        }));
    };

    const handleProductChange = (e, preorder_no, keyState) => {
        setPreOrders((prev) => ({
            ...prev,
            sendPreOrder: {
                ...prev.sendPreOrder,
                [preorder_no]: {
                    ...prev.sendPreOrder[preorder_no],
                    [keyState]: e.target.value
                }
            }
        }));
    };

    const isValid = (preorder_no) => {
        if (isNaN(PreOrders.sendPreOrder[preorder_no].product_id)) return false;
        if (!isNaN(PreOrders.sendPreOrder[preorder_no].category)) return false;
        if (PreOrders.sendPreOrder[preorder_no].category.length === 0) return false;
        return true;
    };


    const handleSendPreOrder = async (preorder_no, user_id) => {
        if (isValid(preorder_no)) {
            console.log(JSON.stringify(PreOrders.sendPreOrder[preorder_no], null, 2));
            try {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-isSend-preOrder/${preorder_no}`);
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post-user-new-perOrder-notification`, {
                    user_id: user_id,
                    preOrders: PreOrders.sendPreOrder[preorder_no]
                });
                let Updated = dataState?.Support_Page?.perOrders.map((preOrder) => {
                    return preOrder.preorder_no === preorder_no ? { ...preOrder, is_send: 1 }
                        : preOrder
                });
                dispatch({
                    type: 'set_support_page', payload: {
                        ...dataState.Support_Page,
                        perOrders: Updated
                    }
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            window.alert('*Enter Product ID & Category correctly*');
        }
    };

    const handleBtnUpdate = (keyState) => {
        const oppositeKey = keyState === 'accedingState' ? 'descendingState' : 'accedingState';
        let Updated = [...PreOrders.PreOrderStore];
        setSortButtonState(prev => ({
            ...prev,
            [keyState]: prev[keyState] !== 5 ? prev[keyState] + 1 : 0,
            [oppositeKey]: 0
        }));

        if (sortButtonState[keyState] + 1 === 1) {
            Updated = Updated.sort((a, b) => {
                return keyState === 'accedingState' ? a.product_name.localeCompare(b.product_name)
                    : b.product_name.localeCompare(a.product_name)
            });
        } else if (sortButtonState[keyState] + 1 === 2) {
            Updated = Updated.sort((a, b) => {
                return keyState === 'accedingState' ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            });
        } else if (sortButtonState[keyState] + 1 === 3) {
            Updated = Updated.sort((a, b) => {
                return keyState === 'accedingState' ? a.phone_no.localeCompare(b.phone_no)
                    : b.phone_no.localeCompare(a.phone_no)
            });
        } else if (sortButtonState[keyState] + 1 === 4) {
            Updated = Updated.sort((a, b) => {
                return keyState === 'accedingState' ? a.email.localeCompare(b.email)
                    : b.email.localeCompare(a.email)
            });
        } else if (sortButtonState[keyState] + 1 === 5) {
            Updated = Updated.sort((a, b) => {
                return keyState === 'accedingState' ? a.address.localeCompare(b.address)
                    : b.address.localeCompare(a.address)
            });
        }
        setPreOrders((prev) => ({
            ...prev,
            PreOrderMain: Updated
        }));
    };

    return (
        <section className={styles.UserRatingSupportContainer}>
            {Error.isError ? <span className={styles['Pre-order-page-span-head']}>*{Error.errorMessage}*</span> : null}
            <section className={styles.RatingSearchAndSort}>
                <div className={styles.searchFieldWrapper}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchField}
                        onChange={handleSearch}
                    />
                    <FaSearch className={styles.searchIcon} />
                </div>
                <div className={styles.RatingSortButtons}>
                    <button
                        className={
                            sortButtonState.accedingState === 0
                                ? styles.defaultBtn
                                : styles.activeBtn
                        }
                        onClick={() => handleBtnUpdate("accedingState")}
                    >
                        <FaSortAlphaDown />
                    </button>
                    <button
                        className={
                            sortButtonState.descendingState === 0
                                ? styles.defaultBtn
                                : styles.activeBtn
                        }
                        onClick={() => handleBtnUpdate("descendingState")}
                    >
                        <FaSortAlphaDownAlt />
                    </button>
                </div>
            </section>

            {/* ------------- Rating table ------------- */}
            <section className={styles.UserRatingTableSection}>
                <table>
                    <thead>
                        <tr>
                            <th >Image</th>
                            <th className={sortButtonState.accedingState === 1 || sortButtonState.descendingState === 1 ? styles.activeTableBtn : null}>Product Name</th>
                            <th className={sortButtonState.accedingState === 2 || sortButtonState.descendingState === 2 ? styles.activeTableBtn : null}>User Name</th>
                            <th className={sortButtonState.accedingState === 3 || sortButtonState.descendingState === 3 ? styles.activeTableBtn : null}>Phone</th>
                            <th className={sortButtonState.accedingState === 4 || sortButtonState.descendingState === 4 ? styles.activeTableBtn : null}>Email</th>
                            <th className={sortButtonState.accedingState === 5 || sortButtonState.descendingState === 5 ? styles.activeTableBtn : null}>Address</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PreOrders.filteredPreOrders &&
                            PreOrders.filteredPreOrders.length > 0 &&
                            PreOrders.filteredPreOrders.map((preOrder) => {
                                return (
                                    <tr key={uuidv4()} onClick={null}>
                                        <td>{<div className={styles['pre-order-page-div']}><img src={preOrder.image} alt='pre-img'></img></div>}</td>
                                        <td>{preOrder.product_name}</td>
                                        <td>{preOrder.name}</td>
                                        <td>{preOrder.phone_no}</td>
                                        <td>{preOrder.email}</td>
                                        <td>{preOrder.address}</td>
                                        <td>
                                            <div className={styles['send-pre-order-form']}>
                                                <span> {preOrder.is_send === 0 ? 'Send pre order' : 'Update pre order'}</span>
                                                <input type='text' placeholder='Product ID' value={PreOrders.sendPreOrder[preOrder.preorder_no].product_id} onChange={(e) => handleProductChange(e, preOrder.preorder_no, 'product_id')}></input>
                                                <select className={styles.selectField} value={PreOrders.sendPreOrder[preOrder.preorder_no].category} onChange={(e) => handleProductChange(e, preOrder.preorder_no, 'category')}>
                                                    <option value=""></option>
                                                    {
                                                        dataState.categoryName.map((items, index) => {
                                                            return <option key={index} value={items}>{GetCategoryName(items)}</option>
                                                        })
                                                    }
                                                </select>
                                                <button onClick={() => handleSendPreOrder(preOrder.preorder_no, preOrder.user_id)}>Send Pre Order</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </section>

            {/* ------------- Table pagination ------------- */}
            <Pagination productsData={PreOrders.PreOrderMain} handleFilteredData={handleFilteredData} />
        </section>
    )
}

export default UserPreOrder