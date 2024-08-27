import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from '../../styles/AdminHome/PageTwo.module.css';
import { FaEyeSlash } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { RiFilter3Line } from "react-icons/ri";
import { LuUpload } from "react-icons/lu";
import { FaEye, FaTrash } from 'react-icons/fa';
import AddProducts from '../../components/AdminHome/AddProducts';
import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { SearchInventory } from '../../HOOKS/SearchInventory';
import axios from 'axios';
import { Api_Inventory } from '../../api/Api_Inventory';

const PageTwo = React.memo(() => {
  const { dataState, dispatch } = useContext(useData);

  const [productsData, setProductsData] = useState(dataState.Inventory_Page);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isChecked, setIsChecked] = useState([]);
  const [addProductState, setAddProductState] = useState(false);
  const [filterState, setFilterState] = useState({ state: 0, filterStyle: { backgroundColor: 'grey' } });
  const searchRef = useRef();

  useEffect(() => {
      console.log('page two renders');
      setProductsData(dataState.Inventory_Page);
      initializeCheck();
      sortProducts(filterState.state);
    
  }, [dataState, dispatch]);


  //* ------------------------------ product checked ------------------------
  const initializeCheck = () => {
    let check = [];
    dataState.Inventory_Page.map((items) => check.push({ id: items.id, check: false, table: items.category, hide: items.hide }));
    setIsChecked(check);
  }

  const handleCheckboxChange = (id) => {
    setIsChecked((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, check: !item.check, hide: item.hide === 0 ? 1 : 0 } : item
      )
    );
  };
  const checkOrNot = (id) => {
    const item = isChecked.find((items) => items.id === id);
    return item ? item.check : false;
  }
  const handleAllChecked = ()=>{
    let checked = [];
    isChecked.map((items)=> checked.push({ id: items.id, check: !items.check, table: items.category, hide: items.hide }) );
    setIsChecked(checked);
  }
  

  //* --------------------- Parent Function of Pagination -----------------------
  const handleFilteredData = (data) => {
    setFilteredProducts(data);
  };
  

  // * ------------------------------ Sort by Category --------------------------
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    if (category.length === 0) {
      setProductsData(dataState.Inventory_Page);
    } else {
      setProductsData(dataState.Inventory_Page.filter((item) => item.category === category));
    }
  };
 


  //* ----------------------------- sorting with stock -----------------------------
  const handleStockChange = (event) => {
    const stock = event.target.value;

    if (stock.length === 0) {
      setProductsData(dataState.Inventory_Page);
    } else if (stock === 'low') {
      setProductsData(dataState.Inventory_Page.filter((item) => item.reserved > item.quantity));
    } else if (stock === 'out') {
      setProductsData(dataState.Inventory_Page.filter((item) => item.quantity === 0));
    } else {
      setProductsData(dataState.Inventory_Page.filter((item) => item.reserved <= item.quantity));
    }
  };
  

  //* ------------------------ Sort by Filtering ---------------------------
  const handleFilterState = () => {
    setFilterState((prev) => ({
      ...prev,
      state: prev.state === 3 ? 0 : prev.state + 1
    }));
    sortProducts(filterState.state + 1);
  };
  const sortProducts = (state) => {
    let sortedData = [...productsData];
    if (state === 1) {
      sortedData.sort((a, b) => a.p_name.localeCompare(b.p_name));
    } else if (state === 2) {
      sortedData.sort((a, b) => Number(a.id) - Number(b.id));
    } else if (state === 3) {
      sortedData.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sortedData = dataState.Inventory_Page;
    }
    setProductsData(sortedData);
  };
 

  //* ---------------------- searching ---------------------------
  const handleSearchChange = () => {
    const search = searchRef.current.value;
    SearchInventory(search, dataState.Inventory_Page, setProductsData);
  }
  

  //* ------------------- Hide --------------------------
  const handleProductHide = async () => {
    const checkedItems = isChecked.filter((item) => item.check === true);

    const updatedProductsData = productsData.map((product) => {
      const checkedItem = checkedItems.find((item) => item.id === product.id);
      if (checkedItem) {
        return { ...product, hide: product.hide === 0 ? 1 : 0 };
      }
      return product;
    });
    
    setProductsData(updatedProductsData);
    // console.log(JSON.stringify(checkedItems, null, 2));
    try {
      await axios.post('http://localhost:7000/update/hide', { checkedItems : checkedItems });
      await Api_Inventory(dispatch);
    } catch (error) {
      console.log(error);
    }
  };
  


   //* ------------------- Handle Product Delete --------------------------
   const handleProductDelete = async () => {
    const checkedItems = isChecked.filter((item) => item.check === true);
    try {
      await axios.post('http://localhost:7000/delete/products', { checkedItems });
      await Api_Inventory(dispatch);
      setProductsData((prevData) => prevData.filter((item) => !checkedItems.some((checkedItem) => checkedItem.id === item.id)));
      initializeCheck(); 
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className={styles.mainPageTwoContainer}>
      <section className={styles.section_1}>
        <span style={{ color: 'grey' }}>Inventory / <sub>( {dataState.Inventory_Page.length} )</sub></span>
      </section>

      <section className={styles.section_2}>
        <div className={styles.searchContainer}>
          <div className={styles.searchFieldWrapper}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchField}
              ref={searchRef}
              onChange={handleSearchChange}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
          <button className={styles.filterButton} onClick={handleFilterState} >
            <RiFilter3Line style={{ fontSize: '20px' }} />
            Filter
          </button>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.formControl}>
            <label htmlFor="categorySelect">Category</label>
            <select id="categorySelect" className={styles.selectField} onChange={handleCategoryChange}>
              <option value=""></option>
              {
                dataState.categoryName.map((items, index) => {
                  return <option key={index} value={items}>{GetCategoryName(items)}</option>
                })
              }
            </select>
          </div>
          <div className={styles.formControl}>
            <label htmlFor="stockAlertSelect">Stock Alert</label>
            <select id="stockAlertSelect" className={styles.selectField} onChange={handleStockChange}>
              <option value=""></option>
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
              <th style={filterState.state === 1 ? filterState.filterStyle : null}><div id={styles.firstColumn}><input type="checkbox" id={styles.ProductName} onClick={handleAllChecked}></input>Product Name</div></th>
              <th style={filterState.state === 2 ? filterState.filterStyle : null}>Product ID</th>
              <th>Category</th>
              <th>Incoming</th>
              <th>Reserved</th>
              <th>Quantity</th>
              <th style={filterState.state === 3 ? filterState.filterStyle : null}>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredProducts.map((data, index) => (
              <tr key={index}>

                <td><div className={styles.firstColumn}>
                  <input type="checkbox" checked={checkOrNot(data.id)} onChange={() => handleCheckboxChange(data.id)} />
                  {data.p_name}</div></td>
                <td>{data.id}</td>
                <td>{GetCategoryName(data.category)}</td>
                <td>{data.incoming}</td>
                <td>{data.reserved}</td>
                <td>{data.quantity}</td>
                <td>${data.price}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={handleProductHide}>
                      {
                        data.hide === 0 ? <FaEye id={styles.EyeIcon} /> : <FaEyeSlash id={styles.EyeIcon} />
                      }
                    </button>
                    <button className={styles.actionButton}>
                      <FaTrash id={styles.TrashIcon} onClick={handleProductDelete}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination productsData={productsData} handleFilteredData={handleFilteredData} />

      </section>

      {
        addProductState && <AddProducts setAddProductState={setAddProductState} />
      }
    </div>
  );
}
)

export default PageTwo;
