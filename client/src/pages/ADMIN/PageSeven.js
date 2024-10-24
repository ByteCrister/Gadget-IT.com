import React, { useState } from 'react'
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { GiVibratingShield } from "react-icons/gi";
import UserQuestions from '../../components/AdminHome/UserQuestions';
import styles from '../../styles/AdminHome/PageSeven.module.css';
import UserRating from '../../components/AdminHome/UserRating';



const PageSeven = () => {
  const [activeButton, setButtonActive] = useState(1);

  return (
    <section id={styles.mainSection}>
      <span id={styles.text}>
        {activeButton === 1 ? 'Support' : 'Rating'}
      </span>

      <section id={styles.ButtonSections}>
        <button className={activeButton === 1 ? styles.activeSupportButton : styles.supportButton} onClick={() => { setButtonActive(1) }}> <span><BsFillQuestionSquareFill /></span><span>User Question's</span></button>
        <button className={activeButton === 2 ? styles.activeSupportButton : styles.supportButton} onClick={() => { setButtonActive(2) }}> <span><GiVibratingShield /></span><span>User Rating's</span></button>
      </section>

      <section id={styles.PageSevenTables}>
        {activeButton === 1 ? <UserQuestions /> : <UserRating />}
      </section>

    </section>
  )
}

export default React.memo(PageSeven);