import React, { useEffect, useState } from 'react';
import UseManageColumns from '../../HOOKS/UseManageColumns';
import styles from '../../styles/AdminHome/ManageColumns.module.css';
import axios from 'axios';

const ManageColumns = () => {
  const [selectState, setSelectState] = useState(0);
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  useEffect(() => {
    const getMainCategory = async () => {
      try {
        const res = await axios.get('http://localhost:7000/get/category_and_sub_category');
        setMainCategory(res.data.mainCategory);
      } catch (error) {
        console.log(error);
      }
    };
    getMainCategory();
  }, [selectState]);

  return (
    <div className={styles.manageColumnsMainContainer}>
      <section className={styles.manageColumnsState}>
        <select value={selectState} onChange={(e) => setSelectState(Number(e.target.value))}>
          <option value={0}>Select...</option>
          <option value={1}>Add Column</option>
          <option value={2}>Delete Column</option>
          <option value={3}>Rename Column</option>
          <option value={4}>Add New or Remove Sorting</option>
          <option value={5}>Add or Remove Key Feature</option>
        </select>
      </section>

      {selectState !== 0 && (
        <section className={styles.manageColumnsCategory}>
          <label>Select Category</label>
          <select value={selectedMainCategory} onChange={(e) => setSelectedMainCategory(e.target.value)}>
            <option value="">Select...</option>
            {mainCategory.map((item) => (
              <option value={item.category_name} key={item.id}>
                {item.category_name}
              </option>
            ))}
          </select>
        </section>
      )}
      {selectedMainCategory.length > 0 && (
       <>
        <UseManageColumns selectState={selectState} setSelectState={setSelectState} selectedMainCategory={selectedMainCategory} />
       </>
      )}
    </div>
  );
};

export default ManageColumns;
