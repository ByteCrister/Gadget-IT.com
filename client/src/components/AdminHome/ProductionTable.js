import React, { useEffect, useState, useContext, useRef } from 'react'

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
import ProductionTableManage from './ProductionTableManage';
import { useData } from '../../context/useData';
import Pagination from '../../HOOKS/Pagination';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { SearchProduction } from '../../HOOKS/SearchProduction';
import { Api_Inventory } from '../../api/Api_Inventory';
import { Api_Production } from '../../api/Api_Production';


const ProductionTable = React.memo(({ setErrorCategory }) => {
  const { dataState, dispatch } = useContext(useData);

  const [productsData, setProductsData] = useState(dataState.Production_Page.TableRows);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isProductionManagement, setIsProductionManagement] = useState(false);
  const [filterState, setFilterState] = useState({ state: 0, filterStyle: { backgroundColor: '#c6c6c6' } });
  const [selectedId, setSelectedId] = useState(null);
  const [selectCategory, setSelectedCategory] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [isRotating, setIsRotating] = useState(false);

  const searchRef = useRef();

  useEffect(() => {
    const initializeData = async () => {
      console.log('page three renders');
      setProductsData(dataState.Production_Page.TableRows);
      setHasInitialized(true);

    }
    if (!hasInitialized) {
      initializeData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState?.Production_Page?.TableRows]);

  useEffect(() => {
    dispatch({
      type: 'set_search_function',
      payload: {
        function: SearchProduction,
        params: {
          p_1: dataState.Production_Page.TableRows,
          p_2: setProductsData
        }
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState.Production_Page.TableRows]);

  // *------------------ Parent Function of Pagination ----------------------------
  const handleFilteredData = (data) => {
    setFilteredProducts((prev) => data);
  }
  // ******************************************************************************


  // *-------------------------- Sort by Filter -----------------------------------
  const handleFilterState = () => {
    setFilterState((prev) => ({
      ...prev,
      state: prev.state === 5 ? 0 : prev.state + 1
    }));
    sortProducts(filterState.state + 1);
  };
  const sortProducts = (state) => {
    let sortedData = [...productsData];
    if (state === 1) {
      sortedData.sort((a, b) => Number(a.id) - Number(b.id));
    } else if (state === 2) {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state === 3) {
      sortedData.sort((a, b) => a.type.localeCompare(b.type));
    } else if (state === 4) {
      sortedData.sort((a, b) => Number(a.quantity + a.reserved + a.incoming) - Number(b.quantity + b.reserved + b.incoming));
    } else if (state === 5) {
      sortedData.sort((a, b) => a.vendor.localeCompare(b.vendor));
    }
    else {
      sortedData = dataState.Production_Page.TableRows;
    }
    setProductsData(sortedData);
  };
  // ******************************************************************************


  //* ---------------------- searching ---------------------------
  const handleSearchChange = () => {
    const search = searchRef.current.value;
    SearchProduction(search, dataState.Production_Page.TableRows, setProductsData);
  }
  // ************************************************************



  // *------------------ Refresh Button ---------------------
  const handleRefresh = async () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 200);
    await Api_Inventory(dispatch);
    await Api_Production(dispatch);
  };


  return (
    <section id={styles.ProductionTableSection}>

      <section id={styles.SearchBarSection}>
        <div id={styles.SearchBar}>
          <FaSearch id={styles.SearchIcon} />
          <input type='text' name='search' id={styles.search} ref={searchRef} onChange={handleSearchChange} placeholder='Search...'></input>
        </div>
        <div>
          <button onClick={handleFilterState}><FaFilter id={styles.filterIcon} /></button>
          <button><LuRefreshCcw id={styles.refreshIcon} className={isRotating ? styles.rotate : ''} onClick={handleRefresh} /></button>
        </div>
      </section>


      <section className={styles.ProductionTable}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th style={filterState.state === 1 ? filterState.filterStyle : null}><div><MdOutlineInventory2 /><span>Product ID</span></div></th>
              <th style={filterState.state === 2 ? filterState.filterStyle : null}><div><MdOutlineInventory /><span>Product Name</span></div></th>
              <th style={filterState.state === 3 ? filterState.filterStyle : null}><div><TbCategory2 /><span>Type</span></div></th>
              <th ><div><TbAdjustmentsPause /><span>Status</span></div></th>
              <th style={filterState.state === 4 ? filterState.filterStyle : null}><div><ImListNumbered /><span>Count</span></div></th>
              <th style={filterState.state === 5 ? filterState.filterStyle : null}><div><AiOutlineShop /><span>Vendor</span></div></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={`table-row-product-${product.id}`} onClick={() => { setSelectedId(product.id); setSelectedCategory(product.type); setIsProductionManagement(true) }}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{GetCategoryName(product.type)}</td>
                <td>{Number(product.quantity) <= 0 ? 'out of stock' : Number(product.reserved) <= Number(product.quantity) ? 'in stock' : 'low stock'}</td>
                <td>{product.quantity + product.reserved + product.incoming}</td>
                <td>{product.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Pagination productsData={productsData} handleFilteredData={handleFilteredData} />


      {
        isProductionManagement && <ProductionTableManage id={selectedId} category={selectCategory} setIsProductionManagement={setIsProductionManagement} setErrorCategory={setErrorCategory}/>
      }

    </section>
  )
}
)

export default React.memo(ProductionTable);