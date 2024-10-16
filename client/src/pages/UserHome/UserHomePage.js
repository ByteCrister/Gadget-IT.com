import React, { useContext, useEffect } from 'react';
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

  useEffect(() => {
    dispatch({
      type: 'set_path_setting',
      payload: { prevPath: dataState.pathSettings.currPath, currPath: location.pathname },
    });
    dispatch({ type: 'toggle_isServerIssue', payload: false });
    window.scrollTo(0, 0);
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
    </section>
  );
};

export default React.memo(UserHomePage);
