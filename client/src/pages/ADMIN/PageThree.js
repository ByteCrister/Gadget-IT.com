import React, { useState } from 'react'
import styles from '../../styles/AdminHome/PageThree.module.css'
import ProductionTable from '../../components/AdminHome/ProductionTable';
import ManageColumns from '../../components/AdminHome/ManageColumns';
import CreateNewCategory from '../../components/AdminHome/CreateNewCategory';

const PageThree = React.memo(({setErrorCategory}) => {
  const [pageThreeCurrentPage, setPageThreeCurrentPage] = useState(1);


  return (
    <div className={styles.mainProductionContainer}>
      <span className={styles.ProductionText}>Productions Management</span>

      <div className={styles.production_buttons}>
        <button
          className={pageThreeCurrentPage === 1 ? styles.production_button_active : styles.production_button}
          onClick={() => { setPageThreeCurrentPage(1) }}
        >
          Manage Inventory
        </button>
        <button
          className={pageThreeCurrentPage === 2 ? styles.production_button_active : styles.production_button}
          onClick={() => { setPageThreeCurrentPage(2) }}
        >
          Manage Columns && Sorting
        </button>
        <button
          className={pageThreeCurrentPage === 3 ? styles.production_button_active : styles.production_button}
          onClick={() => { setPageThreeCurrentPage(3) }}
        >
          Manage Category's
        </button>
      </div>


      <div className={styles.ProductionContents}>
        {
          pageThreeCurrentPage === 1 ?
            <ProductionTable />
            : pageThreeCurrentPage === 2 ?
              <ManageColumns />
              : <CreateNewCategory setErrorCategory={setErrorCategory}/>
        }
      </div>

    </div>
  )
}
)
export default React.memo(PageThree);
