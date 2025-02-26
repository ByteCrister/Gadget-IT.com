import React, { useEffect, useState } from 'react';
import styles from '../styles/AdminHome/ManageColumns.module.css';
import axios from 'axios';

const UseManageColumns = ({ selectState, setSelectState, selectedMainCategory }) => {
  const [allColumnNames, setAllColumnNames] = useState([]);
  const [deleteColumn, setDeleteColumn] = useState('');

  const [newAndRenameColumn, setNewAndRenameColumn] = useState({
    insertAfter: '',
    newColumnName: '',
    oldName: '',
    newName: ''
  });

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
      setNewAndRenameColumn((prev) => ({
        ...prev,
        insertAfter: '',
        newColumnName: '',
        oldName: '',
        newName: ''
      }));
      setDeleteColumn('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedMainCategory) {
      renderColumns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMainCategory]);

  const handleAddColumn = async () => {
    try {
      await axios.post('http://localhost:7000/add/column', {
        table: selectedMainCategory,
        ...newAndRenameColumn
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
        ...newAndRenameColumn
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

  const handleColumns = (e) => {
    const key = e.nativeEvent.inputType;
    if (key === 'deleteContentBackward') {
      setNewAndRenameColumn((prev) => ({
        ...prev,
        [e.target.id]: prev[e.target.id].slice(0, -1)
      }));
      return;
    }
    const trimmedText = e.target.value.trim();
    if ((trimmedText.length === 1 && trimmedText.charAt(0) === '_') || (trimmedText.charAt(trimmedText.length - 1) === '_' && trimmedText.charAt(trimmedText.length - 2) === '_')) {
      return;
    }
    const lastLetter = trimmedText.toLowerCase().charAt(trimmedText.length - 1);
    const acceptedLetters = 'abcdefghijklmnopqrstuvwxyz_';
    const isValid = acceptedLetters.includes(lastLetter);
    if (isValid) {
      setNewAndRenameColumn((prev) => ({
        ...prev,
        [e.target.id]: prev[e.target.id] + lastLetter
      }));
    }
  };

  return (
    <section className={styles.manageColumnsSection}>
      {selectState === 1 && (
        <div>
          <label htmlFor='select-insert-after'>Insert After</label>
          <select
            value={newAndRenameColumn.insertAfter}
            id='select-insert-after'
            onChange={(e) => setNewAndRenameColumn({ ...newAndRenameColumn, insertAfter: e.target.value })}
          >
            <option id='select-insert-after-option-0' value="">Select...</option>
            {allColumnNames.map((column, index) => (
              <option id={`select-insert-after-option-${index + 1}`} value={column} key={index}>
                {column}
              </option>
            ))}
          </select>
          <label htmlFor='newColumnName'>New Column Name</label>
          <input
            type="text"
            id='newColumnName'
            value={newAndRenameColumn.newColumnName}
            onChange={(e) => handleColumns(e)}
          />
          <button onClick={handleAddColumn}>Add Column</button>
        </div>
      )}
      {selectState === 2 && (
        <div>
          <label htmlFor='select-which-column'>Which Column You Want to Delete</label>
          <select
            value={deleteColumn}
            id='select-which-column'
            onChange={(e) => setDeleteColumn(e.target.value)}
          >
            <option id='select-which-column-option-0' value="">Select...</option>
            {allColumnNames.map((column, index) => (
              <option id={`select-which-column-option-${index + 1}`} value={column} key={index}>
                {column}
              </option>
            ))}
          </select>
          <button onClick={handleDeleteColumn}>Delete Column</button>
        </div>
      )}
      {selectState === 3 && (
        <div>
          <label htmlFor='select-rename'>Rename Column Name</label>
          <select
            value={newAndRenameColumn.oldName}
            id='select-rename'
            onChange={(e) => setNewAndRenameColumn({ ...newAndRenameColumn, oldName: e.target.value })}
          >
            <option id='select-rename-option-0' value="">Select...</option>
            {allColumnNames.map((column, index) => (
              <option id={`select-rename-option-${index + 1}`} value={column} key={index}>
                {column}
              </option>
            ))}
          </select>
          <input
            type="text"
            id='newName'
            placeholder="New Name"
            value={newAndRenameColumn.newName}
            onChange={(e) => handleColumns(e)}
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
                id={`checkbox-${index}`}
                value={column}
                checked={isChecked(column)}
                onChange={(e) => handleAddNewSort(e, column)}
              />
              <input
                type='text'
                id={`text-${index}`}
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
              <label htmlFor={`checkbox-column-name-${index}`}>{column}</label>
              <input
                type='checkbox'
                id={`checkbox-column-name-${index}`}
                value={column}
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
