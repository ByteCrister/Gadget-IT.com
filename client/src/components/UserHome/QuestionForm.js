import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../../styles/HomePageStyles/Questions.module.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../../context/useData';
import ServerIssuePage from '../../pages/ServerIssuePage';

const QuestionForm = () => {
  const { dataState, dispatch } = useContext(useData);
  const { 'product-id': product_id, 'product-name': product_name } = useParams();
  const [email, setEmail] = useState('');
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

  return (
    dataState.isServerIssue === true
      ? <ServerIssuePage />
      : <section className={styles.MainQuestionForm} id='OuterForm'>
        <form>
          <span className={styles.AskQuestionTest}>Ask Question</span>
          <section>
            <div>
              <span>Product</span>
              <input type='text' value={product_name} disabled></input>
            </div>
            <div>
              <span>Your E-Mail<sup>*</sup></span>
              <input type='email' ref={UserEmail} value={email}></input>
            </div>
            <div>
              <span>Your Question<sup>*</sup></span>
              <textarea name="description" rows="5" cols="50" placeholder="Your Question" ref={UserQuestion}></textarea>
            </div>
          </section>
          <section className={styles.FormButtonSection}>
            <button className={styles.SubmitBtn}>Submit</button>
            <Link to={dataState.pathSettings.currPath}><button className={styles.BackBtn}>Back</button></Link>
          </section>
        </form>
      </section>
  )
}

export default QuestionForm