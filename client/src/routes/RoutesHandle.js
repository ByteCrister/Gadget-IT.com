import React, { useContext } from 'react'
import { Routes, Route } from "react-router-dom";
import RouteErrorPage from "../pages/RouteErrorPage";
import RandomErrorPage from '../pages/RandomErrorPage'
import LoadingPage from '../pages/LoadingPage';
import AdminRoutes from '../routes/AdminRoutes';
import UserHomeRoutes from '../routes/UserHomeRoutes';
import { useData } from '../context/useData';


const RoutesHandle = () => {
  const { dataState, dispatch} = useContext(useData);
    const isAdmin = dataState;
    console.log(dispatch);


    const isError = false;
    const isLoading = false;


  return (
    isError ? <RandomErrorPage />
      :
      isLoading ? <LoadingPage />
        :
        <>
          <Routes>
            {isAdmin ? (
              <Route path="/*" element={<AdminRoutes />} />
            ) : (
              <Route path="/*" element={<UserHomeRoutes />} />
            )}
            <Route path="*" element={<RouteErrorPage />} />
          </Routes></>
  )
}

export default RoutesHandle