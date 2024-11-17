import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaEyeSlash } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { RiFilter3Line } from "react-icons/ri";
import { LuUpload } from "react-icons/lu";
import { FaEye, FaTrash } from 'react-icons/fa';

import styles from '../../styles/AdminHome/PageTwo.module.css';
import AddProducts from '../../components/AdminHome/AddProducts';
import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { SearchInventory } from '../../HOOKS/SearchInventory';
import { Api_Inventory } from '../../api/Api_Inventory';

const PageTwo = React.memo(({setErrorCategory}) => {
  const { dataState, dispatch } = useContext(useData);

  const [productsData, setProductsData] = useState(dataState.Inventory_Page);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isChecked, setIsChecked] = useState([]);
  const [addProductState, setAddProductState] = useState(false);
  const [filterState, setFilterState] = useState({ state: 0, filterStyle: { backgroundColor: '#5d5d5d' } });
  const searchRef = useRef();

  useEffect(() => {
    console.log('page two renders');
    if (dataState?.Inventory_Page) {
      setProductsData(dataState.Inventory_Page);
      initializeCheck();
      sortProducts(filterState.state);
    }

  }, [dataState, dispatch]);

  useEffect(() => {
    dispatch({
      type: 'set_search_function',
      payload: {
        function: SearchInventory,
        params: {
          p_1: dataState.Inventory_Page,
          p_2: setProductsData
        }
      }
    })
  }, []);


  //* ------------------------------ product checked ------------------------
  const initializeCheck = useCallback(() => {
    let check = [];
    dataState.Inventory_Page.map((items) => check.push({ id: items.id, check: false, table: items.category, hide: items.hide }));
    setIsChecked(check);
  }, [dataState.Inventory_Page]);

  const handleCheckboxChange = useCallback((id) => {
    setIsChecked((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, check: !item.check, hide: item.hide === 0 ? 1 : 0 } : item
      )
    );
  }, []);

  const checkOrNot = useCallback((id) => {
    const item = isChecked.find((items) => items.id === id);
    return item ? item.check : false;
  }, [isChecked]);

  const handleAllChecked = useCallback(() => {
    let checked = [];
    isChecked.map((items) => checked.push({ id: items.id, check: !items.check, table: items.category, hide: items.hide }));
    setIsChecked(checked);
  }, [isChecked]);


  //* --------------------- Parent Function of Pagination -----------------------
  const handleFilteredData = (data) => {
    setFilteredProducts(data);
  };


  // * ------------------------------ Sort by Category --------------------------
  const handleCategoryChange = useCallback((event) => {
    const category = event.target.value;
    if (category.length === 0) {
      setProductsData(dataState.Inventory_Page);
    } else {
      setProductsData(dataState.Inventory_Page.filter((item) => item.category === category));
    }
  }, [dataState.Inventory_Page]);



  //* ----------------------------- sorting with stock -----------------------------
  const handleStockChange = useCallback((event) => {
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
  }, [dataState.Inventory_Page]);


  //* ------------------------ Sort by Filtering ---------------------------
  const handleFilterState = () => {
    setFilterState((prev) => ({
      ...prev,
      state: prev.state === 6 ? 0 : prev.state + 1
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
      sortedData.sort((a, b) => Number(a.incoming) - Number(b.incoming));
    } else if (state === 4) {
      sortedData.sort((a, b) => Number(a.reserved) - Number(b.reserved));
    } else if (state === 5) {
      sortedData.sort((a, b) => Number(a.quantity) - Number(b.quantity));
    } else if (state === 6) {
      sortedData.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sortedData = [...dataState.Inventory_Page];
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
      await axios.post('http://localhost:7000/update/hide', { checkedItems: checkedItems });
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
        <table>
          <thead>
            <tr>
              <th style={filterState.state === 1 ? filterState.filterStyle : null}><div id={styles.firstColumn}><input type="checkbox" id={styles.ProductName} onClick={handleAllChecked}></input>Product Name</div></th>
              <th style={filterState.state === 2 ? filterState.filterStyle : null}>Product ID</th>
              <th>Category</th>
              <th style={filterState.state === 3 ? filterState.filterStyle : null}>Incoming</th>
              <th style={filterState.state === 4 ? filterState.filterStyle : null}>Reserved</th>
              <th style={filterState.state === 5 ? filterState.filterStyle : null}>Quantity</th>
              <th style={filterState.state === 6 ? filterState.filterStyle : null}>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
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
                <td>{data.price}৳</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton} onClick={handleProductHide}>
                      {
                        data.hide === 0 ? <FaEye id={styles.EyeIcon} /> : <FaEyeSlash id={styles.EyeIcon} />
                      }
                    </button>
                    <button className={styles.actionButton}>
                      <FaTrash id={styles.TrashIcon} onClick={handleProductDelete} />
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
        addProductState && <AddProducts setAddProductState={setAddProductState} setErrorCategory={setErrorCategory}/>
      }
    </div>
  );
}
);

export default React.memo(PageTwo);
