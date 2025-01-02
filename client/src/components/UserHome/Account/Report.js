import React, { useContext, useEffect, useState } from 'react'
import { RxCross1 } from "react-icons/rx";

import styles from '../../../styles/HomePageStyles/UserReport.module.css';
import { useData } from '../../../context/useData';
import axios from 'axios';
const Report = () => {
    const { dataState, dispatch } = useContext(useData);

    const [Reports, setReports] = useState({ main_report: [], sub_report: [] });
    const [SelectedReport, setSelectedReport] = useState({
        reports: [],
        report_description: ''
    });
    const [isMainSelected, setMainSelected] = useState(false);
    const [currReport, setCurrReport] = useState({ main: { name: '', main_report_no: null }, sub: '' });
    const [isDataSend, setIsDataSend] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/user-interface-report`, {
                    headers: {
                        Authorization: dataState.token
                    }
                });
                console.log(res.data);
                setReports({
                    main_report: await res.data.main_report,
                    sub_report: await res.data.sub_report
                });
                setCurrReport({
                    main: { name: '', main_report_no: null }, sub: ''
                });
            } catch (error) {
                console.log(error);
                dispatch({ type: 'toggle_isServerIssue', payload: true });
            }
        };
        initialize();
    }, [dataState.token, dispatch]);

    if (!Reports.main_report || !Reports.sub_report) {
        return;
    }

    if (isDataSend) {
        return (
            <section className={styles['report-thanks']}>
                <span>Thank's for you'r precious support. We will see your report's.</span>
            </section>
        )
    }

    const handleMainChange = (e) => {
        setMainSelected(e.target.value && e.target.value.length !== 0 ? true : false);
    };

    const handleSubChange = (e) => {
        if (e.target.value && isMainSelected) {
            setSelectedReport((prev) => ({
                ...prev,
                reports: !prev.reports.some((report_) => report_.report_name === e.target.value)
                    ? [...prev.reports, Reports.sub_report.find((report) => report.report_name === e.target.value)]
                    : prev.reports
            }));
        }
    };

    const handleReportDes = (e) => {
        setSelectedReport((prev) => ({
            ...prev,
            report_description: e.target.value
        }));
    };

    const handleRemoveReport = (name) => {
        setSelectedReport((prev) => ({
            ...prev,
            reports: prev.reports.filter((report) => report.report_name !== name)
        }));
    };

    const handleSubmit = async () => {
        if (SelectedReport.reports.length !== 0 && SelectedReport.report_description.trim().length !== 0) {
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post-new-user-report`, SelectedReport, {
                    headers: {
                        Authorization: dataState.token
                    }
                });
                setIsDataSend(true);
                setTimeout(() => {
                    setIsDataSend(false);
                    setSelectedReport({
                        reports: [],
                        report_description: ''
                    })
                }, 5000);
            } catch (error) {
                console.log(error);
                dispatch({ type: 'toggle_isServerIssue', payload: true });
            }
        }
    };

    return (
        <section className={styles['user-report-main-container']}>
            <span className={styles['user-report-head-span']}>Report</span>
            <section className={styles['user-report-inner-container']}>
                <div className={styles['user-report-inner-main-select']}>
                    <div>
                        <span>Select Main: </span>
                        <select value={currReport.main.name} onChange={(e) => {
                            handleMainChange(e);
                            setCurrReport(prev => {
                                const selectedReport = Reports.main_report.find(report => report.report_name === e.target.value);
                                return {
                                    ...prev,
                                    main: {
                                        name: e.target.value,
                                        main_report_no: selectedReport ? selectedReport.main_report_no : 0
                                    }
                                };
                            });

                        }}>
                            <option value={null}></option>
                            {
                                Reports.main_report &&
                                Reports.main_report.length > 0 &&
                                Reports.main_report.map((report) => {
                                    return <option value={report.report_name}>{report.report_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <span>Select Sub: </span>
                        <select value={currReport.sub} onChange={(e) => { handleSubChange(e); setCurrReport(prev => ({ ...prev, sub: e.target.value })) }}>
                            <option value={null}></option>
                            {
                                Reports.sub_report && currReport.main.main_report_no &&
                                Reports.sub_report.length > 0 &&
                                Reports.sub_report.filter((report_) => {
                                    return report_.main_report_no === currReport.main.main_report_no
                                }).map((report) => {
                                    return <option value={report.report_name}>{report.report_name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className={styles['user-report-inner-selected-reports']}>
                    {
                        SelectedReport.reports &&
                        SelectedReport.reports.length > 0 &&
                        SelectedReport.reports.map((report) => {
                            return <div>
                                <span>{report.report_name}</span>
                                <RxCross1 className={styles['user-report-cross']} onClick={() => handleRemoveReport(report.report_name)} />
                            </div>
                        })
                    }
                </div>
                <div className={styles['user-report-inner-textArea']}>
                    <textarea placeholder='Explain the issue in detail...' value={SelectedReport.report_description} onChange={handleReportDes} cols={20} rows={5}></textarea>
                </div>
                <button onClick={handleSubmit} className={styles['user-report-submit-btn']}>Submit Report</button>
            </section>
        </section>
    )
};

export default React.memo(Report);