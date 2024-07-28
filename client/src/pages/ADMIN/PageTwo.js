import React, { useState } from 'react';
import styles from '../../styles/AdminHome/PageTwo.module.css';
import ProductTable from '../../ProductTable.json';
import { FaSearch } from 'react-icons/fa';
import { RiFilter3Line } from "react-icons/ri";
import { LuUpload } from "react-icons/lu";
import { FaEye, FaTrash } from 'react-icons/fa';
import AddProducts from '../../components/AdminHome/AddProducts';

const PageTwo = () => {
  const productsData = ProductTable;

  const [addProductState, setAddProductState] = useState(false);


  // -----------------------------------------------------------------------------------------------------
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState(Math.ceil(productsData.length / itemsPerPage));
  const [currentPage, setCurrentPage] = useState(0);
  const getVisiblePages = 3;

  // Function to paginate the data
  const paginateData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productsData.slice(startIndex, endIndex);
  };

  const handleCurrentPage = (index) => {
    setCurrentPage(index);
  };

  const handlePrevNext = (action) => {
    if (action === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (action === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  const startPage = Math.floor(currentPage / getVisiblePages) * getVisiblePages;
  const endPage = Math.min(totalPages, startPage + getVisiblePages);

  const filteredProducts = paginateData();
  // ----------------------------------------------------------------------------------------------



  return (
    <div className={styles.mainPageTwoContainer}>
      <section className={styles.section_1}>
        <span style={{ color: 'grey' }}>Inventory / <sub>{' (2002 )'}</sub></span>
      </section>

      <section className={styles.section_2}>
        <div className={styles.searchContainer}>
          <div className={styles.searchFieldWrapper}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchField}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
          <button className={styles.filterButton}>
            <RiFilter3Line style={{ fontSize: '20px' }} />
            Filter
          </button>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.formControl}>
            <label htmlFor="categorySelect">Category</label>
            <select id="categorySelect" className={styles.selectField}>
              <option value="">None</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>
          <div className={styles.formControl}>
            <label htmlFor="stockAlertSelect">Stock Alert</label>
            <select id="stockAlertSelect" className={styles.selectField}>
              <option value="">None</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="in">In Stock</option>
            </select>
          </div>
        </div>
        <div className={styles.AddInventoryButtonContainer} onClick={() => { setAddProductState(!addProductState) }}>
          <button><LuUpload /> Add Product</button>
        </div>
      </section>

      <section className={styles.section_3}>
        <table className={styles.tableContainer}>
          <thead className={styles.tableHeader}>
            <tr>
              <th><div id={styles.firstColumn}><input type="checkbox" id={styles.ProductName}></input>Product Name</div></th>
              <th>Product ID</th>
              <th>Category</th>
              <th>Incoming</th>
              <th>Reserved</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredProducts.map((data, index) => (
              <tr key={index}>
                <td><div className={styles.firstColumn}><input type="checkbox" />{data.productName}</div></td>
                <td>{data.productId}</td>
                <td>{data.category}</td>
                <td>{data.incoming}</td>
                <td>{data.reserved}</td>
                <td>{data.quantity}</td>
                <td>${data.price}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton}>
                      <FaEye id={styles.EyeIcon} />
                    </button>
                    <button className={styles.actionButton}>
                      <FaTrash id={styles.TrashIcon} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>




        <div className={styles.pagination}>
          <button className={styles.firstLast} disabled={currentPage === 0} onClick={handleFirstPage}>{'<'}</button>
          <button className={styles.previous} disabled={currentPage === 0} onClick={() => handlePrevNext('prev')}>Previous</button>
          {Array.from({ length: endPage - startPage }, (_, index) => {
            const pageIndex = startPage + index;
            return (
              <button
                key={pageIndex}
                className={pageIndex === currentPage ? styles.active : styles.pageButton}
                onClick={() => handleCurrentPage(pageIndex)}
              >
                {pageIndex + 1}
              </button>
            );
          })}
          <button className={styles.next} disabled={currentPage === totalPages - 1} onClick={() => handlePrevNext('next')}>Next</button>
          <button className={styles.firstLast} disabled={currentPage === totalPages - 1} onClick={handleLastPage}>{'>'}</button>
        </div>

      </section>
      {/* -------------------------------------------- */}



      {
        addProductState && <AddProducts setAddProductState={setAddProductState}/>
      }
    </div>
  );
};

export default PageTwo;
