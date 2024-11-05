import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../layout/Footer';
import NavBar from '../layout/NavBar';
import TopNav from '../layout/TopNav';
import LoadingPage from '../pages/LoadingPage';
import styles from '../styles/HomePageStyles/UserHomeRoutePage.module.css';
import OrdersPage from '../components/UserHome/Account/OrdersPage';
import UserOrderPaymentPage from '../components/UserHome/Account/UserOrderPaymentPage';

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
const Offers = lazy(() => import('../pages/UserHome/Offers'));
const OfferCartProducts = lazy(() => import('../pages/UserHome/OfferCartProducts'));
const EasyCheckout = lazy(() => import('../pages/UserHome/EasyCheckout'));

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
        <div style={{ position: 'relative', width: '100%' }}>
            <section style={{ width: '100%' }}>
                <div style={{ position: 'fixed', width: '100%', zIndex: 999 }}>
                    <NavBar handleUserEntryPage={handleUserEntryPage} />
                    <TopNav />
                </div>
            </section>
            <div className={styles.AllRouteDiv}>
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
                        <Route path='/offers' element={<Offers />} />
                        <Route path='/offers/:title' element={<OfferCartProducts />} />
                        <Route path='/easy-checkout' element={<EasyCheckout />} />
                        <Route path='/user-orders-page' element={<OrdersPage />}/>
                        <Route path='/user-orders-payment-page' element={<UserOrderPaymentPage />}/>

                        <Route path="*" element={<RandomErrorPage />} />
                    </Routes>
                </Suspense>
            </div>

            <Footer />

            {renderUserEntryPage()}
        </div>
    );
};

export default React.memo(UserHomeRoutes);
