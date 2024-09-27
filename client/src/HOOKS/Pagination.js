import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import styles from '../styles/AdminHome/Pagination.module.css';


const Pagination = ({ productsData, handleFilteredData }) => {
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

  useEffect(() => {
    handleFilteredData(paginateData());
  }, [currentPage, productsData]);

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

  return (
    <div className={styles.pagination}>
      <button className={styles.firstLast} disabled={currentPage === 0} onClick={handleFirstPage}><MdKeyboardDoubleArrowLeft /></button>
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
      <button className={styles.firstLast} disabled={currentPage === totalPages - 1} onClick={handleLastPage}><MdKeyboardDoubleArrowRight /></button>
    </div>
  );
};

Pagination.propTypes = {
  productsData: PropTypes.array.isRequired,
  handleFilteredData: PropTypes.func.isRequired,
};

export default Pagination;
