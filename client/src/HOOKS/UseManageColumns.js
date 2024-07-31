import React, { useEffect, useState } from 'react';
import styles from '../styles/AdminHome/ManageColumns.module.css';
import axios from 'axios';

const UseManageColumns = ({ selectState, setSelectState, selectedMainCategory }) => {
  const [allColumnNames, setAllColumnNames] = useState([]);
  const [newColumn, setNewColumn] = useState({ insertAfter: '', newColumnName: '' });
  const [deleteColumn, setDeleteColumn] = useState('');
  const [renameColumn, setRenameColumn] = useState({ oldName: '', newName: '' });
  const [selectedSorting, setSelectedSorting] = useState([]);
  const [selectKeyFeature, setSelectKeyFeature] = useState([]);


  const renderColumns = async () => {
    try {
      const res = await axios.get(`http://localhost:7000/get/columns/${selectedMainCategory}`);
      setAllColumnNames(res.data.columns);
      setSelectedSorting(res.data.sorting);
      setSelectKeyFeature(res.data.keyFeature);

      setNewColumn({ insertAfter: '', newColumnName: '' });
      setDeleteColumn('');
      setRenameColumn({ oldName: '', newName: '' });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedMainCategory) {
      renderColumns();
    }
  }, [selectedMainCategory]);

  const handleAddColumn = async () => {
    try {
      await axios.post('http://localhost:7000/add/column', {
        table: selectedMainCategory,
        ...newColumn
      });
      setSelectState(0);
      renderColumns(); // Refetch columns after adding
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await axios.post('http://localhost:7000/delete/column', {
        table: selectedMainCategory,
        column: deleteColumn
      });
      setSelectState(0);
      renderColumns(); // Refetch columns after deleting
    } catch (error) {
      console.log(error);
    }
  };

  const handleRename = async () => {
    try {
      await axios.post('http://localhost:7000/rename/column', {
        table: selectedMainCategory,
        ...renameColumn
      });
      setSelectState(0);
      renderColumns(); // Refetch columns after renaming
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = async (e, column) => {
    try {
      if (e.target.checked) {
        await axios.post('http://localhost:7000/insert/new-sort', { category: selectedMainCategory, newSortColumn: column });
        setSelectedSorting([...selectedSorting, column]); // Update state
      } else {
        await axios.post('http://localhost:7000/remove/sort', { category: selectedMainCategory, column });
        setSelectedSorting(selectedSorting.filter(item => item !== column)); // Update state
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isChecked = (column) => selectedSorting.includes(column);


  const handleKeyFeatureCheck = async (e, column) => {
    try {
      if (e.target.checked) {
        await axios.post('http://localhost:7000/insert/new-keyFeature', { category: selectedMainCategory, column: column });
        setSelectKeyFeature([...selectKeyFeature, column]);
      } else {
        await axios.post('http://localhost:7000/remove/keyFeature', { category: selectedMainCategory, column });
        setSelectKeyFeature(selectKeyFeature.filter(item => item !== column));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isCheckedKeyFeature = (column) => selectKeyFeature.includes(column);

  return (
    <section className={styles.manageColumnsSection}>
      {selectState === 1 && (
        <div>
          <label>Insert After</label>
          <select
            value={newColumn.insertAfter}
            onChange={(e) => setNewColumn({ ...newColumn, insertAfter: e.target.value })}
          >
            <option value="">Select...</option>
            {allColumnNames.map((column, index) => (
              <option value={column} key={index}>
                {column}
              </option>
            ))}
          </select>
          <label>New Column Name</label>
          <input
            type="text"
            value={newColumn.newColumnName}
            onChange={(e) => setNewColumn({ ...newColumn, newColumnName: e.target.value.trim().toLowerCase() })}
          />
          <button onClick={handleAddColumn}>Add Column</button>
        </div>
      )}
      {selectState === 2 && (
        <div>
          <label>Which Column You Want to Delete</label>
          <select
            value={deleteColumn}
            onChange={(e) => setDeleteColumn(e.target.value)}
          >
            <option value="">Select...</option>
            {allColumnNames.map((column, index) => (
              <option value={column} key={index}>
                {column}
              </option>
            ))}
          </select>
          <button onClick={handleDeleteColumn}>Delete Column</button>
        </div>
      )}
      {selectState === 3 && (
        <div>
          <label>Rename Column Name</label>
          <select
            value={renameColumn.oldName}
            onChange={(e) => setRenameColumn({ ...renameColumn, oldName: e.target.value })}
          >
            <option value="">Select...</option>
            {allColumnNames.map((column, index) => (
              <option value={column} key={index}>
                {column}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New Name"
            value={renameColumn.newName}
            onChange={(e) => setRenameColumn({ ...renameColumn, newName: e.target.value.trim().toLowerCase() })}
          />
          <button onClick={handleRename}>Rename</button>
        </div>
      )}
      {selectState === 4 && (
        <div>
          {allColumnNames.map((column, index) => (
            <div key={index} id={styles.sortingCheckbox}>
              <label htmlFor={`checkbox-${index}`}>{column}</label>
              <input
                type='checkbox'
                value={column}
                id={`checkbox-${index}`}
                checked={isChecked(column)}
                onChange={(e) => handleCheckboxChange(e, column)}
              />
            </div>
          ))}
        </div>
      )}
      {selectState === 5 && (
        <div>
          {allColumnNames.map((column, index) => (
            <div key={index} id={styles.sortingCheckbox}>
              <label htmlFor={`checkbox-${index}`}>{column}</label>
              <input
                type='checkbox'
                value={column}
                id={`checkbox-${index}`}
                checked={isCheckedKeyFeature(column)}
                onChange={(e) => handleKeyFeatureCheck(e, column)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UseManageColumns;
