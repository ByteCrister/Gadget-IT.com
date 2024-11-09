import React, { useState } from 'react'

import styles from '../../styles/AdminHome/PageEight.module.css';
import CreateNewOffer from './CreateNewOffer';
import SelectOfferProducts from './SelectOfferProducts';


const ManageOffers = () => {
  const [offerBtnState, setOfferBtnState] = useState(1);

  return (
    <section className={styles.settingMain}>

      <section className={styles.settingStates}>
        <div className={offerBtnState === 1 ? styles.active_setting_button : styles.setting_button} onClick={() => setOfferBtnState(1)}>
          Create New Offer
        </div>
        <div className={offerBtnState === 2 ? styles.active_setting_button : styles.setting_button} onClick={() => setOfferBtnState(2)}>
          Select Offer Products
        </div>
      </section>

      {offerBtnState === 1 ? <CreateNewOffer /> : <SelectOfferProducts />}
    </section>
  )
}

export default React.memo(ManageOffers);