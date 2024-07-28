import React, { useState } from 'react'

import { FaSearch } from 'react-icons/fa';
import { FaFilter } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import { TbAdjustmentsPause } from "react-icons/tb";
import { ImListNumbered } from "react-icons/im";
import { AiOutlineShop } from "react-icons/ai";


import styles from '../../styles/AdminHome/PageThree.module.css';


const ProductionTable = ({ handleProductionID, productionData }) => {


  // -----------------------------------------------------------------------------------------------------
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState(Math.ceil(productionData.length / itemsPerPage));
  const [currentPage, setCurrentPage] = useState(0);
  const getVisiblePages = 3;

  // Function to paginate the data
  const paginateData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productionData.slice(startIndex, endIndex);
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
    <section id={styles.ProductionTableSection}>

      <section id={styles.SearchBarSection}>
        <div id={styles.SearchBar}>
          <FaSearch id={styles.SearchIcon} />
          <input type='text' name='search' id={styles.search} placeholder='Search...'></input>
        </div>
        <div>
          <button><FaFilter id={styles.filterIcon} /></button>
          <button><LuRefreshCcw id={styles.refreshIcon} /></button>
        </div>
      </section>


      <section className={styles.ProductionTable}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th ><div><MdOutlineInventory2 /><span>Product ID</span></div></th>
              <th ><div><MdOutlineInventory /><span>Product Name</span></div></th>
              <th ><div><TbCategory2 /><span>Type</span></div></th>
              <th ><div><TbAdjustmentsPause /><span>Status</span></div></th>
              <th ><div><ImListNumbered /><span>Count</span></div></th>
              <th ><div><AiOutlineShop /><span>Vendor</span></div></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.productId} onClick={() => {   handleProductionID(product.productId) }}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.category}</td>
                <td>{product.status}</td>
                <td>{product.count}</td>
                <td>{product.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

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
  )
}

export default ProductionTable