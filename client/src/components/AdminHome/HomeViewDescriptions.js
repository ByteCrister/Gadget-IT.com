import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useData } from '../../context/useData';
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
    setDesState(prev => ({
      ...prev,
      mainDes: mainDescriptions
    }));
    const serialNos = mainDescriptions.map(item => item.serial_no);
    if (serialNos.length > 0) {
      setNewSerial(Math.max(...serialNos));
    }
  }, [dataState]);

  const handleSaveText = useCallback(() => {
    setSaveText('Changes are Updated!');
    setTimeout(() => setSaveText(''), 2500);
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/home-view-description/crud`, {
        mainDes: desState.mainDes,
        newDes: desState.newDes,
        deleteDes: desState.deleteDes
      });

      setDesState(prev => ({
        ...prev,
        newDes: [],
        deleteDes: []
      }));
      await Api_Setting(dispatch);
      handleSaveText();
    } catch (error) {
      console.error(error);
    }
  }, [desState, handleSaveText, dispatch]);

  const handleDesUpdate = useCallback((e, index, keyState, keyMain) => {
    setDesState(prev => ({
      ...prev,
      [keyState]: prev[keyState].map((item, i) => i === index ? { ...item, [keyMain]: e.target.value } : item)
    }));
  }, []);

  const addNewDesHandler = useCallback(() => {
    setDesState(prev => ({
      ...prev,
      newDes: [...prev.newDes, { des_head: '', des_value: '', serial_no: newSerial + 1 }]
    }));
    setNewSerial(prev => prev + 1);
  }, [newSerial]);

  const serialHandler = useCallback((e, index, state, current_serial) => {
    const isChecked = e.target.checked;
    const newSerialNo = isChecked ? newSerial + 1 : 0;

    setNewSerial(prev => isChecked ? prev + 1 : prev - 1);

    const mainKey = state === 'mainDes' ? 'mainDes' : 'newDes';
    const oppositeKey = state === 'mainDes' ? 'newDes' : 'mainDes';

    setDesState(prev => ({
      ...prev,
      [mainKey]: prev[mainKey].map((item, i) =>
        i === index
          ? { ...item, serial_no: newSerialNo }
          : {
              ...item,
              serial_no: item.serial_no !== 0 && !isChecked
                ? current_serial < item.serial_no
                  ? item.serial_no - 1
                  : item.serial_no
                : item.serial_no
            }
      ),
      [oppositeKey]: prev[oppositeKey].map(item =>
        item.serial_no !== 0
          ? { ...item, serial_no: item.serial_no !== 0 && !isChecked
              ? current_serial < item.serial_no
                ? item.serial_no - 1
                : item.serial_no
              : item.serial_no }
          : item
      )
    }));
  }, [newSerial]);

  const deleteDesHandler = useCallback((index, keyState, des_no, serial_no) => {
    if (serial_no !== 0) {
      serialHandler({ target: { checked: false } }, -1, keyState, serial_no);
    }

    setDesState(prev => ({
      ...prev,
      [keyState]: prev[keyState].filter((_, i) => i !== index),
      deleteDes: keyState === 'mainDes' ? [...prev.deleteDes, des_no] : prev.deleteDes
    }));
  }, [serialHandler]);

  return (
    <section className={styles.mainDesContainer}>
      {desState.mainDes.length > 0 && (
        <div>
          {desState.mainDes.map((item, i) => (
            <div key={`main-des-${i}`}>
              <input
                type='text'
                value={item.des_head}
                id={`main-description-head-${i}`}
                onChange={e => handleDesUpdate(e, i, 'mainDes', 'des_head')}
                placeholder='head'
              />
              <input
                type='text'
                value={item.des_value}
                id={`main-description-value-${i}`}
                onChange={e => handleDesUpdate(e, i, 'mainDes', 'des_value')}
                placeholder='value'
              />
              <div id={`main-des-checkbox-${i}`}>
                <input
                  type='checkbox'
                  id={`main-des-check-${i}`}
                  checked={item.serial_no !== 0}
                  onChange={e => serialHandler(e, i, 'mainDes', item.serial_no)}
                />
                <span>{item.serial_no}</span>
              </div>
              <button
                className={styles.des_button}
                id={`main-des-delete-${i}`}
                onClick={() => deleteDesHandler(i, 'mainDes', item.des_no, item.serial_no)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {desState.newDes.length > 0 && (
        <div>
          {desState.newDes.map((item, i) => (
            <div key={`new-des-${i}`}>
              <input
                type='text'
                value={item.des_head}
                id={`new-description-head-${i}`}
                onChange={e => handleDesUpdate(e, i, 'newDes', 'des_head')}
                placeholder='head'
              />
              <input
                type='text'
                value={item.des_value}
                id={`new-description-value-${i}`}
                onChange={e => handleDesUpdate(e, i, 'newDes', 'des_value')}
                placeholder='value'
              />
              <div id={`new-des-checkbox-${i}`}>
                <input
                  type='checkbox'
                  id={`new-des-check-${i}`}
                  checked={item.serial_no !== 0}
                  onChange={e => serialHandler(e, i, 'newDes', item.serial_no)}
                />
                <span>{item.serial_no}</span>
              </div>
              <button
                className={styles.des_button}
                id={`new-des-delete-${i}`}
                onClick={() => deleteDesHandler(i, 'newDes', '', item.serial_no)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button className={styles.des_button} onClick={addNewDesHandler}>New Description</button>
      <button className={styles.des_button} onClick={handleSaveChanges}>Save Changes</button>
      {saveText && <span className={styles.saveText}>{saveText}</span>}
    </section>
  );
};

export default React.memo(HomeViewDescriptions);
