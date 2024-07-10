import React, { useReducer } from 'react';
import reducer from './reducer';
import {useData} from './useData';

const initialValues = {
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

    return (
        <useData.Provider value={{ dataState, dispatch }}>
            {children}
        </useData.Provider>
    );
};

export default UseProvider;
