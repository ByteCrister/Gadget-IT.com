import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaSearch, FaUser } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import { RiFilter3Line, RiUserStarLine } from "react-icons/ri";
import { TbMessageReport } from "react-icons/tb";
import { FaIdCardClip } from "react-icons/fa6";

import styles from '../../styles/AdminHome/PageSix.module.css';
import { GetCategoryName } from '../../HOOKS/GetCategoryName';
import { useData } from '../../context/useData';
import Pagination from '../../HOOKS/Pagination';
import { SearchUsersPage } from '../../HOOKS/SearchUsersPage';

const PageSix = () => {
  const { dataState, dispatch } = useContext(useData);

  const [filterState, setFilterState] = useState(0);
  const [activeAction, setActiveAction] = useState(false);
  const [actionKeyStateData, setActionKeyStateData] = useState(null);
  const [UserData, setUserData] = useState({
    UserDataStore: [],
    filteredData: []
  });


  useEffect(() => {
    if (dataState?.Users_Page?.UsersDocument) {
      setUserData({
        UserDataStore: [...dataState?.Users_Page?.UsersDocument],
        filteredData: [...dataState?.Users_Page?.UsersDocument]
      });
      // console.log(dataState?.Users_Page?.UsersDocument);
    }
  }, [dataState?.Users_Page]);

  useEffect(() => {
    dispatch({
      type: 'set_search_function',
      payload: {
        function: SearchUsersPage,
        params: {
          1: dataState?.Users_Page?.UsersDocument,
          2: setUserData
        }
      }
    });
  }, [dataState?.Users_Page?.UsersDocument]);

  const handleSearch = (e) => {
    SearchUsersPage(e.target.value, dataState?.Users_Page?.UsersDocument, setUserData);
  };

  //* Function to handle user actions
  const handleActionUser = (user_id, keyState) => {
    const User = UserData.UserDataStore.find((userObject) => {
      return userObject.user.user_id === user_id
    });
    setActionKeyStateData(User[keyState]);
    setActiveAction(true);
  };

  const handleFilteredData = (newPaginateData) => {
    setUserData((prev) => ({
      ...prev,
      filteredData: newPaginateData
    }));
  };

  const isISODate = value => {
    return typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
      !isNaN(Date.parse(value));
  };

  const handleFilterButton = () => {
    setFilterState(prev => prev !== 8 ? prev + 1 : 0);
    let Updated = [...dataState?.Users_Page?.UsersDocument];
    if (filterState + 1 >= 1 && filterState + 1 <= 2) {
      Updated.sort((a, b) => {
        return filterState + 1 === 1 ? a.user.user_id - b.user.user_id
          : b.user.user_id - a.user.user_id;
      });

    } else if (filterState + 1 >= 3 && filterState + 1 <= 4) {
      Updated.sort((a, b) => {
        return filterState + 1 === 3 ? String(a.user.first_name + a.user.last_name).localeCompare(String(b.user.first_name + b.user.last_name))
          : String(b.user.first_name + b.user.last_name).localeCompare(String(a.user.first_name + a.user.last_name));
      });

    } else if (filterState + 1 >= 5 && filterState + 1 <= 6) {
      Updated.sort((a, b) => {
        return filterState + 1 === 5 ? a.user.email.localeCompare(b.user.email)
          : b.user.email.localeCompare(a.user.email);
      });

    } else if (filterState + 1 >= 7 && filterState + 1 <= 8) {
      Updated.sort((a, b) => {
        return filterState + 1 === 7 ? new Date(a.user.signIn_time) - new Date(b.user.signIn_time)
          : new Date(b.user.signIn_time) - new Date(a.user.signIn_time);
      });
    }
    setUserData((prev) => ({
      ...prev,
      UserDataStore: Updated
    }));
  };

  return (
    <>
      <section id={styles.UserMainContainer}>

        <section id={styles.section_1}>
          <div id={styles.section_1_div_1}>
            <div>
              <span><FaUser /></span>
              <span>{dataState.Users_Page.period[1].count}</span>
            </div>
            <p>{'New User( this week )'}</p>
          </div>

          <div id={styles.section_1_div_2}>
            <div>
              <span><FaUser /></span>
              <span>{dataState.Users_Page.period[0].count}</span>
            </div>
            <p>{'New User( this month )'}</p>
          </div>
        </section>

        <section id={styles.section_2}>
          <div className={styles.searchContainer}>
            <div className={styles.searchFieldWrapper}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchField}
                onChange={handleSearch}
              />
              <FaSearch className={styles.searchIcon} />
            </div>
            <button className={styles.filterButton} onClick={handleFilterButton} >
              <RiFilter3Line style={{ fontSize: '20px' }} />
              Filter
            </button>
          </div>
        </section>

        <section id={styles.section_3}>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className={filterState >= 1 && filterState <= 2 ? styles['active-user-table-head'] : styles['default-user-table-head']}><div><span><FaIdCardClip /></span><span>ID</span></div></th>
                  <th className={filterState >= 3 && filterState <= 4 ? styles['active-user-table-head'] : styles['default-user-table-head']}><div><span><FaUser /></span><span>User</span></div></th>
                  <th className={filterState >= 5 && filterState <= 6 ? styles['active-user-table-head'] : styles['default-user-table-head']}><div><span><AiOutlineMail /></span><span>Email</span></div></th>
                  <th className={filterState >= 7 && filterState <= 8 ? styles['active-user-table-head'] : styles['default-user-table-head']}><div><span><CiCalendarDate /></span><span>Sign-Up-Date</span></div></th>
                  <th className={styles['default-user-table-head']}><div><span><LuSettings2 /></span><span>Action</span></div></th>
                </tr>
              </thead>
              <tbody>
                {UserData.filteredData &&
                  UserData.filteredData.length > 0 &&
                  UserData.filteredData.map((userObject) => (
                    <tr key={userObject.user.user_id}>
                      <td>{userObject.user.user_id}</td>
                      <td>{userObject.user.first_name} {userObject.user.last_name}</td>
                      <td>{userObject.user.email}</td>
                      <td>{new Date(userObject.user.signIn_time).toLocaleString()}</td>
                      <td className={styles.Buttons}>
                        <button id='question' onClick={() => handleActionUser(userObject.user.user_id, 'user_questions')}><BsFillQuestionSquareFill /><span>Questions</span></button>
                        <button id='rating' onClick={() => handleActionUser(userObject.user.user_id, 'user_ratings')}><MdOutlineRateReview /><span>Ratings</span></button>
                        <button id='orders' onClick={() => handleActionUser(userObject.user.user_id, 'user_orders')}><RiUserStarLine /><span>Orders</span></button>
                        <button id='reports' onClick={() => handleActionUser(userObject.user.user_id, 'user_reports')}><TbMessageReport /><span>Reports</span></button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <Pagination productsData={UserData.UserDataStore} handleFilteredData={handleFilteredData} />

      </section>


      {/*-------------------------------------------------------*/}
      {activeAction &&
        <section id={styles.Action_Functions}>
          <h2>Details</h2>
          <table>
            <thead>
              <tr>
                {actionKeyStateData &&
                  actionKeyStateData.length !== 0 &&
                  Object.entries(actionKeyStateData[0]).map(([key]) => {
                    return <th key={uuidv4()}>{GetCategoryName(key)}</th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              {actionKeyStateData &&
                actionKeyStateData.length !== 0 &&
                actionKeyStateData.map((keyState) => {
                  return <tr key={uuidv4()}>
                    {
                      Object.entries(keyState).map(([_, value]) => {
                        return <td key={uuidv4()}>{isISODate(value)
                          ? new Date(value).toLocaleString()
                          : value}
                        </td>
                      })
                    }
                  </tr>
                })
              }
            </tbody>
          </table>
          <button onClick={() => { setActiveAction(!activeAction) }}>Back</button>
        </section>
      }
    </>
  );
};

export default React.memo(PageSix);
