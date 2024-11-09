import React, { useState } from 'react'
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { GiVibratingShield } from "react-icons/gi";
import { MdLocalGroceryStore } from "react-icons/md";

import UserQuestions from '../../components/AdminHome/UserQuestions';
import styles from '../../styles/AdminHome/PageSeven.module.css';
import UserRating from '../../components/AdminHome/UserRating';
import UserPreOrder from '../../components/AdminHome/UserPreOrder';



const PageSeven = () => {
  const [activeButton, setButtonActive] = useState(1);

  return (
    <section id={styles.mainSection}>
      <span id={styles.text}>
        {activeButton === 1 ? 'Support' : activeButton === 2 ? 'Rating' : 'Pre Order'}
      </span>

      <section id={styles.ButtonSections}>
        <button className={activeButton === 1 ? styles.activeSupportButton : styles.supportButton} onClick={() => { setButtonActive(1) }}> <span><BsFillQuestionSquareFill /></span><span>User Question's</span></button>
        <button className={activeButton === 2 ? styles.activeSupportButton : styles.supportButton} onClick={() => { setButtonActive(2) }}> <span><GiVibratingShield /></span><span>User Rating's</span></button>
        <button className={activeButton === 3 ? styles.activeSupportButton : styles.supportButton} onClick={() => { setButtonActive(3) }}> <span><MdLocalGroceryStore /></span><span>User Pre Orders</span></button>
      </section>

      <section id={styles.PageSevenTables}>
        {activeButton === 1 ? <UserQuestions /> : activeButton === 2 ? <UserRating /> : <UserPreOrder />}
      </section>

    </section>
  )
}

export default React.memo(PageSeven);