import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { GoSearch } from "react-icons/go";
import { AiOutlineMail } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import { RiUserStarLine } from "react-icons/ri";
import { TbMessageReport } from "react-icons/tb";

import Users from '../../Users.json';
import styles from '../../styles/AdminHome/PageSix.module.css';
import Pagination from '../../HOOKS/Pagination';

const PageSix = () => {
  const [active, setActive] = useState(true);
  const [UserData, setUserData] = useState([]);
  const [activeAction, setActiveAction] = useState(false);
  const [actionUser, setActionUser] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState(Users.users);

  useEffect(() => {
    if (active) {
      setUserData(Users.users);
      setActive(false);
    }
  }, [active]);

  // Function to handle user actions
  const handleActionUser = (userID, actionName) => {
    const user = UserData.find(user => user.user_id === userID);

    if (actionName === 'question') {
      setActionUser(user.questions);
    } else if (actionName === 'rating') {
      setActionUser(user.rating_history);
    } else if (actionName === 'order') {
      setActionUser(user.order_history);
    } else if (actionName === 'reports') {
      setActionUser(user.report_history);
    }

    setActiveAction(true);
  };

  
  const handleFilteredData = (data)=>{
    setFilteredProducts((prev)=> data);
  }

  return (
    <>
      <section id={styles.UserMainContainer}>

        <section id={styles.section_1}>
          <div id={styles.section_1_div_1}>
            <div>
              <span><FaUser /></span>
              <span> 5</span>
            </div>
            <p>{'New User( this week )'}</p>
          </div>

          <div id={styles.section_1_div_2}>
            <div>
              <span><FaUser /></span>
              <span> 10</span>
            </div>
            <p>{'New User( this month )'}</p>
          </div>
        </section>

        <section id={styles.section_2}>
          <div id={styles.Search_bar}>
            <span><GoSearch /></span>
            <input type='text' id={styles.search} placeholder='Search...'></input>
          </div>
          <div id={styles.Sort_button}>
            <div>
              <span><TbArrowsSort /></span>
              <span>Sort By</span>
            </div>
            <select>
              <option value={null}></option>
              <option>Category</option>
              <option>Sign-Up-Date</option>
              <option>User Name</option>
            </select>
          </div>
        </section>

        <section id={styles.section_3}>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th><div><span><FaUser /></span><span>Name</span></div></th>
                  <th><div><span><AiOutlineMail /></span><span>Email</span></div></th>
                  <th><div><span><CiCalendarDate /></span><span>Sign-Up-Date</span></div></th>
                  <th><div><span><LuSettings2 /></span><span>Action</span></div></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_name}</td>
                    <td>{user.user_email}</td>
                    <td>{user.sign_up_date}</td>
                    <td className={styles.Buttons}>
                      <button id='question' onClick={() => handleActionUser(user.user_id, 'question')}><BsFillQuestionSquareFill /><span>Questions</span></button>
                      <button id='rating' onClick={() => handleActionUser(user.user_id, 'rating')}><MdOutlineRateReview /><span>Rating</span></button>
                      <button id='orders' onClick={() => handleActionUser(user.user_id, 'order')}><RiUserStarLine /><span>Orders</span></button>
                      <button id='reports' onClick={() => handleActionUser(user.user_id, 'reports')}><TbMessageReport /><span>Reports</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Pagination productsData={Users.users} handleFilteredData={handleFilteredData}/>

      </section>


      {/*-------------------------------------------------------*/}
      {activeAction && actionUser && (
        <section id={styles.Action_Functions}>
          <h2>Action Details</h2>
          <table>
            <thead>
              <tr>
                {actionUser.length > 0 && Object.keys(actionUser[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actionUser.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => { setActiveAction(!activeAction) }}>Back</button>
        </section>
      )}
    </>
  );
};

export default PageSix;
