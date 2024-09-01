import React, { useContext, useEffect, useCallback } from 'react';
import styles from '../../styles/HomePageStyles/UserHomePage.module.css';
import { useData } from '../../context/useData';
import SwiperMainAdd from '../../components/UserHome/SwiperMainAdd';
import UserSupportBoxes from '../../components/UserHome/UserSupportBoxes';
import UserFeaturedIcons from '../../components/UserHome/UserFeaturedIcons';
import UserHomeDescription from '../../components/UserHome/UserHomeDescription';
import ReadyForOrder from '../../components/UserHome/ReadyForOrder';
import FeaturedProducts from '../../components/UserHome/FeaturedProducts';
import NewArrival from '../../components/UserHome/NewArrival';
import ExtraSubAdd from '../../components/UserHome/ExtraSubAdd';
import { useLocation } from 'react-router-dom';

const UserHomePage = () => {
  const { dataState, dispatch } = useContext(useData);
  const location = useLocation();

  const handleLogout = useCallback(() => {
    dispatch({ type: 'set_home_view', payload: { isAdmin: false, isUserLoggedIn: false, UserID: null } });
    window.localStorage.clear(); // Clean up all related items in localStorage in one step
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'set_path_setting',
      payload: { prevPath: dataState.pathSettings.currPath, currPath: location.pathname },
    });
  }, [dispatch, location.pathname]);

  return (
    <section className={styles.userHomeContainer}>
      {/* Section One: Main Advertisements Swiper */}
      <SwiperMainAdd />

      {/* Section Two: User Support Boxes */}
      <UserSupportBoxes />

      {/* Section Three: Featured Category Icons */}
      <UserFeaturedIcons />

      {/* Section Four: Ready for Orders */}
      <ReadyForOrder />

      {/* Section Five: Featured Products */}
      <FeaturedProducts />

      {/* Section Six: Extra Sub Advertisements */}
      <ExtraSubAdd />

      {/* Section Seven: New Arrival Products */}
      <NewArrival />

      {/* Section Eight: Home Descriptions */}
      <UserHomeDescription />

      {dataState.isUserLoggedIn ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <div>Home</div>
      )}
    </section>
  );
};

export default React.memo(UserHomePage);
