import React, { useEffect, useReducer } from "react";
import reducer from "./reducer";
import { useData } from "./useData";
import { GetMenuItems } from "../api/GetMenuItems";
import { AdminRenderApi } from "../api/AdminRenderApi";
import { Api_Inventory } from "../api/Api_Inventory";
import { Api_Production } from "../api/Api_Production";
import { Api_Setting } from "../api/Api_Setting";
import { User_Home } from "../api/User_Home";
import { User_Products } from "../api/User_Products";
import { Api_Support } from "../api/Api_Support";
import { Api_Report } from "../api/Api_Report";

const admin_token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
const tokenString = window.localStorage.getItem("token");
const token = tokenString ? JSON.parse(tokenString) : false;
const isValidToken = token && typeof token === "string" && token.length > 0;

const isThereRecentProduct = window.localStorage.getItem("RecentProducts");
const RecentProducts = isThereRecentProduct
  ? JSON.parse(window.localStorage.getItem("RecentProducts"))
  : [];

const CartStorage = window.localStorage.getItem("CartStorage")
  ? JSON.parse(window.localStorage.getItem("CartStorage"))
  : [];

const initialValues = {
  menuItems: [],
  productStorage: null,
  UserHomeContents: [],
  categoryName: [],
  subCategoryName: [],
  RecentProducts: RecentProducts,
  CartStorage: [],
  Inventory_Page: [],
  Production_Page: [],
  Report_Page: null,
  Support_Page: [],
  Setting_Page: [],
  pathSettings: { prevPath: "/", currPath: "/" },
  isLoading: false,
  isError: false,
  isServerIssue: false,
  token: token,
  isAdmin: isValidToken && token === admin_token,
  isUserLoggedIn: isValidToken,
  AdminDashboardButtonState: window.localStorage.getItem('AdminDashboardButtonState') ? JSON.parse(window.localStorage.getItem('AdminDashboardButtonState')) : 1
};

const UseProvider = ({ children }) => {
  const [dataState, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    console.log("Provider runs...");
    const initializeData = async () => {
      dispatch({ type: "toggle_loading", payload: true });

      await AdminRenderApi(dispatch);
      if (dataState.isAdmin) {
        await Api_Inventory(dispatch);
        await Api_Production(dispatch);
        await Api_Report(dispatch);
        await Api_Support(dispatch);
        await Api_Setting(dispatch);
      } else {
        await GetMenuItems(dispatch);
        await User_Home(dispatch);
        await User_Products(dispatch);
        dispatch({ type: "initialize_cart", payload: CartStorage });
      }

      dispatch({ type: "toggle_loading", payload: false });
    };

    initializeData();
  }, [dataState.isAdmin]);

  return (
    <useData.Provider value={{ dataState, dispatch }}>
      {children}
    </useData.Provider>
  );
};

export default UseProvider;
