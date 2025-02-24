import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa';
import { RiDeleteBack2Fill } from "react-icons/ri";
import debounce from 'lodash.debounce';

import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { SearchUserReport } from '../../HOOKS/SearchUserReport';
import styles from '../../styles/AdminHome/UserReportPage.module.css';

const UserReportPage = () => {
    const { dataState, dispatch } = useContext(useData);

    const [ReportData, setReportData] = useState({
        Store: [],
        MainData: [],
        filteredData: []
    });

    useEffect(() => {
        if (dataState?.Report_Page?.report_data) {
            setReportData((prev) => ({
                ...prev,
                Store: dataState.Report_Page.report_data.map((item) => ({ ...item, isClicked: false })),
                MainData: dataState.Report_Page.report_data.map((item) => ({ ...item, isClicked: false }))
            }));
        }
    }, [dataState.Report_Page]);

    useEffect(() => {
        dispatch({
          type: 'set_search_function',
          payload: {
            function: SearchUserReport,
            params: {
              p_1: ReportData.Store,
              p_2: setReportData
            }
          }
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [ReportData.Store]);
    

    const [sortButtonState, setSortButtonState] = useState({
        accedingState: 0,
        descendingState: 0
    });

    const handleFilteredData = (paginatedData) => {
        setReportData((prev) => ({
            ...prev,
            filteredData: paginatedData
        }));
    };
 
    const debouncedSearch = useMemo(() => debounce((value) => {
        SearchUserReport(value, ReportData.Store, setReportData);
    }, 300), [ReportData.Store]);
    
    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const getThStyles = (btnState) => {
        return (sortButtonState.accedingState === btnState || sortButtonState.descendingState === btnState) ? styles.activeBtnTh : styles.defaultBtnTh;
    };

    const handleSorting = (keyState) => {
        let Updated = [...ReportData.MainData];
        if (sortButtonState[keyState] + 1 === 1) {
            Updated = Updated.sort((a, b) => keyState === 'accedingState' ? a.user_id - b.user_id : b.user_id - a.user_id);
        } else if (sortButtonState[keyState] + 1 === 2) {
            Updated = Updated.sort((a, b) => keyState === 'accedingState' ? a.user_name.localeCompare(b.user_name) : b.user_name.localeCompare(a.user_name));
        } else if (sortButtonState[keyState] + 1 === 3) {
            Updated = Updated.sort((a, b) => keyState === 'accedingState' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email));
        } else if (sortButtonState[keyState] + 1 === 4) {
            Updated = Updated.sort((a, b) => keyState === 'accedingState' ? new Date(a.report_date) - new Date(b.report_date) : new Date(b.report_date) - new Date(a.report_date));
        }
        setReportData((prev) => ({
            ...prev,
            MainData: Updated
        }));
    };

    const handleBtnUpdate = (keyState) => {
        const oppositeKey = keyState === 'accedingState' ? 'descendingState' : 'accedingState';
        setSortButtonState({
            [keyState]: sortButtonState[keyState] !== 4 ? sortButtonState[keyState] + 1 : 0,
            [oppositeKey]: 0
        });
        handleSorting(keyState);
    };

    const toggleReportDetails = (user_report_no) => {
        setReportData((prev) => ({
            ...prev,
            MainData: prev.MainData.map((item) =>
                item.user_report_no === user_report_no ? { ...item, isClicked: !item.isClicked } : item
            )
        }));
    };


    const handleDelete = async (user_report_no) => {
        if (window.confirm('Do you want to delete this user report??')) {
            setReportData((prev) => ({
                ...prev,
                MainData: prev.MainData.filter((item) =>
                    item.user_report_no !== user_report_no
                )
            }));

            try {
                const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-user-report/${user_report_no}`);
                dispatch({ type: 'update_user_report', payload: await res.data });
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <section className={styles.UserRatingSupportContainer}>
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

            {/* ------------- Report table ------------- */}
            <section className={styles.UserRatingTableSection}>
                <table>
                    <thead>
                        <tr>
                            <th className={getThStyles(1)}>User ID</th>
                            <th className={getThStyles(2)}>Name</th>
                            <th className={getThStyles(3)}>Email</th>
                            <th className={getThStyles(4)}>Report Date</th>
                            <th className={styles.defaultBtnTh}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ReportData.filteredData &&
                            ReportData.filteredData.length > 0 &&
                            ReportData.filteredData.map((report) => (
                                <tr key={report.user_report_no} onClick={() => toggleReportDetails(report.user_report_no)}>
                                    <td>{report.user_id}</td>
                                    <td>
                                        <div className={styles.innerDiv}>
                                            <div>{report.user_name}</div>
                                            {report.isClicked && (
                                                <div className={styles.innerDivReport}>
                                                    {report.report_string}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.innerDiv}>
                                            <span>{report.email}</span>
                                            {report.isClicked && (
                                                <div className={styles.innerDivReport}>
                                                    {report.report_description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{new Date(report.report_date).toLocaleString()}</td>
                                    <td><RiDeleteBack2Fill onClick={() => handleDelete(report.user_report_no)} className={styles.ReportDeleteIcon} /></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>

            {/* ------------- Table pagination ------------- */}
            <Pagination productsData={ReportData.MainData} handleFilteredData={handleFilteredData} />
        </section>
    )
}

export default React.memo(UserReportPage);
