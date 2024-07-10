import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHomePage from '../pages/UserHomePage';
const UserHomeRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<UserHomePage />} />
        </Routes>
    )
}

export default UserHomeRoutes