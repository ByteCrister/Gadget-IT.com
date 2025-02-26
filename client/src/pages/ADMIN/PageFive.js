import React, { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/AdminHome/PageFive.module.css';
import { useData } from '../../context/useData';
import axios from 'axios';
import UserReportPage from '../../components/AdminHome/UserReportPage';

const PageFive = () => {
  const { dataState, dispatch } = useContext(useData);
  const [supportBtnState, setSupportBtnState] = useState(1);
  const [ManageReportState, setManageReportState] = useState({
    buttonState: 1,
    table: '',
    Create: '',
    Update: {
      updated_report_name: '',
      curr_report_name: '',
      report_no: '',
      report_no_name: ''
    }
  });

  // useEffect(() => {
  //   if (dataState?.Report_Page?.report_main && dataState?.Report_Page?.report_sub) return;
  // }, [dataState.Report_Page]);


  // * ---------------- 'Report Management' Component is created under its parent component -----------------------
  const renderReportManagement = () => {
    return (
      <section className={styles['manage-report-outer-section']}>
        <div className={styles['manage-report-outer-section-buttons']}>
          <button onClick={() => setManageReportState(prev => ({ ...prev, buttonState: 1 }))}>Create</button>
          <button onClick={() => setManageReportState(prev => ({ ...prev, buttonState: 2 }))}>Update</button>
          <button onClick={() => setManageReportState(prev => ({ ...prev, buttonState: 3 }))}>Delete</button>
        </div>
        <span className={styles['manage-report-outer-section-span']}>{ManageReportState.buttonState === 1 ? 'Create Report' : ManageReportState.buttonState === 2 ? 'Update Report' : 'Delete Report'}</span>
        {ManageReportState.buttonState === 1 ? createReport() : ManageReportState.buttonState === 2 ? updateReport() : deleteReport()}
      </section>
    );
  };

  const handleSelectReportChange = (e) => {
    setManageReportState(prev => ({
      ...prev,
      table: e.target.value,
      Update: { ...prev.Update, report_no_name: e.target.value === 'report_main' ? 'main_report_no' : 'sub_report_no' }
    }));
  };

  const handleUpdateSelectChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedId = selectedOption.dataset.id;
    setManageReportState(prev => ({
      ...prev,
      Update: {
        ...prev.Update,
        curr_report_name: e.target.value,
        report_no: selectedId
      }
    }));
  };

  const renderSelectReport = () => {
    return (
      <div className={styles['manage-report-inner-section-select-option']}>
        <select onChange={handleSelectReportChange}>
          <option value={''}></option>
          <option value={'report_main'}>Main</option>
          <option value={'report_sub'}>Sub</option>
        </select>
      </div>
    );
  };

  const createReport = () => {
    return (
      <section className={styles['manage-report-inner-section']}>
        {renderSelectReport()}
        {
          ManageReportState.table &&
          ManageReportState.table.length !== 0 &&
          (<section className={styles['create-new-report-section']}>
            <input type='text' value={ManageReportState.Create} onChange={(e) => setManageReportState((prev) => ({ ...prev, Create: e.target.value }))}></input>
            <button onClick={handleCreateReport}>Create New Report</button>
          </section>)
        }
      </section>
    );
  };

  const updateReport = () => {
    return (
      <section className={styles['manage-report-inner-section']}>
        {renderSelectReport()}
        {
          ManageReportState.table &&
          ManageReportState.table.length !== 0 &&
          (<section className={styles['create-new-report-section']}>
            <div>
              <select value={ManageReportState.Update.curr_report_name} onChange={handleUpdateSelectChange}>
                <option id='' key={uuidv4()} value={''}></option>
                {
                  dataState?.Report_Page[ManageReportState.table].map((option) => {
                    return <option key={uuidv4()} value={option.report_name} data-id={option[ManageReportState.Update.report_no_name]}>{option.report_name}</option>
                  })
                }
              </select>
            </div>
            {
              ManageReportState.Update.curr_report_name.length !== 0 &&
              (<>
                <span>New name: </span>
                <input type='text' value={ManageReportState.Update.updated_report_name} onChange={(e) => setManageReportState((prev) => ({ ...prev, Update: { ...prev.Update, updated_report_name: e.target.value } }))}></input>
                <button onClick={handleUpdateReport}>Update Report</button>
              </>)
            }
          </section>)
        }
      </section>
    );
  };

  const deleteReport = () => {
    return (
      <section className={styles['manage-report-inner-section']}>
        {renderSelectReport()}
        {
          ManageReportState.table &&
          ManageReportState.table.length !== 0 &&
          (<section className={styles['create-new-report-section']}>
            <div>
              <select value={ManageReportState.Update.curr_report_name} onChange={handleUpdateSelectChange}>
                <option key={uuidv4()} value={''}></option>
                {
                  dataState?.Report_Page[ManageReportState.table].map((option) => {
                    return <option key={uuidv4()} value={option.report_name} data-id={option[ManageReportState.Update.report_no_name]}>{option.report_name}</option>
                  })
                }
              </select>
            </div>
            <button onClick={() => window.confirm('Do want to delete this Report?') && handleDeleteReport()}>Delete Report</button>
          </section>)
        }
      </section>
    );
  };

  const handleCreateReport = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-new-report`, {
        report_name: ManageReportState.Create,
        table: ManageReportState.table
      });
      dispatch({ type: 'set_report_page', payload: await res.data });
    } catch (error) {
      console.error("Error in handleCreateReport:", error.message);
      console.error("Full error:", error);
    }
  };

  const handleUpdateReport = async () => {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/update-report`,
        { body: { ...ManageReportState.Update, table: ManageReportState.table } }
      );
      dispatch({ type: 'set_report_page', payload: await res.data });
    } catch (error) {
      console.error("Error in handleUpdateReport:", error.message);
      console.error("Full error:", error);
    }
  };

  const handleDeleteReport = async () => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-report`,
        { data: { ...ManageReportState.Update, table: ManageReportState.table } }
      );
      dispatch({ type: 'set_report_page', payload: await res.data });
    } catch (error) {
      console.error("Error in handleUpdateReport:", error.message);
      console.error("Full error:", error);
    }
  };

  return (
    <section className={styles['page-five-main-container']}>
      <section className={styles['page-five-button-states']}>
        <div className={supportBtnState === 1 ? styles['active-support-button'] : styles['support-buttons']} onClick={() => setSupportBtnState(1)}>
          User Report's
        </div>
        <div className={supportBtnState === 2 ? styles['active-support-button'] : styles['support-buttons']} onClick={() => setSupportBtnState(2)}>
          Report Management
        </div>
      </section>
      {supportBtnState === 1 ? <UserReportPage /> : renderReportManagement()}
    </section>
  )
}

export default React.memo(PageFive);