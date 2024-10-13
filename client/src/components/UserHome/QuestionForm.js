import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from '../../styles/HomePageStyles/Questions.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../../context/useData';
import ServerIssuePage from '../../pages/ServerIssuePage';

const QuestionForm = () => {
  const { dataState, dispatch } = useContext(useData);
  const { 'product-id': product_id, 'product-name': product_name } = useParams();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const UserQuestion = useRef();
  const UserEmail = useRef();

  useEffect(() => {
    const GetEmail = async () => {
      try {
        const res = await axios.get('http://localhost:7000/get/user-email', {
          headers: {
            Authorization: dataState.token
          }
        })
        setEmail(res.data.email);
      } catch (error) {
        dispatch({ type: 'toggle_isServerIssue', payload: true });
        window.localStorage.removeItem('token');
        console.log(error)
      }
    }

    GetEmail();
  }, [dataState, dispatch]);

  const QuestionSubmitHandler = useCallback((e) => {
    e.preventDefault();
    if (UserQuestion.current.value.trim().length !== 0) {
      const PostQuestion = {
        product_id: product_id,
        question: UserQuestion.current.value,
        email: UserEmail.current.value
      }
      try {
        axios.post('http://localhost:7000/post-user-question', PostQuestion, {
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

  }, [product_id, dispatch]);

  return (
    dataState.isServerIssue === true
      ? <ServerIssuePage />
      : <section className={styles.MainQuestionForm} id='OuterForm'>
        <form onSubmit={QuestionSubmitHandler}>
          <span className={styles.AskQuestionTest}>Ask Question</span>
          <section>
            <div>
              <span>Product</span>
              <input type='text' value={product_name} disabled></input>
            </div>
            <div>
              <span>Your E-Mail<sup>*</sup></span>
              <input type='email' ref={UserEmail} value={email} required></input>
            </div>
            <div>
              <span>Your Question<sup>*</sup></span>
              <textarea name="description" rows="5" cols="50" placeholder="Your Question" ref={UserQuestion} required></textarea>
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

export default QuestionForm