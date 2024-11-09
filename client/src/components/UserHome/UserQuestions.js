import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { RiMessage2Line } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/HomePageStyles/Questions.module.css';
import { useData } from '../../context/useData';
import { GetDate } from '../../HOOKS/GetDate';

const UserQuestions = ({ setUserEntryState, askedQuestion, QuestionAndReviewElement, questionRef }) => {
    const { dataState } = useContext(useData);
    return (
        <section className={styles.MainQuestion} ref={questionRef}>
            <div className={styles.Upper}>
                <section>
                    <div>
                        <span className={styles.Question}>Questions {'('}{askedQuestion.length}{')'}</span>
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
                    askedQuestion && askedQuestion.length === 0 ? <div className={styles.LogoAndText}>
                        <span className={styles.Logo}><RiMessage2Line className={styles.innerLogo} /></span>
                        <span className={styles.q_text}>There are no questions asked yet. Be the first one to ask a question.</span>
                    </div>
                        : <div className={styles.AllMainQuestions}>
                            {
                                askedQuestion.map((question) => {
                                    return <>
                                        <div key={uuidv4()} className={styles.AllQuestions}>
                                            <span className={styles.Date}><span className={styles.question_name}>{question.fname} {question.lname}</span> on {GetDate(question.question_date)}</span>
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