import React, { useEffect, useReducer } from 'react';
import reducer from './reducer';
import { useData } from './useData';
import { GetMenuItems } from '../api/GetMenuItems';


const initialValues = {
  menuItems: [],
  productStorage: [],
  filteredProductStorage: [],
  isLoading: false,
  isError: false,
  isAdmin: false,
  UserID: null,
  isUserLoggedIn: false
};

const UseProvider = ({ children }) => {
  const [dataState, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    const getMenuItems = async () => {
      await GetMenuItems(dispatch);
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
