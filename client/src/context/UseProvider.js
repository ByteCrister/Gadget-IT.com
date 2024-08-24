import React, { useEffect, useReducer, useState } from 'react';
import reducer from './reducer';
import { useData } from './useData';
import { GetMenuItems } from '../api/GetMenuItems';
import { AdminRenderApi } from '../api/AdminRenderApi';
import { Api_Inventory } from '../api/Api_Inventory';
import { Api_Production } from '../api/Api_Production';
import { Api_Setting } from '../api/Api_Setting';

const initialValues = {
  menuItems: [],
  productStorage: [],
  filteredProductStorage: [],
  categoryName: [],
  subCategoryName: [],

  Inventory_Page: [],
  Production_Page: [],
  Setting_Page : [],

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

      if (dataState.isAdmin) {
        await AdminRenderApi(dispatch);

        await Api_Inventory(dispatch);
        await Api_Production(dispatch);
        await Api_Setting(dispatch);

      } else {
        await GetMenuItems(dispatch);
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
