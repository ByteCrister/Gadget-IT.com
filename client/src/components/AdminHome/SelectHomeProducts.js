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
    ready_for_orders_serial: 0,
    featured_products_serial: 0,
    new_arrival_serial: 0,
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

      setProductPosition(initialProductPosition);

      const maxSerialNumbers = {
        ready_for_orders_serial: Math.max(
          0,
          ...initialProductPosition.ready_for_orders.map(
            (item) => item.serial_no
          )
        ),
        featured_products_serial: Math.max(
          0,
          ...initialProductPosition.featured_products.map(
            (item) => item.serial_no
          )
        ),
        new_arrival_serial: Math.max(
          0,
          ...initialProductPosition.new_arrival.map((item) => item.serial_no)
        ),
      };

      setSerial_no_State(maxSerialNumbers);
      setProductsData(dataState.Production_Page.TableRows);
    };

    initializeData();
  }, [dataState]);

  // *------------------ Refresh Button ---------------------
  const handleRefresh = async () => {
    try {
      await axios.post("http://localhost:7000/home-product-select/crud", {
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
      productsData
    );
  };

  // *------------------ Parent Function of Pagination ----------------------------
  const handleFilteredData = (data) => {
    setFilteredProducts((prev) => data);
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

  const optionSelected = (productId, position) => {
    return productPosition[position].filter(
      (item) => productId === item.product_id && item.position === position
    ).length > 0
      ? true
      : false;
  };

  const PositionDropdown = (productId, productType) => {
    return (
      <select
        style={{ backgroundColor: getActionText(GetPositionName(productId)) }}
        className={styles.page_eight_product_select}
        value={GetPositionName(productId)}
        onChange={(e) =>
          handlePosition(e, productId, GetPositionName(productId), productType)
        }
      >
        <option
          value=""
          selected={!optionSelected(productId, "ready_for_orders")}
        >
          Select Position
        </option>
        <option
          value="ready_for_orders"
          selected={optionSelected(productId, "ready_for_orders")}
        >
          Ready for Orders
        </option>
        <option
          value="featured_products"
          selected={optionSelected(productId, "featured_products")}
        >
          Featured Products
        </option>
        <option
          value="new_arrival"
          selected={optionSelected(productId, "new_arrival")}
        >
          New Arrival
        </option>
      </select>
    );
  };
  //*------------------------------------- remove position ---------------------
  const removePosition = (productId, keyState) => {
    setProductPosition((prev) => ({
      ...prev,
      [keyState]: prev[keyState].filter(
        (item) => item.product_id !== productId
      ),
    }));
  };

  //*-------------------------------- handlePosition ------------------------
  const handlePosition = (e, productId, prevPosition, productType) => {
    const newPosition = e.target.value;

    console.log("curr - " + newPosition + "  prev - " + prevPosition);

    // Ensure prevPosition and newPosition are valid
    if (prevPosition && newPosition) {
      // Find the product details in the previous position
      const product = productPosition[prevPosition]?.find(
        (item) => item.product_id === productId
      );

      if (product) {
        // Add product to the new position
        setProductPosition((prev) => ({
          ...prev,
          [newPosition]: [
            ...(prev[newPosition] || []),
            {
              product_id: product.product_id,
              main_category: product.main_category,
              position: newPosition,
              serial_no: 0,
            },
          ],
        }));

        // Remove product from the previous position
        removePosition(productId, prevPosition);
      }
    } else if (!prevPosition && newPosition) {
      // Handle case where there's no previous position (initial assignment)
      setProductPosition((prev) => ({
        ...prev,
        [newPosition]: [
          ...(prev[newPosition] || []),
          {
            product_id: productId,
            main_category: productType,
            position: newPosition,
            serial_no: 0,
          },
        ],
      }));
    } else {
      removePosition(productId, prevPosition);
      console.log(JSON.stringify(productPosition[prevPosition]));
    }
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

  //*---------------------------------- handleSerialNo ---------------------------
  const handleSerialNo = (e, productID, currPosition) => {
    const isChecked = e.target.checked;
    const serialState = currPosition + "_serial";

    console.log(isChecked + "- position :  " + currPosition);

    !isChecked && removePosition(productID, currPosition);

    if (currPosition && currPosition.length !== 0) {
      const currSerial = productPosition[currPosition].filter(
        (item) => item.product_id === productID
      )[0].serial_no;
      console.log(
        "current serial of productID : " + productID + " - " + currSerial
      );

      setProductPosition((prev) => ({
        ...prev,
        [currPosition]: prev[currPosition].map((item, i) =>
          item.product_id === productID
            ? {
              ...item,
              serial_no: isChecked ? serial_noState[serialState] + 1 : 0,
              position: isChecked ? item.position : "ready_for_orders",
            } // ready_for_orders - not a valid position
            : !isChecked && item.serial_no !== 0 && currSerial < item.serial_no
              ? { ...item, serial_no: item.serial_no - 1 }
              : item
        ),
      }));

      setSerial_no_State((prev) => ({
        ...prev,
        [serialState]: isChecked
          ? prev[serialState] + 1
          : prev[serialState] !== 0 && prev[serialState] - 1,
      }));
    }
  };

  useEffect(() => {
    console.log(
      "setSerial_no_State : " + JSON.stringify(serial_noState, null, 2)
    );
  }, [productPosition, serial_noState]);

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
                    onChange={(e) =>
                      handleSerialNo(e, product.id, GetPositionName(product.id))
                    }
                  ></input>{" "}
                  <span>{GetSerialNo(product.id)}</span>
                </td>
                <td>{PositionDropdown(product.id, product.type)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Pagination
        productsData={productsData}
        handleFilteredData={handleFilteredData}
      />
    </div>
  );
};

export default SelectHomeProducts;
