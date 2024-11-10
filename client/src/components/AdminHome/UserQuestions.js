import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

import styles from '../../styles/AdminHome/pageseven.userquestion.module.css';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import Pagination from '../../HOOKS/Pagination';
import { useData } from '../../context/useData';
import { SearchQuestions } from '../../HOOKS/SearchQuestions';

const UserQuestions = () => {
    const { dataState, dispatch } = useContext(useData);

    const [Questions, setQuestions] = useState([]);
    const [SearchQuestion, setSearchQuestion] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [showAnswerBox, setShowAnswerBox] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const searchRef = useRef();

    const findCategory = (productId) => {
        return dataState.Production_Page.TableFullRows.find((product) => product.product_id === productId).main_category;
    }


    useEffect(() => {
        if (dataState?.Support_Page?.questions && dataState.Production_Page?.TableFullRows) {
            const updatedQuestions = dataState.Support_Page.questions.map((question) => {
                return { ...question, main_category: findCategory(question.product_id) };
            });
            setSearchQuestion(updatedQuestions);
            setQuestions(updatedQuestions);
            setFilteredProducts(updatedQuestions);
            dispatch({
                type: 'set_search_function',
                payload: {
                    function: SearchQuestions,
                    params: {
                        p_1: SearchQuestion,
                        p_2: setQuestions
                    }
                }
            });
        }
        // console.log(dataState.Production_Page.TableFullRows);
    }, [dataState.Support_Page.questions, dataState.Production_Page]);



    const handleSearch = (e) => {
        SearchQuestions(e.target.value, SearchQuestion, setQuestions);
    };

    const handleAnswer = (question) => {
        setAnswer(question.answer);
        setCurrentQuestion(question);
        setShowAnswerBox(true);
    };

    const handleDelete = async (questionNo) => {
        dispatch({ type: 'delete_answer', payload: questionNo });

        try {
            await axios.delete(`http//:localhost:7000/delete/answer/${questionNo}`);

        } catch (error) {
            console.log(error);
        }
    };

    const handleSendAnswer = async (questionNo) => {
        dispatch({ type: 'set_new_answer', payload: { questionNo: questionNo, answer: answer } });
        setShowAnswerBox(false);
        setAnswer('');

        try {
            await axios.put('http://localhost:7000/update/answer', {
                answer: answer,
                question_no: questionNo,
                user_id: currentQuestion.user_id,
                category: currentQuestion.main_category,
                product_id: currentQuestion.product_id
            });

        } catch (error) {
            console.log(error);
        }
    };

    const handleFilteredData = (data) => {
        setFilteredProducts(data);
    }

    const handleOption = (e) => {
        let Updated = [...SearchQuestion];
        if (e.target.value === 'user_name') {
            Updated = Updated.sort((a, b) => String(a.first_name + a.last_name).toLowerCase().localeCompare(String(b.first_name) + String(b.last_name).toLowerCase()));
        } else if (e.target.value === 'question_date') {
            Updated = Updated.sort((a, b) => new Date(a.question_date) - new Date(b.question_date));
        } else if (e.target.value === 'product_id') {
            Updated = Updated.sort((a, b) => Number(a.product_id) - Number(b.product_id));
        } else if (e.target.value === 'user_id') {
            Updated = Updated.sort((a, b) => Number(a.user_id) - Number(b.user_id));
        }
        setQuestions(Updated);
    };

    return (
        <section id={styles.UserSupportQuestionContainer}>

            {/* ------------- Search && sort  ------------- */}
            <section id={styles.QuestionSearchAndSort}>
                <div className={styles.searchFieldWrapper}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchField}
                        ref={searchRef}
                        onChange={handleSearch}
                    />
                    <FaSearch className={styles.searchIcon} />
                </div>
                <div id={styles.UserQuestionSortBar}>
                    <span>Sort By</span>
                    <select onChange={handleOption}>
                        <option value=""></option>
                        <option value={'product_id'}>Product Id</option>
                        <option value={'user_id'}>User Id</option>
                        <option value={'user_name'}>User Name</option>
                        <option value={'question_date'}>Date</option>
                    </select>
                </div>
            </section>

            {/* ------------- Question table ------------- */}
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
                        {filteredProducts && filteredProducts.length !== 0 && filteredProducts.map((question, index) => (
                            <tr key={index}>
                                <td>{question.user_id}</td>
                                <td>{question.first_name} {question.last_name}</td>
                                <td>{question.email}</td>
                                <td>{question.product_id}</td>
                                <td>{GetCategoryName(question.main_category)}</td>
                                <td>{question.question.length > 15 ? question.question.slice(0, 15) + '...' : question.question}</td>
                                <td>{new Date(question.question_date).toLocaleString()}</td>
                                <td>
                                    <div id={styles.buttonStyle}>
                                        <button onClick={() => handleAnswer(question)}>Answer</button>
                                        <button onClick={() => handleDelete(question.question_no)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ------------- Answer Box ------------- */}
                {showAnswerBox && (
                    <div className={styles.answerBox}>
                        <h3>Send Answer</h3>
                        <p>{currentQuestion.question}</p>
                        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
                        <button onClick={() => handleSendAnswer(currentQuestion.question_no)}>Save</button>
                        <button onClick={() => setShowAnswerBox(false)}>Cancel</button>
                    </div>
                )}
            </section>


            {/* ------------- Table pagination ------------- */}
            <Pagination productsData={Questions} handleFilteredData={handleFilteredData} />

        </section>
    )
}

export default React.memo(UserQuestions);
