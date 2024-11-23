import React, { useState } from 'react'

import styles from '../../styles/AdminHome/PageEight.module.css';

import AdvertisementImages from '../../components/AdminHome/AdvertisementImages';
import FeaturedCategoryICON from '../../components/AdminHome/FeaturedCategoryICON';
import SelectHomeProducts from '../../components/AdminHome/SelectHomeProducts';
import HomeViewDescriptions from '../../components/AdminHome/HomeViewDescriptions';
import ManageOffers from '../../components/AdminHome/ManageOffers';
import ManageFooter from '../../components/AdminHome/ManageFooter';

const PageEight = React.memo(() => {

  const [settingPage, setSettingPage] = useState(1);

  const getComponentClass = (state) => {
    return settingPage === state ? styles.active_setting_button : styles.setting_button;
  };

  const Pages = {
    1: <AdvertisementImages />,
    2: <FeaturedCategoryICON />,
    3: <SelectHomeProducts />,
    4: <HomeViewDescriptions />,
    5: <ManageOffers />,
    6: <ManageFooter />
  };

  const renderButtons = () => {
    return ['Advertisement Images', 'Featured Category ICON', 'Select Home Products', 'Home View Descriptions', 'Manage Offers', 'Footer'].map((item, index) => {
      return <div className={getComponentClass(index + 1)} onClick={() => setSettingPage(index + 1)} key={index}>
        {item}
      </div>
    });
  };

  return (
    <div>
      <section className={styles.settingMain}>

        <section className={styles.settingStates}>
          {renderButtons()}
        </section>

        {Pages[settingPage]}

      </section>
    </div>
  )
}
)

export default React.memo(PageEight);