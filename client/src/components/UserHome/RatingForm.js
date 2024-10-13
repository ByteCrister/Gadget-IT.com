import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import ServerIssuePage from '../../pages/ServerIssuePage';
import styles from '../../styles/HomePageStyles/Questions.module.css';
import { useData } from '../../context/useData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RatingForm = () => {
  const { dataState, dispatch } = useContext(useData);
  const { 'product-id': product_id, 'product-name': product_name } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState('5');
  const UserReview = useRef();

  useEffect(() => {
    const GetEmail = async () => {
      try {
        await axios.get('http://localhost:7000/get/user-email', {
          headers: {
            Authorization: dataState.token
          }
        })
      } catch (error) {
        dispatch({ type: 'toggle_isServerIssue', payload: true });
        window.localStorage.removeItem('token');
        console.log(error)
      }
    }

    GetEmail();
  }, [dataState, dispatch]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  }

  const handleRatingSubmit = useCallback((e) => {
    e.preventDefault();

    const RatingPayload = {
      product_id: product_id,
      rating: rating,
      UserReview: UserReview.current.value.trim()
    }
    if (RatingPayload.UserReview.length !== 0) {
      try {
        axios.post('http://localhost:7000/post-user-rating', RatingPayload, {
          headers: {
            Authorization: dataState.token
          }
        });

        navigate(dataState.pathSettings.currPath);
      } catch (error) {
        dispatch({ type: 'toggle_isServerIssue', payload: true });
        window.localStorage.removeItem('token');
        console.log(error);
      }
    }

  }, [dispatch, product_id, rating]);

  return (
    dataState.isServerIssue === true
      ? <ServerIssuePage />
      : <section className={styles.MainQuestionForm} id='OuterForm'>
        <form onSubmit={handleRatingSubmit}>
          <span className={styles.AskQuestionTest}>Write Review</span>
          <section>
            <div>
              <span>Product</span>
              <input type='text' value={product_name} disabled></input>
            </div>
            <div>
              <span>Rating<sup>*</sup></span>
              <div className={styles.RatingSection}>
                <span>Bad</span>
                <input
                  type="radio"
                  name="rating"
                  value="1"
                  checked={rating === '1'}
                  onChange={handleRatingChange}
                />
                <input
                  type="radio"
                  name="rating"
                  value="2"
                  checked={rating === '2'}
                  onChange={handleRatingChange}
                />
                <input
                  type="radio"
                  name="rating"
                  value="3"
                  checked={rating === '3'}
                  onChange={handleRatingChange}
                />
                <input
                  type="radio"
                  name="rating"
                  value="4"
                  checked={rating === '4'}
                  onChange={handleRatingChange}
                />
                <input
                  type="radio"
                  name="rating"
                  value="5"
                  checked={rating === '5'}
                  onChange={handleRatingChange}
                />
                <span>Good</span>
              </div>
            </div>
            <div>
              <span>Your Review<sup>*</sup></span>
              <textarea name="description" rows="5" cols="50" placeholder="Your Review" ref={UserReview} required></textarea>
            </div>
          </section>
          <section className={styles.FormButtonSection}>
            <button type='submit' className={styles.SubmitBtn}>Submit</button>
            <Link to={dataState.pathSettings.currPath}><button className={styles.BackBtn}>Back</button></Link>
          </section>
        </form>
      </section>
  )
}

export default RatingForm