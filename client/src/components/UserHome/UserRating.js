import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CgNotes } from "react-icons/cg";
import { ImStarFull } from "react-icons/im";

import styles from '../../styles/HomePageStyles/Questions.module.css';
import { useData } from '../../context/useData';
import { Link } from 'react-router-dom';
import { GetDate } from '../../HOOKS/GetDate';

const UserRating = ({ setUserEntryState, ratings, QuestionAndReviewElement }) => {
    const { dataState } = useContext(useData);

    const [Ratings, setRatings] = useState([
        {
            name: 'Maynul Islam',
            date: '18 Sep 2024',
            review: 'I have a Dual Band router at my home, I want to purchase the TCL 40 SE, my question is does the smartphone support 5Ghz Wifi ?',
            rating: 4
        },
        {
            name: 'Aziz Ahmad Oli',
            date: '12 May 2024',
            review: 'Does this phone have a type-c charging port?',
            rating: 5
        }
    ]);
    const [RatingStars, setRatingStars] = useState([]);

    useEffect(() => {
        let Rating = [];
        for (let i = 0; i < 5; i++) {
            Rating.push(<ImStarFull className={styles.Stars} />);
        }
        setRatingStars(Rating);
    }, []);

    const GetAvgRating = useCallback(() => {
        if (ratings.length === 0) return 0;

        let sum = ratings.reduce((a, c) => a + Number(c.rating), 0);
        return Math.floor(sum / ratings.length);
    }, [ratings]);

    return (
        <section className={styles.MainQuestion}>
            <div className={styles.Upper}>
                <section>
                    <div>
                        <span className={styles.Question}>Reviews {'('}{ratings.length}{')'}</span>
                        <span className={styles.QuestionText}>Get specific details about this product from customers who own it.</span>
                        <span className={styles.AvgRating}>{RatingStars.map((stars, i) => i < GetAvgRating() ? stars : null)}{GetAvgRating()} out of 5</span>
                    </div>
                    {
                        !dataState.isAdmin && !dataState.isUserLoggedIn
                            ? <button className={styles.AskButton} onClick={() => setUserEntryState(1)}>Write a Review</button>
                            : <Link to={`/user/rating/${QuestionAndReviewElement.product_name}/${QuestionAndReviewElement.product_id}`}><button className={styles.AskButton}>Write a Review</button></Link>
                    }

                </section>
                <hr></hr>
            </div>

            <div className={styles.Lower}>
                {
                    ratings && ratings.length === 0 ? <div className={styles.LogoAndText}>
                        <span className={styles.Logo}><CgNotes className={styles.innerLogo} /></span>
                        <span className={styles.q_text}>This product has no reviews yet. Be the first one to write a review.</span>
                    </div>
                        : <div className={styles.AllMainQuestions}>
                            {
                                ratings.map((rating) => {
                                    return <>
                                        <div className={styles.AllQuestions}>
                                            <span className={styles.UserRating}>{RatingStars.map((stars, i) => i < rating.rating ? stars : null)}</span>
                                            <span className={styles.answerText}>{rating.review}</span>
                                            <span className={styles.Date}>By <span className={styles.question_name}>{rating.fname} {rating.lname}</span> on {GetDate(rating.rating_date)}</span>
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

export default UserRating