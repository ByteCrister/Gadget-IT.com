import React, { useContext, useEffect, useRef, useState } from "react";
import { useData } from "../../context/useData";
import Pagination from "../../HOOKS/Pagination";
import { GetCategoryName } from "../../HOOKS/GetCategoryName";
import { FaSearch } from "react-icons/fa";
import styles from "../../styles/AdminHome/PageThree.module.css";
import { MdOutlineInventory, MdOutlineInventory2 } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import { FaFilter } from "react-icons/fa6";
import { PiSortDescendingBold } from "react-icons/pi";
import { TbSortDescendingSmallBig } from "react-icons/tb";
import { SearchSelectHomeProducts } from "../../HOOKS/SearchSelectHomeProducts";
import { Api_Setting } from "../../api/Api_Setting";
import { LuRefreshCcw } from "react-icons/lu";
import axios from "axios";

const SelectHomeProducts = () => {
  const { dataState, dispatch } = useContext(useData);

  const [productsData, setProductsData] = useState(
    dataState.Production_Page.TableRows || []
  );
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterState, setFilterState] = useState({
    state: 0,
    filterStyle: { backgroundColor: "#c6c6c6" },
  });

  const [productPosition, setProductPosition] = useState({
    ready_for_orders: [],
    featured_products: [],
    new_arrival: [],
  });
  const [serial_noState, setSerial_no_State] = useState({
    ready_for_orders: 0,
    featured_products: 0,
    new_arrival: 0,
  });
  const [isRotating, setIsRotating] = useState(false);
  const searchRef = useRef();

  const initialValues = (position) => {
    if (!Array.isArray(dataState?.Setting_Page?.home_product_select)) return [];

    return dataState.Setting_Page.home_product_select
      .filter((item) => String(item.position) === position)
      .map((item) => ({
        product_id: item.product_id,
        main_category: item.main_category,
        position: item.position,
        serial_no: item.serial_no,
      }));
  };

  useEffect(() => {
    const initializeData = () => {
      const initialProductPosition = {
        ready_for_orders: initialValues("ready_for_orders"),
        featured_products: initialValues("featured_products"),
        new_arrival: initialValues("new_arrival"),
      };



      const maxSerialNumbers = {
        ready_for_orders: Math.max(
          0,
          ...initialProductPosition.ready_for_orders.map(
            (item) => item.serial_no
          )
        ),
        featured_products: Math.max(
          0,
          ...initialProductPosition.featured_products.map(
            (item) => item.serial_no
          )
        ),
        new_arrival: Math.max(
          0,
          ...initialProductPosition.new_arrival.map((item) => item.serial_no)
        ),
      };

      setProductPosition(initialProductPosition);
      setSerial_no_State(maxSerialNumbers);
      setProductsData(dataState.Production_Page.TableRows);

      // console.log(initialProductPosition);
      // console.log(maxSerialNumbers);
      // console.log(dataState.Production_Page.TableRows);
    };

    initializeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState?.Production_Page?.TableRows]);

  // *------------------ Refresh Button ---------------------
  const handleRefresh = async () => {
    try {
      // console.log(productPosition);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/home-product-select/crud`, {
        productPosition: productPosition,
      });
      await Api_Setting(dispatch);
    } catch (error) {
      console.log(error);
    }
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 200);
  };
  // *-------------------------- Sort by Filter -----------------------------------
  const handleFilterState = () => {
    setFilterState((prev) => ({
      ...prev,
      state: prev.state === 3 ? 0 : prev.state + 1,
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
    } else {
      sortedData = dataState.Production_Page.TableRows;
    }
    setProductsData(sortedData);
  };
  //* ---------------------- searching ---------------------------
  const handleSearchChange = () => {
    const search = searchRef.current.value;
    SearchSelectHomeProducts(
      search,
      dataState.Production_Page.TableRows,
      setProductsData,
      GetSerialNo
    );
  };

  // *------------------ Parent Function of Pagination ----------------------------
  const handleFilteredData = (data) => {
    setFilteredProducts((prev) => data);
  };

  //*--------------------------- PositionDropdown ---------------------
  const getActionText = (text) => {
    return text === "ready_for_orders"
      ? "#74ff74"
      : text === "featured_products"
        ? "#a9fffb"
        : text === "new_arrival"
          ? "#ffc0a7"
          : "#c3dfff";
  };

  //*--------------------------- Is Checked? ----------------------------
  const isChecked = (productId) => {
    return ["ready_for_orders", "featured_products", "new_arrival"].some(
      (position) =>
        productPosition[position].some(
          (item) => item.product_id === productId && item.serial_no !== 0
        )
    );
  };

  //* ------------------------------------- GetPositionName -------------------------------
  const GetPositionName = (productID) => {
    const position = [
      "ready_for_orders",
      "featured_products",
      "new_arrival",
    ].find((position) =>
      productPosition[position].some((item) => item.product_id === productID)
    );

    return position || "";
  };

  //* ----------------------------------- GetSerialNo -----------------------
  const GetSerialNo = (productId) => {
    // console.log(productId);
    const product = ["ready_for_orders", "featured_products", "new_arrival"]
      .map((position) =>
        productPosition[position].find((item) => item.product_id === productId)
      )
      .find((item) => item);
    return product ? product.serial_no : 0;
  };

  // const optionSelected = (productId, position) => {
  //   return productPosition[position].filter(
  //     (item) => productId === item.product_id && item.position === position
  //   ).length > 0
  //     ? true
  //     : false;
  // };


  // ****************** handlePositionChange ********************
  const handlePositionChange = (e, productId, MainCategory) => {
    const prevPosition = GetPositionName(productId);
    const currPosition = e.target.value;
    const currSerial = GetSerialNo(productId);
    console.log('curr: ' + currPosition + ' - prev: ' + prevPosition + ' - currSerial: ' + currSerial);
    if (!prevPosition || prevPosition.length === 0) {
      // for first select
      setProductPosition((prev) => ({
        ...prev,
        [currPosition]: [...prev[currPosition], { product_id: productId, main_category: MainCategory, position: currPosition, serial_no: 0 }]
      }));
    } else if (!currPosition || currPosition.length === 0) {
      //if unselect
      setProductPosition((prev) => ({
        ...prev,
        [prevPosition]: [...prev[prevPosition].filter((product) => product.product_id !== productId).map((product) => ({ ...product, serial_no: currSerial !== 0 && currSerial < product.serial_no ? product.serial_no - 1 : product.serial_no }))]
      }));
      setSerial_no_State((prev) => ({ ...prev, [prevPosition]: currSerial !== 0 ? prev[prevPosition] - 1 : prev[prevPosition] }));
      // console.log('serial after unselect: ' + JSON.stringify(serial_noState, null, 2));
    } else {
      // if position shift
      setProductPosition((prev) => ({
        ...prev,
        [prevPosition]: [...prev[prevPosition].filter((product) => product.product_id !== productId)],
        [currPosition]: [...prev[currPosition], { product_id: productId, main_category: MainCategory, position: currPosition, serial_no: 0 }]
      }));
      setSerial_no_State((prev) => ({ ...prev, [prevPosition]: currSerial !== 0 ? prev[prevPosition] - 1 : prev[prevPosition] }));
    }
    // console.log(productPosition);
  };

  const handleCheckChange = (e, productId) => {
    const isChecked = e.target.checked;
    const position = GetPositionName(productId);
    const currSerial = GetSerialNo(productId);
    console.log('isChecked: ' + isChecked + ' - position: ' + position + ' - currSerial: ' + currSerial);
    if (isChecked && position && position.length !== 0) {
      setProductPosition((prev) => ({
        ...prev,
        [position]: [...prev[position].map((product) => product.product_id === productId ? { ...product, serial_no: serial_noState[position] + 1 } : product)]
      }));
      setSerial_no_State((prev) => ({ ...prev, [position]: prev[position] + 1 }));
      // console.log(serial_noState);
    } else if (currSerial !== 0) {
      setProductPosition((prev) => ({
        ...prev,
        [position]: [...prev[position].map((product) => product.product_id === productId ? { ...product, serial_no: 0 } : { ...product, serial_no: currSerial !== 0 && currSerial < product.serial_no ? product.serial_no - 1 : product.serial_no })]
      }));
      setSerial_no_State((prev) => ({ ...prev, [position]: prev[position] - 1 }));
    }

  };

  useEffect(() => {
    dispatch({
      type: 'set_search_function',
      payload: {
        function: SearchSelectHomeProducts,
        params: {
          1: dataState.Production_Page.TableRows,
          2: setProductsData,
          3: GetSerialNo
        }
      }
    })
  }, [dataState.Production_Page.TableRows, GetSerialNo]);

  return (
    <div>
      <section id={styles.SearchBarSection}>
        <div id={styles.SearchBar}>
          <FaSearch id={styles.SearchIcon} />
          <input
            type="text"
            name="search"
            id={styles.search}
            ref={searchRef}
            onChange={handleSearchChange}
            placeholder="Search..."
          ></input>
        </div>
        <div>
          <button onClick={handleFilterState}>
            <FaFilter id={styles.filterIcon} />
          </button>
          <button>
            <LuRefreshCcw
              id={styles.refreshIcon}
              className={isRotating ? styles.rotate : ""}
              onClick={handleRefresh}
            />
          </button>
        </div>
      </section>

      <section className={styles.ProductionTable}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th
                style={filterState.state === 1 ? filterState.filterStyle : null}
              >
                <div>
                  <MdOutlineInventory2 />
                  <span>Product ID</span>
                </div>
              </th>
              <th
                style={filterState.state === 2 ? filterState.filterStyle : null}
              >
                <div>
                  <MdOutlineInventory />
                  <span>Product Name</span>
                </div>
              </th>
              <th
                style={filterState.state === 3 ? filterState.filterStyle : null}
              >
                <div>
                  <TbCategory2 />
                  <span>Type</span>
                </div>
              </th>
              <th>
                <div>
                  <PiSortDescendingBold />
                  <span>Serial No</span>
                </div>
              </th>
              <th>
                <div>
                  <TbSortDescendingSmallBig />
                  <span>Position</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, i) => (
              <tr key={product.id} onClick={() => { }}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{GetCategoryName(product.type)}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={isChecked(product.id)}
                    onChange={(e) => handleCheckChange(e, product.id)}
                  ></input>
                  <span>{GetSerialNo(product.id)}</span>
                </td>
                <td>
                  <select
                    style={{ backgroundColor: getActionText(GetPositionName(product.id)) }}
                    className={styles.page_eight_product_select}
                    value={GetPositionName(product.id)}
                    onChange={(e) => handlePositionChange(e, product.id, product.type)}
                  >
                    <option
                      value=""
                    >
                      Select Position
                    </option>
                    <option
                      value="ready_for_orders"
                      selected={GetPositionName(product.id) === 'ready_for_orders'}
                    >
                      Ready for Orders
                    </option>
                    <option
                      value="featured_products"
                      selected={GetPositionName(product.id) === 'featured_products'}
                    >
                      Featured Products
                    </option>
                    <option
                      value="new_arrival"
                      selected={GetPositionName(product.id) === 'new_arrival'}
                    >
                      New Arrival
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Pagination productsData={productsData} handleFilteredData={handleFilteredData} />
    </div>
  );
};

export default SelectHomeProducts;
