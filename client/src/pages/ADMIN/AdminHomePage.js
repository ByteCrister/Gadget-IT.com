import React, { useState } from 'react';
import styles from '../../styles/AdminHome/admin.home.module.css';

import UpperSide from '../../components/AdminHome/UpperSide';
import LeftSide from '../../components/AdminHome/LeftSide';

import PageOne from '../ADMIN/PageOne';
import PageTwo from '../ADMIN/PageTwo';
import PageThree from '../ADMIN/PageThree';
import PageFour from '../ADMIN/PageFour';
import PageFive from '../ADMIN/PageFive';
import PageSix from '../ADMIN/PageSix';
import PageSeven from '../ADMIN/PageSeven';
import PageEight from '../ADMIN/PageEight';

import ShowMessages from '../../components/AdminHome/ShowMessages';
import ShowNotifications from '../../components/AdminHome/ShowNotifications';
import ShowAdmin from '../../components/AdminHome/ShowAdmin';

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
            <div className={styles.leftSide}>
                <LeftSide page={currentPageNo} handlePage={handlePage} />
            </div>

            <div className={styles.uppAndMain}>
                <UpperSide content={upperContentNo} handleUpper={handleUpper} />
                <div style={{ width: '100%', position: 'relative' }}>
                    {pages[currentPageNo]}
                    {upperContent[upperContentNo] || null}
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
