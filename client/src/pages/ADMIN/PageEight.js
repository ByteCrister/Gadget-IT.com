import React, { useCallback, useContext, useState } from 'react'

import styles from '../../styles/AdminHome/PageEight.module.css';

import { useData } from '../../context/useData'
import AdvertisementImages from '../../components/AdminHome/AdvertisementImages';
import FeaturedCategoryICON from '../../components/AdminHome/FeaturedCategoryICON';
import SelectHomeProducts from '../../components/AdminHome/SelectHomeProducts';
import HomeViewDescriptions from '../../components/AdminHome/HomeViewDescriptions';
import { Reset_HomeState } from '../../api/Reset_HomeState';

const PageEight = React.memo(() => {
  const { dataState, dispatch } = useContext(useData);

  const [currentSetting, setCurrentSetting] = useState(1);


  // *---------------- Admin LogOut ------------------------
  const handleLogout = useCallback(async () => {
    await Reset_HomeState(dispatch);
  }, [dispatch]);

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
        </section>

        {
          currentSetting === 1 ? <AdvertisementImages /> :
            currentSetting === 2 ? <FeaturedCategoryICON /> :
              currentSetting === 3 ? <SelectHomeProducts /> :
                <HomeViewDescriptions />
        }

      </section>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}
)

export default PageEight