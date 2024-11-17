import React, { useState } from 'react'

import styles from '../../styles/AdminHome/PageEight.module.css';

import AdvertisementImages from '../../components/AdminHome/AdvertisementImages';
import FeaturedCategoryICON from '../../components/AdminHome/FeaturedCategoryICON';
import SelectHomeProducts from '../../components/AdminHome/SelectHomeProducts';
import HomeViewDescriptions from '../../components/AdminHome/HomeViewDescriptions';
import ManageOffers from '../../components/AdminHome/ManageOffers';

const PageEight = React.memo(() => {

  const [currentSetting, setCurrentSetting] = useState(1);


  return (
    <div>
      <section className={styles.settingMain}>

        <section className={styles.settingStates}>
          <div className={currentSetting === 1 ? styles.active_setting_button : styles.setting_button} onClick={() => setCurrentSetting(1)}>
            Advertisement Images
          </div>
          <div className={currentSetting === 2 ? styles.active_setting_button : styles.setting_button} onClick={() => setCurrentSetting(2)}>
            Featured Category ICON
          </div>
          <div className={currentSetting === 3 ? styles.active_setting_button : styles.setting_button} onClick={() => setCurrentSetting(3)}>
            Select Home Products
          </div>
          <div className={currentSetting === 4 ? styles.active_setting_button : styles.setting_button} onClick={() => setCurrentSetting(4)}>
            Home View Descriptions
          </div>
          <div className={currentSetting === 5 ? styles.active_setting_button : styles.setting_button} onClick={() => setCurrentSetting(5)}>
            Manage Offers
          </div>
        </section>

        {
          currentSetting === 1 ? <AdvertisementImages /> :
            currentSetting === 2 ? <FeaturedCategoryICON /> :
              currentSetting === 3 ? <SelectHomeProducts /> :
                currentSetting === 4 ? <HomeViewDescriptions /> :
                  <ManageOffers />
        }

      </section>
    </div>
  )
}
)

export default React.memo(PageEight);