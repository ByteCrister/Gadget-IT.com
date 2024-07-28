import React, { useState } from 'react';

import styles from '../../styles/AdminHome/admin.home.module.css';

import UpperSide from '../../components/AdminHome/UpperSide';
import LeftSide from '../../components/AdminHome/LeftSide';

import PageOne from '../ADMIN/PageOne'
import PageTwo from '../ADMIN/PageTwo'
import PageThree from '../ADMIN/PageThree'
import PageFour from '../ADMIN/PageFour'
import PageFive from '../ADMIN/PageFive'
import PageSix from '../ADMIN/PageSix'
import PageSeven from '../ADMIN/PageSeven'
import PageEight from '../ADMIN/PageEight'

import ShowMessages from '../../components/AdminHome/ShowMessages'
import ShowNotifications from '../../components/AdminHome/ShowNotifications'
import ShowAdmin from '../../components/AdminHome/ShowAdmin';

const AdminHomePage = () => {
    const [currentPageNo, setCurrentPage] = useState(2);
    const [upperContentNo, setUpperContent] = useState(0);

    const handlePage = (newPage) => {
        setCurrentPage(newPage);
    }
    const handleUpper = (newUpper) => {
        setUpperContent(newUpper)
    }
    const object1 = {
        page: currentPageNo,
        handlePage
    }
    const oject2 = {
        content: upperContentNo,
        handleUpper

    }

    return (
        <div className={styles.adminMainContainer}>
            <div className={styles.leftSide}>
                <LeftSide  {...object1} />
            </div>

            <div className={styles.uppAndMain}>
                <UpperSide {...oject2} />

                <div style={{width:'100%', position:'relative'}}>
                    {
                        currentPageNo === 1 ? <PageOne />
                            : currentPageNo === 2 ? <PageTwo />
                                : currentPageNo === 3 ? <PageThree />
                                    : currentPageNo === 4 ? <PageFour />
                                        : currentPageNo === 5 ? <PageFive />
                                            : currentPageNo === 6 ? <PageSix />
                                                : currentPageNo === 7 ? <PageSeven />
                                                    : <PageEight />
                    }

                    {
                        upperContentNo === 1 ? <ShowMessages {...oject2} /> : upperContentNo === 2 ? <ShowNotifications handlePage={handlePage} {...oject2}  /> : upperContentNo === 3 ? <ShowAdmin {...oject2}  /> : null
                    }

                </div>


            </div>
        </div>
    );
}

export default AdminHomePage;
