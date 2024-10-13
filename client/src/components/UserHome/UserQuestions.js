import React, { useContext, useState } from 'react'
import { RiMessage2Line } from "react-icons/ri";

import styles from '../../styles/HomePageStyles/Questions.module.css';
import { useData } from '../../context/useData';
import { Link } from 'react-router-dom';

const UserQuestions = ({ setUserEntryState, askedQuestion, QuestionAndReviewElement }) => {
    const { dataState } = useContext(useData);

    const [Questions, setQuestions] = useState([
        {
            name: 'Maynul Islam',
            date: '18 Sep 2024',
            question: 'I have a Dual Band router at my home, I want to purchase the TCL 40 SE, my question is does the smartphone support 5Ghz Wifi ?',
            answer: 'Yes sir TCL 40 SE Smartphone supports dual-band Wi-Fi connectivity, So both 2.4ghz and 5ghz band is supported in this TCL Smartphone'
        },
        {
            name: 'Aziz Ahmad Oli',
            date: '12 May 2024',
            question: 'Does this phone have a type-c charging port?',
            answer: 'Yes Sir, this TCL 40 SE Smartphone (6/256GB) comes with a USB Type-C 2.0 charging port.'
        }
    ])
    return (
        <section className={styles.MainQuestion}>
            <div className={styles.Upper}>
                <section>
                    <div>
                        <span className={styles.Question}>Questions {'('}{Questions.length}{')'}</span>
                        <span className={styles.QuestionText}>Have question about this product? Get specific details about this product from expert.</span>
                    </div>
                    {
                        !dataState.isAdmin && !dataState.isUserLoggedIn
                            ? <button className={styles.AskButton} onClick={() => setUserEntryState(1)}>Ask Question</button>
                            : <Link to={`/user/question/${QuestionAndReviewElement.product_name}/${QuestionAndReviewElement.product_id}`}><button className={styles.AskButton}>Ask Question</button></Link>
                    }

                </section>
                <hr></hr>
            </div>

            <div className={styles.Lower}>
                {
                    Questions && Questions.length === 0 ? <div className={styles.LogoAndText}>
                        <span className={styles.Logo}><RiMessage2Line className={styles.innerLogo} /></span>
                        <span className={styles.q_text}>There are no questions asked yet. Be the first one to ask a question.</span>
                    </div>
                        : <div className={styles.AllMainQuestions}>
                            {
                                Questions.map((question) => {
                                    return <>
                                        <div className={styles.AllQuestions}>
                                            <span className={styles.Date}><span className={styles.question_name}>{question.name}</span> on {question.date}</span>
                                            <span className={styles.questionText}>Q: {question.question}</span>
                                            <span className={styles.answerText}>A: {question.answer}</span>
                                        </div>
                                        <hr className={styles.questions_hr}></hr>
                                    </>
                                })
                            }
                        </div>
                }
            </div>
        </section>
    )
}

export default UserQuestions