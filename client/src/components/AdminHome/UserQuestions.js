import React, { useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/pageseven.userquestion.module.css';
import { IoSearchSharp } from "react-icons/io5";
import UserQuestionsData from '../../UserQuestionsData.json';

const UserQuestions = () => {
    const [Questions, setQuestions] = useState([]);

    const itemsPerPage = 7;
    const getVisiblePages = 3;
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setQuestions(UserQuestionsData);
        setTotalPages(Math.ceil(UserQuestionsData.length / itemsPerPage));
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
        setTotalPages(Math.ceil(updatedQuestions.length / itemsPerPage));
        if (currentPage >= Math.ceil(updatedQuestions.length / itemsPerPage)) {
            setCurrentPage(Math.max(currentPage - 1, 0));
        }
    };

    const handleSendAnswer = () => {
        alert(`Answer to question: ${currentQuestion.userQuestion}, Answer: ${answer}`);
        setShowAnswerBox(false);
        setAnswer('');
    };

    const paginateData = () => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return Questions.slice(startIndex, endIndex);
    };

    const handleCurrentPage = (index) => {
        setCurrentPage(index);
    };

    const handlePrevNext = (action) => {
        if (action === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (action === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(0);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages - 1);
    };

    const startPage = Math.floor(currentPage / getVisiblePages) * getVisiblePages;
    const endPage = Math.min(totalPages, startPage + getVisiblePages);

    const filteredQuestions = paginateData();

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
                        {filteredQuestions.map((question, index) => (
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




            <div className={styles.pagination}>
                <button className={styles.firstLast} disabled={currentPage === 0} onClick={handleFirstPage}>{'<'}</button>
                <button className={styles.previous} disabled={currentPage === 0} onClick={() => handlePrevNext('prev')}>Previous</button>
                {Array.from({ length: endPage - startPage }, (_, index) => {
                    const pageIndex = startPage + index;
                    return (
                        <button
                            key={pageIndex}
                            className={pageIndex === currentPage ? styles.active : styles.pageButton}
                            onClick={() => handleCurrentPage(pageIndex)}
                        >
                            {pageIndex + 1}
                        </button>
                    );
                })}
                <button className={styles.next} disabled={currentPage === totalPages - 1} onClick={() => handlePrevNext('next')}>Next</button>
                <button className={styles.firstLast} disabled={currentPage === totalPages - 1} onClick={handleLastPage}>{'>'}</button>
            </div>

        </section>
    )
}

export default UserQuestions;
