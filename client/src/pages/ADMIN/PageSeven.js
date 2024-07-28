import React, { useState } from 'react'
import styles from '../../styles/AdminHome/PageSeven.module.css';
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { GiVibratingShield } from "react-icons/gi";
import UserQuestions from '../../components/AdminHome/UserQuestions';



const PageSeven = () => {
  const [buttonActive, setButtonActive] = useState(1);

  return (
    <section id={styles.mainSection}>
      <span id={styles.text}>
        Support
      </span>

      <section id={styles.ButtonSections}>
        <button style={buttonActive === 1 ? { border: '5px solid #c6c6c6' } : null} onClick={() => { setButtonActive(1) }}> <span><BsFillQuestionSquareFill /></span><span>User Question's</span></button>
        <button style={buttonActive === 2 ? { border: '5px solid #c6c6c6' } : null} onClick={() => { setButtonActive(2) }}> <span><GiVibratingShield /></span><span>User Rating's</span></button>
      </section>

      <section id={styles.PageSevenTables}>
        {
          buttonActive === 1 ?
            <UserQuestions />
            :
            ''
        }

      </section>

    </section>
  )
}

export default PageSeven