import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../layout/Footer';
import NavBar from '../layout/NavBar';
import TopNav from '../layout/TopNav';
import LoadingPage from '../pages/LoadingPage';


const UserHomePage = lazy(() => import('../pages/UserHome/UserHomePage'));
const UserSignIn = lazy(() => import('../components/UserHome/UserSignIn'));
const UserLogIn = lazy(() => import('../components/UserHome/UserLogIn'));
const ForgotPass = lazy(() => import('../components/UserHome/ForgotPass'));
const GroupProducts = lazy(() => import('../pages/UserHome/GroupProducts'));
const RandomErrorPage = lazy(() => import('../pages/RandomErrorPage'));
const ViewProduct = lazy(() => import('../pages/UserHome/ViewProduct'));
const RatingForm = lazy(() => import('../components/UserHome/RatingForm'));
const QuestionForm = lazy(() => import('../components/UserHome/QuestionForm'));
const Account = lazy(() => import('../pages/UserHome/Account'));
const Carts = lazy(() => import('../pages/UserHome/Carts'));
const PreOrder = lazy(() => import('../pages/UserHome/PreOrder'));

const UserHomeRoutes = () => {
    const location = useLocation();
    console.log('Current path ' + location.pathname);

    const [userEntryPageState, setUserEntryState] = useState(0);

    const handleUserEntryPage = useCallback((newEntryPageNo) => {
        setUserEntryState(newEntryPageNo);
    }, []);

  


    const renderUserEntryPage = () => {
        switch (userEntryPageState) {
            case 1:
                return <UserSignIn handleUserEntryPage={handleUserEntryPage} />;
            case 2:
                return <UserLogIn handleUserEntryPage={handleUserEntryPage} />;
            case 4:
                return <ForgotPass handleUserEntryPage={handleUserEntryPage} />;
            default:
                return null;
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <NavBar handleUserEntryPage={handleUserEntryPage} />
            <TopNav />

            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route path='/' element={<UserHomePage />} />

                    <Route path='/products/:main-category' element={<GroupProducts />} />
                    <Route path='/products/:category/:sub-category' element={<GroupProducts />} />

                    <Route path='/view/:category/:product-id' element={<ViewProduct setUserEntryState={setUserEntryState} />} />

                    <Route path='/user/rating/:product-name/:product-id' element={<RatingForm />} />
                    <Route path='/user/question/:product-name/:product-id' element={<QuestionForm />} />

                    <Route path='/user/account' element={<Account />} />
                    <Route path='/user/cart' element={<Carts />} />
                    <Route path='/pre-order' element={<PreOrder setUserEntryState={setUserEntryState} />} />

                    <Route path="*" element={<RandomErrorPage />} />
                </Routes>
            </Suspense>

            <Footer />

            {renderUserEntryPage()}
        </div>
    );
};

export default React.memo(UserHomeRoutes);
