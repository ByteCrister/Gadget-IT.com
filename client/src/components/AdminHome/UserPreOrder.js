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
        if (dataState?.Support_Page?.perOrders && PreOrders.PreOrderStore.length === 0) {
            let preOrders = {};
            dataState?.Support_Page?.perOrders?.forEach((preOrder) => {
                preOrders[preOrder.preorder_no] = {
                    product_id: '',
                    category: ''
                };
            });

            setPreOrders((prev) => ({
                ...prev,
                PreOrderStore: dataState?.Support_Page?.perOrders,
                PreOrderMain: dataState?.Support_Page?.perOrders,
                filteredPreOrders: dataState?.Support_Page?.perOrders,
                sendPreOrder: preOrders
            }));

            // console.log("Updated sendPreOrder:", preOrders);

        }
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
        // console.log("User pre order page renders...");

    }, [PreOrders.PreOrderStore, dataState?.Support_Page?.perOrders, dispatch]);

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
        const { value } = e.target;

        setPreOrders(prev => {
            if (prev.sendPreOrder[preorder_no]?.[keyState] === value) {
                return prev; // Prevents unnecessary state updates
            }

            return {
                ...prev,
                sendPreOrder: {
                    ...prev.sendPreOrder,
                    [preorder_no]: {
                        ...(prev.sendPreOrder[preorder_no] || { product_id: '', category: '' }),
                        [keyState]: value
                    }
                }
            };
        });
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
                        name='user-pre-order-search-bar'
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
                            {
                                ["Product Name", "User Name", "Phone", "Email", "Address"].map((item, index) => {
                                    return <th key={`table-head-${index}`} className={sortButtonState.accedingState === index + 1 || sortButtonState.descendingState === index + 1 ? styles.activeTableBtn : null}>{item}</th>

                                })
                            }
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
                                                <input
                                                    type='text'
                                                    name='user-pre-order-form-input'
                                                    placeholder='Product ID'
                                                    value={PreOrders.sendPreOrder[preOrder.preorder_no]?.product_id || ''}
                                                    onChange={(e) => handleProductChange(e, preOrder.preorder_no, 'product_id')}
                                                />

                                                <select
                                                    className={styles.selectField}
                                                    name='pre-order-form-select'
                                                    value={PreOrders.sendPreOrder[preOrder.preorder_no]?.category || ''}
                                                    onChange={(e) => handleProductChange(e, preOrder.preorder_no, 'category')}
                                                >
                                                    <option key="pre-order-key-form-0" id="pre-order-form-0" value=""></option>
                                                    {dataState?.categoryName?.length > 0 &&
                                                        dataState?.categoryName.map((items, index) => (
                                                            <option key={`pre-order-form-key-${index + 1}`} id={`pre-order-form-${index + 1}`} value={items}>
                                                                {GetCategoryName(items)}
                                                            </option>
                                                        ))}
                                                </select>
                                                <button
                                                    onClick={() => handleSendPreOrder(preOrder.preorder_no, preOrder.user_id)}
                                                >Send Pre Order
                                                </button>
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

export default React.memo(UserPreOrder);