import React, { useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/pageseven.userquestion.module.css';
import { IoSearchSharp } from "react-icons/io5";
import UserQuestionsData from '../../UserQuestionsData.json';
import Pagination from '../../HOOKS/Pagination';

const UserQuestions = () => {
    const [Questions, setQuestions] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(UserQuestionsData);


    useEffect(() => {
        setQuestions(UserQuestionsData);
    }, []);

    const [showAnswerBox, setShowAnswerBox] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answer, setAnswer] = useState('');

    const handleSend = (question) => {
        setCurrentQuestion(question);
        setShowAnswerBox(true);
    };

    const handleDelete = (userId) => {
        const updatedQuestions = Questions.filter(question => question.userId !== userId);
        setQuestions(updatedQuestions);
    };

    const handleSendAnswer = () => {
        // alert(`Answer to question: ${currentQuestion.userQuestion}, Answer: ${answer}`);
        setShowAnswerBox(false);
        setAnswer('');
    };

    const handleFilteredData = (data)=>{
        setFilteredProducts((prev)=> data);
      }
    
    return (
        <section id={styles.UserSupportQuestionContainer}>
            <section id={styles.QuestionSearchAndSort}>
                <div id={styles.UserQuestionSearchBar}>
                    <span><IoSearchSharp /></span>
                    <input type='text' id={styles.UserQuestionInput} placeholder='Search...'></input>
                </div>
                <div id={styles.UserQuestionSortBar}>
                    <span>Sort By</span>
                    <select>
                        <option value="">none</option>
                        <option>ID</option>
                        <option>Name</option>
                        <option>Date</option>
                    </select>
                </div>
            </section>

            <section id={styles.QuestionTableSection}>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Product ID</th>
                            <th>Product Category</th>
                            <th>User Question</th>
                            <th>Question Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((question, index) => (
                            <tr key={index}>
                                <td>{question.userId}</td>
                                <td>{question.userName}</td>
                                <td>{question.userEmail}</td>
                                <td>{question.productId}</td>
                                <td>{question.productCategory}</td>
                                <td>{question.userQuestion}</td>
                                <td>{new Date(question.questionTime).toLocaleString()}</td>
                                <td id={styles.buttonStyle}>
                                    <button onClick={() => handleSend(question)}>Answer</button>
                                    <button onClick={() => handleDelete(question.userId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showAnswerBox && (
                    <div className={styles.answerBox}>
                        <h3>Send Answer</h3>
                        <p>{currentQuestion.userQuestion}</p>
                        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
                        <button onClick={handleSendAnswer}>Send</button>
                        <button onClick={() => setShowAnswerBox(false)}>Cancel</button>
                    </div>
                )}
            </section>


            <Pagination productsData={UserQuestionsData} handleFilteredData={handleFilteredData} />

        </section>
    )
}

export default UserQuestions;
