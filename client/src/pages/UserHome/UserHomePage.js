import React, { useContext } from 'react'
import { useData } from '../../context/useData';
import SwiperMainAdd from '../../components/UserHome/SwiperMainAdd';

const UserHomePage = () => {
  const { dataState, dispatch } = useContext(useData);

  const handleLogout = () => {
    dispatch({ type: 'set_home_view', payload: { isAdmin: false, isUserLoggedIn: false, UserID: false } })
    window.localStorage.removeItem('_isAdmin');
    window.localStorage.removeItem('_isUserLoggedIn');
    window.localStorage.removeItem('_userId');
    window.localStorage.clear();
  }


  return (
    <div >
      {/*-------------  Section One : Main Advertisements Swiper ------------*/}
        <SwiperMainAdd />


        

      {
        dataState.isUserLoggedIn ? <button onClick={handleLogout}>Log Out</button> : 'Home'
      }

    </div>
  )
}

export default UserHomePage