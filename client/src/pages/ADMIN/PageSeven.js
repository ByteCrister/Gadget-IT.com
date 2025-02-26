import React, { useState } from 'react'
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { GiVibratingShield } from "react-icons/gi";
import { MdLocalGroceryStore } from "react-icons/md";

import UserQuestions from '../../components/AdminHome/UserQuestions';
import styles from '../../styles/AdminHome/PageSeven.module.css';
import UserRating from '../../components/AdminHome/UserRating';
import UserPreOrder from '../../components/AdminHome/UserPreOrder';

const QuestionStateBtn = [
  {
    title: "User Question's",
    icon: <BsFillQuestionSquareFill />
  },
  {
    title: "User Rating's",
    icon: <GiVibratingShield />
  },
  {
    title: "User Pre Orders",
    icon: <MdLocalGroceryStore />
  },
];

const PageSeven = () => {
  const [activeButton, setButtonActive] = useState(1);

  return (
    <section id={styles.mainSection}>
      <span id={styles.text}>
        {activeButton === 1 ? 'Support' : activeButton === 2 ? 'Rating' : 'Pre Order'}
      </span>

      <section id={styles.ButtonSections}>
        {
          QuestionStateBtn.map((item, index) => {
            return <button
              className={activeButton === index + 1 ? styles.activeSupportButton : styles.supportButton}
              onClick={() => { setButtonActive(index + 1) }}>
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </button>
          })
        }
      </section>

      <section id={styles.PageSevenTables}>
        {activeButton === 1 ? <UserQuestions /> : activeButton === 2 ? <UserRating /> : <UserPreOrder />}
      </section>

    </section>
  )
}

export default React.memo(PageSeven);