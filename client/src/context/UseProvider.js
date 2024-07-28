import React, { useEffect, useReducer } from 'react';
import reducer from './reducer';
import { useData } from './useData';
import { GetMenuItems } from '../api/GetMenuItems';
import { AdminRenderApi } from '../api/AdminRenderApi';


const initialValues = {
  menuItems: [],
  productStorage: [],
  filteredProductStorage: [],
  categoryName: [],
  subCategoryName: [],
  isLoading: false,
  isError: false,
  isAdmin: JSON.parse(window.localStorage.getItem('_isAdmin')) || false,
  UserID: JSON.parse(window.localStorage.getItem('_userId')) || false,
  isUserLoggedIn: JSON.parse(window.localStorage.getItem('_isUserLoggedIn')) || false
};

const UseProvider = ({ children }) => {
  const [dataState, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    const getMenuItems = async () => {
      await GetMenuItems(dispatch);
      await AdminRenderApi(dispatch);
    }
    getMenuItems();
  }, []);


  return (
    <useData.Provider value={{ dataState, dispatch }}>
      {children}
    </useData.Provider>
  );
};

export default UseProvider;
