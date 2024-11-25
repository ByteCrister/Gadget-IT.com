import React from 'react'
import { Route, Routes } from "react-router-dom";
import AdminHomePage from '../pages/ADMIN/AdminHomePage';

const AdminRoutes = () => {
    console.log('entered in to AdminRoutes');
    return (
        <Routes>
            <Route path='/' element={<AdminHomePage />} />
        </Routes>
    )
}

export default React.memo(AdminRoutes);