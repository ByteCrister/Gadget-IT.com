import React, { useState, lazy, Suspense } from 'react';
import styles from '../../styles/AdminHome/admin.home.module.css';

import UpperSide from '../../components/AdminHome/UpperSide';
import LeftSide from '../../components/AdminHome/LeftSide';
import LoadingPage from '../LoadingPage';

// Lazy load components
const PageOne = lazy(() => import('../ADMIN/PageOne'));
const PageTwo = lazy(() => import('../ADMIN/PageTwo'));
const PageThree = lazy(() => import('../ADMIN/PageThree'));
const PageFour = lazy(() => import('../ADMIN/PageFour'));
const PageFive = lazy(() => import('../ADMIN/PageFive'));
const PageSix = lazy(() => import('../ADMIN/PageSix'));
const PageSeven = lazy(() => import('../ADMIN/PageSeven'));
const PageEight = lazy(() => import('../ADMIN/PageEight'));

const ShowMessages = lazy(() => import('../../components/AdminHome/ShowMessages'));
const ShowNotifications = lazy(() => import('../../components/AdminHome/ShowNotifications'));
const ShowAdmin = lazy(() => import('../../components/AdminHome/ShowAdmin'));

const AdminHomePage = () => {
    const [currentPageNo, setCurrentPage] = useState(1);
    const [upperContentNo, setUpperContent] = useState(0);

    const handlePage = (newPage) => setCurrentPage(newPage);
    const handleUpper = (newUpper) => setUpperContent(newUpper);

    const pages = {
        1: <PageOne />,
        2: <PageTwo />,
        3: <PageThree />,
        4: <PageFour />,
        5: <PageFive />,
        6: <PageSix />,
        7: <PageSeven />,
        8: <PageEight />
    };

    const upperContent = {
        1: <ShowMessages content={upperContentNo} handleUpper={handleUpper} />,
        2: <ShowNotifications handlePage={handlePage} content={upperContentNo} handleUpper={handleUpper} />,
        3: <ShowAdmin content={upperContentNo} handleUpper={handleUpper} />
    };

    return (
        <div className={styles.adminMainContainer}>
            <div className={styles.outerLeft}>
                <div className={styles.leftSide}>
                    <LeftSide page={currentPageNo} handlePage={handlePage} />
                </div>
                <div className={styles.innerLeft}></div>
            </div>

            <div className={styles.uppAndMain}>
                <UpperSide content={upperContentNo} handleUpper={handleUpper} />

                <div style={{ width: '100%', position: 'relative' }}>
                    <Suspense fallback={<LoadingPage />}>
                        {pages[currentPageNo]}
                        {upperContent[upperContentNo] || null}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
