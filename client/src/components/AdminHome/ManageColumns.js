import React, { useEffect, useState } from 'react';
import UseManageColumns from '../../HOOKS/UseManageColumns';
import styles from '../../styles/AdminHome/ManageColumns.module.css';
import axios from 'axios';

const ManageColumns = React.memo(() => {
  const [selectState, setSelectState] = useState(0);
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  useEffect(() => {
    const getMainCategory = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/category_and_sub_category`);
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
        <select id='manage-columns-select' value={selectState} onChange={(e) => setSelectState(Number(e.target.value))}>
          <option id='manage-columns-option-0' value={0}>Select...</option>
          <option id='manage-columns-option-1' value={1}>Add Column</option>
          <option id='manage-columns-option-2' value={2}>Delete Column</option>
          <option id='manage-columns-option-3' value={3}>Rename Column</option>
          <option id='manage-columns-option-4' value={4}>Add New or Remove Sorting</option>
          <option id='manage-columns-option-5' value={5}>Add or Remove Key Feature</option>
        </select>
      </section>

      {selectState !== 0 && (
        <section className={styles.manageColumnsCategory}>
          <label htmlFor='select-category'>Select Category</label>
          <select id='select-category' value={selectedMainCategory} onChange={(e) => setSelectedMainCategory(e.target.value)}>
            <option id='select-category-option-0' value="">Select...</option>
            {mainCategory.map((item, index) => (
              <option id={`select-category-option-${index + 1}`} key={item.id} value={item.category_name}>
                {item.category_name}
              </option>
            ))}
          </select>
        </section>
      )}
      {selectedMainCategory.length > 0 &&
        <UseManageColumns selectState={selectState} setSelectState={setSelectState} selectedMainCategory={selectedMainCategory} />
      }
    </div>
  );
}
)

export default React.memo(ManageColumns);
