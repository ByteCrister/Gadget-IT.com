import React, { useEffect, useState } from 'react';
import styles from '../styles/AdminHome/ManageColumns.module.css';
import axios from 'axios';

const UseManageColumns = ({ selectState, setSelectState, selectedMainCategory }) => {
  const [allColumnNames, setAllColumnNames] = useState([]);
  const [newColumn, setNewColumn] = useState({ insertAfter: '', newColumnName: '' });
  const [deleteColumn, setDeleteColumn] = useState('');
  const [renameColumn, setRenameColumn] = useState({ oldName: '', newName: '' });
  // const [selectedSorting, setSelectedSorting] = useState([]);
  const [selectKeyFeature, setSelectKeyFeature] = useState([]);
  const [change_sort_by_names, setChange_sort_by_names] = useState({
    newSort: [],
    deleteSort: []
  });


  const renderColumns = async () => {
    try {
      const res = await axios.get(`http://localhost:7000/get/columns/${selectedMainCategory}`);
      setAllColumnNames(res.data.columns);
      // setSelectedSorting(res.data.sorting);

      setChange_sort_by_names((prev) => ({
        ...prev,
        newSort: res.data.sorting
      }));

      // console.log(JSON.stringify(res.data.sorting, null, 2));
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


  //*--------------------------- get sort no -----------------------
  const getSortNo = (column) => {
    const filteredItem = change_sort_by_names.newSort.filter((item) => item.sorting_column === column);
    return filteredItem.length > 0 ? filteredItem[0].sorting_no : 0
  }

  //*-------------------------- add new sort --------------------- */
  const handleAddNewSort = (e, column) => {

    const isChecked = e.target.checked;

    setChange_sort_by_names((prev) => ({
      ...prev,
      newSort: isChecked ?
        [...prev.newSort, { sorting_no: 0, category: selectedMainCategory, sorting_column: column, sort_by_names: '' }]
        : prev.newSort.filter((item) => item.sorting_column !== column),
      deleteSort: !isChecked ? [...prev.deleteSort, getSortNo(column)] : prev.deleteSort
    }));

  }
  //**--------------------- handleCheckboxChange ----------------------- */
  const handleSortByChange = (e, column) => {

    setChange_sort_by_names((prev) => ({
      ...prev,
      newSort: prev.newSort.map((item) => item.sorting_column === column ? { ...item, sort_by_names: e.target.value } : item
      )
    }));

  };

  //* ------------------------- handle save sorting ---------------------
  const handleSaveSorting = async () => {
    try {
      await axios.post('http://localhost:7000/insert/new-sort/crud', { category: selectedMainCategory, change_sort_by_names: change_sort_by_names });
      renderColumns()

    } catch (error) {
      console.log(error);
    }
  }

  //*------------------------- handle is checked -----------------------
  const isChecked = (column) => {
    return change_sort_by_names.newSort.some((item) => item.sorting_column === column);
  };

  //*---------------------------- handle Get sort values ----------------------------
  const getSortByValue = (column) => {
    const filteredItem = change_sort_by_names.newSort.filter((item) => item.sorting_column === column);
    return filteredItem.length > 0 ? filteredItem[0].sort_by_names : ''
  };


  //*------------------------- handleKeyFeatureCheck -----------------------
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


  const isValid = (e)=>{
    const trimmed_value = e.target.value.trim();
    const last_letter = trimmed_value.toLowerCase().charAt(trimmed_value.length - 1);
    const accepted_letters = 'abcdefghijklmnopqrstuvwxyz_';
    return accepted_letters.includes(last_letter);

  };

  const handleNewColumnName = (e)=>{
    const key = e.nativeEvent.inputType;
    if (key === 'deleteContentBackward') {
      setNewColumn((prev)=>({
            ...prev,
            newColumnName : prev.newColumnName.slice(0, -1)
        }));
        return;
    }
    if(isValid(e)){
      setNewColumn({ ...newColumn, newColumnName: e.target.value.trim().toLowerCase() });
    }
  };
  const handleRenameColumn = (e)=>{
    const key = e.nativeEvent.inputType;
    if (key === 'deleteContentBackward') {
      setRenameColumn((prev)=>({
            ...prev,
            newName : prev.newName.slice(0, -1)
        }));
        return;
    }
    if(isValid(e)){
      setRenameColumn({ ...renameColumn, newName: e.target.value.trim().toLowerCase() });
    }
  };
  

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
            onChange={(e) => handleNewColumnName(e)}
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
            onChange={(e) => handleRenameColumn(e)}
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
                onChange={(e) => handleAddNewSort(e, column)}
              />
              <input type='text'
                value={getSortByValue(column)}
                placeholder='[ name1 : n1, n2 ], [ name2 ] ...'
                onChange={(e) => handleSortByChange(e, column)}>

              </input>
            </div>

          ))}
          <button onClick={handleSaveSorting}>Save Sorting</button>
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
