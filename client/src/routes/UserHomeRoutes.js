import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import UserHomePage from '../pages/UserHome/UserHomePage';
import UserSignIn from '../components/UserHome/UserSignIn';
import UserLogIn from '../components/UserHome/UserLogIn';
import UserProfile from '../components/UserHome/UserProfile'
import Footer from '../layout/Footer';
import NavBar from '../layout/NavBar';
import TopNav from '../layout/TopNav';
import ForgotPass from '../components/UserHome/ForgotPass';
import GroupProducts from '../pages/UserHome/GroupProducts';

const UserHomeRoutes = () => {
    const location = useLocation();
    console.log('Current path ' + location.pathname);

    const [userEntryPageState, setUserEntryState] = useState(0);
    const handleUserEntryPage = (newEntryPageNo) => {
        setUserEntryState(newEntryPageNo);
    }
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <NavBar handleUserEntryPage={handleUserEntryPage} />
            <TopNav />

            <Routes>
                <Route path='/' element={<UserHomePage />} />
                <Route path='/products/*' element={<GroupProducts />} />
            </Routes>

            <Footer />
            {
                userEntryPageState === 1 ? <UserSignIn handleUserEntryPage={handleUserEntryPage} /> : userEntryPageState === 2 ? <UserLogIn handleUserEntryPage={handleUserEntryPage} /> : userEntryPageState === 3 ? <UserProfile handleUserEntryPage={handleUserEntryPage} /> : userEntryPageState === 4 ? <ForgotPass handleUserEntryPage={handleUserEntryPage} /> : null
            }
        </div>
    )
}

export default UserHomeRoutes