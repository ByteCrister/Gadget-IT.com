import React, { useCallback, useState } from 'react'
import styles from '../../styles/AdminHome/PageThree.module.css'
import ProductionTable from '../../components/AdminHome/ProductionTable';
import ManageColumns from '../../components/AdminHome/ManageColumns';
import CreateNewCategory from '../../components/AdminHome/CreateNewCategory';
import ManageVendors from '../../components/AdminHome/ManageVendors';
import SalesManagement from '../../components/AdminHome/SalesManagement';

const PageThree = React.memo(({ setErrorCategory }) => {
  const [pageThreeCurrentPage, setPageThreeCurrentPage] = useState(1);


  const renderCurrentPage = useCallback(() => {
    switch (pageThreeCurrentPage) {
      case 1:
        return <ProductionTable setErrorCategory={setErrorCategory} />

      case 2:
        return <ManageColumns />

      case 3:
        return <CreateNewCategory setErrorCategory={setErrorCategory} />

      case 4:
        return <ManageVendors />

      default:
        return <SalesManagement />;
    }
  }, [pageThreeCurrentPage, setErrorCategory]);

  const getCurrentButtonClassName = useCallback((page) => {
    return pageThreeCurrentPage === page ? styles.production_button_active : styles.production_button;
  }, [pageThreeCurrentPage]);


  return (
    <div className={styles.mainProductionContainer}>
      <span className={styles.ProductionText}>Productions Management</span>

      <div className={styles.production_buttons}>
        {
          ["Manage Inventory", "Columns && Sorting", "Category's", "Vendors", "Sales"].map((item, index) => {
            return <button key={index} className={getCurrentButtonClassName(index + 1)} onClick={() => { setPageThreeCurrentPage(index + 1) }} >
              {item}
            </button>
          })
        }
      </div>

      <div className={styles.ProductionContents}>
        {renderCurrentPage()}
      </div>
    </div>
  )
}
)
export default React.memo(PageThree);
