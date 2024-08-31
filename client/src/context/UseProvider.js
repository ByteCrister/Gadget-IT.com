import React, { useEffect, useReducer, useState } from 'react';
import reducer from './reducer';
import { useData } from './useData';
import { GetMenuItems } from '../api/GetMenuItems';
import { AdminRenderApi } from '../api/AdminRenderApi';
import { Api_Inventory } from '../api/Api_Inventory';
import { Api_Production } from '../api/Api_Production';
import { Api_Setting } from '../api/Api_Setting';
import { User_Home } from '../api/User_Home';
import { User_Products } from '../api/User_Products';

const initialValues = {
  menuItems: [],

  productStorage: null,
  UserHomeContents: [],

  categoryName: [],
  subCategoryName: [],

  Inventory_Page: [],
  Production_Page: [],
  Setting_Page: [],


  pathSettings: { prevPath: '/', currPath: '/' },


  isLoading: false,
  isError: false,
  isAdmin: JSON.parse(window.localStorage.getItem('_isAdmin')) || false,
  UserID: JSON.parse(window.localStorage.getItem('_userId')) || false,
  isUserLoggedIn: JSON.parse(window.localStorage.getItem('_isUserLoggedIn')) || false
};

const UseProvider = ({ children }) => {
  const [dataState, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    const initializeData = async () => {
      dispatch({ type: 'toggle_loading', payload: true });

      await AdminRenderApi(dispatch);
      if (dataState.isAdmin) {
        await Api_Inventory(dispatch);
        await Api_Production(dispatch);
        await Api_Setting(dispatch);

      } else {
        await GetMenuItems(dispatch);
        await User_Home(dispatch);
        await User_Products(dispatch);
      }

      dispatch({ type: 'toggle_loading', payload: false });
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
