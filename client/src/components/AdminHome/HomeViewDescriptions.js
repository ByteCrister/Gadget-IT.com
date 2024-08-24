import React, { useContext, useEffect, useState } from 'react'
import { useData } from '../../context/useData'

import styles from '../../styles/AdminHome/HomeViewDes.module.css';
import axios from 'axios';
import { Api_Setting } from '../../api/Api_Setting';

const HomeViewDescriptions = () => {
  const { dataState, dispatch } = useContext(useData);
  const [newSerial, setNewSerial] = useState(0);
  const [desState, setDesState] = useState({
    mainDes: [],
    newDes: [],
    deleteDes: []
  });
  const [saveText, setSaveText] = useState('');

  useEffect(() => {
    const mainDescriptions = dataState?.Setting_Page?.home_description || [];

    setDesState((prev) => ({
      ...prev,
      mainDes: mainDescriptions
    }));
    const serialNos = mainDescriptions.map((item) => item.serial_no);
    if (serialNos.length > 0) {
      setNewSerial(Math.max(...serialNos));
    }
  }, [dataState]);

  //* ---------------- handleSaveText ------------------
  const handleSaveText = () => {
    setSaveText('Changes are Updated!')
    setTimeout(() => {
      setSaveText('');
    }, 2500);
  };

  //*-------------------------- handleSaveChanges ---------------------
  const handleSaveChanges = async () => {

    try {
      await axios.post('http://localhost:7000/home-view-description/crud',
        {
          mainDes: desState.mainDes,
          newDes: desState.newDes,
          deleteDes: desState.deleteDes
        }
      );

      setDesState((prev) => ({
        ...prev,
        newDes: [],
        deleteDes: []
      }));
      await Api_Setting(dispatch);
      handleSaveText();

    } catch (error) {
      console.log(error);
    }
  }


  //*------------------- description update handler --------------------------
  const handleDesUpdate = (e, index, keyState, keyMain) => {
    setDesState((prev) => ({
      ...prev,
      [keyState]: prev[keyState].map((item, i) => i === index ? { ...item, [keyMain]: e.target.value } : item)
    }));
  };

  //*------------------------------ add new description ----------------------------
  const addNewDesHandler = () => {
    setDesState((prev) => ({
      ...prev,
      newDes: [...prev.newDes, { des_head: '', des_value: '', serial_no: 0 }]
    }));
  };


  //* --------------------------- serial no handler ----------------------------------
  const serialHandler = (e, index, state, current_serial) => {

    const isChecked = e ? e.target.checked : false;

    setNewSerial((prev) => isChecked ? prev + 1 : prev - 1);
    const newSerialNo = isChecked ? newSerial + 1 : 0;


    const mainKey = state === 'mainDes' ? 'mainDes' : 'newDes';
    const oppositeKey = state === 'mainDes' ? 'newDes' : 'mainDes';

    setDesState((prev) => ({
      ...prev,
      [mainKey]: prev[mainKey].map((item, i) =>
        i === index
          ? { ...item, serial_no: newSerialNo }
          : {
            ...item,
            serial_no: item.serial_no !== 0 && !isChecked ? current_serial < item.serial_no ? item.serial_no - 1 : item.serial_no : item.serial_no
          }
      ),
      [oppositeKey]: prev[oppositeKey].map((item) =>
        item.serial_no !== 0
          ? { ...item, serial_no: item.serial_no !== 0 && !isChecked ? item.serial_no - 1 : item.serial_no }
          : item
      )
    }));


    console.log('Checkbox checked:', isChecked, 'New serial number:', newSerialNo);
  }


  //*-------------------------- delete description handler ------------------------------
  const deleteDesHandler = (index, keyState, des_no, serial_no) => {

    serial_no !== 0 && serialHandler('', -1, keyState, serial_no);

    setDesState((prev) => ({
      ...prev,
      [keyState]: prev[keyState].filter((_, i) => i !== index),
      deleteDes: keyState === 'mainDes' ? [...prev.deleteDes, des_no] : prev.deleteDes
    }));

  };

  return (
    <section className={styles.mainDesContainer}>
      {
        desState.mainDes && desState.mainDes.length > 0 &&
        <div>
          {
            desState.mainDes.map((item, i) => {
              return <div key={`main-des-${i}`}>
                <input type='text' value={item.des_head} id={`main-description-head-${i}`} onChange={(e) => handleDesUpdate(e, i, 'mainDes', 'des_head')} placeholder='head'></input>
                <input type='text' value={item.des_value} id={`main-description-value-${i}`} onChange={(e) => handleDesUpdate(e, i, 'mainDes', 'des_value')} placeholder='value'></input>
                <div id={`main-des-checkbox-${i}`}>
                  <input type='checkbox' id={`main-des-check-${i}`} checked={item.serial_no !== 0} onChange={(e) => serialHandler(e, i, 'mainDes', item.serial_no)}></input>
                  <span>{item.serial_no}</span>
                </div>
                <button className={styles.des_button} id={`main-des-delete-${i}`} onClick={() => deleteDesHandler(i, 'mainDes', item.des_no, item.serial_no)}>Delete</button>
              </div>
            })
          }
        </div>
      }

      {
        desState.newDes && desState.newDes.length > 0 &&
        <div>
          {
            desState.newDes.map((item, i) => {
              return <div key={`new-des-${i}`}>
                <input type='text' value={item.des_head} id={`new-description-head-${i}`} onChange={(e) => handleDesUpdate(e, i, 'newDes', 'des_head')} placeholder='head'></input>
                <input type='text' value={item.des_value} id={`new-description-value-${i}`} onChange={(e) => handleDesUpdate(e, i, 'newDes', 'des_value')} placeholder='value'></input>
                <div id={`new-des-checkbox-${i}`}>
                  <input type='checkbox' id={`new-des-check-${i}`} checked={item.serial_no !== 0} onChange={(e) => serialHandler(e, i, 'newDes', item.serial_no)}></input>
                  <span>{item.serial_no}</span>
                </div>
                <button className={styles.des_button} id={`new-des-delete-${i}`} onClick={() => deleteDesHandler(i, 'newDes', '', item.serial_no)}>Delete</button>
              </div>
            })
          }
        </div>
      }

      <button className={styles.des_button} onClick={addNewDesHandler}>New Description</button>
      <button className={styles.des_button} onClick={() => handleSaveChanges()}>Save Changes</button>
      {
        saveText.length !== 0 &&
        <span className={styles.saveText}>{saveText}</span>
      }
    </section>
  )
}

export default HomeViewDescriptions