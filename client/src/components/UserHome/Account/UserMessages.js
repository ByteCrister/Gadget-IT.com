import React, { useContext, useEffect, useState } from 'react'
import { useData } from '../../../context/useData';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from '../../../styles/HomePageStyles/UserMessage.module.css';
import axios from 'axios';

const UserMessages = ({ Orders }) => {
  const { dataState, dispatch } = useContext(useData);
  const navigate = useNavigate();
  const [Notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (dataState?.User_Notifications?.notifications) {
      setNotifications(dataState?.User_Notifications?.notifications);
    }
    // console.log(Orders);
  }, [dataState?.User_Notifications?.notifications]);

  // *Count message time
  const timeAgo = (time) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    }
  };


  // *viewed 0 to 1 for changing the use'r not view message-symbol in DATABASE
  const UpdateViewApi = async (notification_user_no) => {
    try {
      await axios.get(`http://localhost:7000/update-user-notification-view/${notification_user_no}`, {
        headers: {
          Authorization: dataState.token
        }
      });
    } catch (error) {
      dispatch({ type: 'isServerIssue', payload: true });
      console.log(error);
    }
  };

  // *Directing into the order's card while clicking on the message
  const getOrderPayload = (order_id) => {
    const payload = Orders.find((order) => order.OrderInfo.order_id === order_id);
    return {
      OrderInfo: payload.OrderInfo,
      OrderProducts: payload.OrderProducts
    }
  };

  // *The destination of ordered card
  const handleOrderClick = (message_token) => {
    navigate('/user-orders-page', {
      state: getOrderPayload(message_token)
    });
  };


  // *viewed 0 to 1 for changing the use'r not view message-symbol in FRONTEND
  const handleViewChange = async (notification_user_no) => {
    const Updated = {
      notifications: dataState?.User_Notifications?.notifications?.map((item) => {
        return item.notification_user_no === notification_user_no ? { ...item, viewed: 1 }
          : item
      }),
      user_notification_count: dataState?.User_Notifications?.user_notification_count
    };
    await UpdateViewApi(notification_user_no);
    dispatch({ type: 'set_user_notifications', payload: Updated });
  };

  // *Admin replayed user question - Extract product id, category, active scroll_ref && direct into the product link
  const handleSupportQuestionClick = (message_token) => {
    // "product_id: 1, category: 'phone'"
    message_token = String(message_token);
    const productIdMatch = message_token.match(/product_id:\s*(\d+)/);
    const product_id = productIdMatch ? parseInt(productIdMatch[1]) : null;

    const categoryMatch = message_token.match(/category:\s*'([^']+)'/);
    const category = categoryMatch ? categoryMatch[1] : null;

    dispatch({ type: 'set_scroll_ref', payload: dataState.ViewProductScrollRef.questionRef });
    navigate(`/view/${category}/${product_id}`);
  };


  // *User's pre-ordered product inserted into the website - Extract product id, category, && direct into the product link
  const handleSupportPreOrderClick = (message_token) => {
    message_token = String(message_token);
    const productIdMatch = message_token.match(/product_id:\s*(\d+)/);
    const product_id = productIdMatch ? parseInt(productIdMatch[1]) : null;

    const categoryMatch = message_token.match(/category:\s*'([^']+)'/);
    const category = categoryMatch ? categoryMatch[1] : null;
    navigate(`/view/${category}/${product_id}`);
  };


  // *Rendering notifications based on notification type
  const renderNotification = (notification) => {
    switch (notification.type) {

      case 'order':
        return <section key={uuidv4()} className={styles['user-message-main-section']} onClick={() => { handleOrderClick(Number(notification.message_token)); handleViewChange(notification.notification_user_no); }}>
          <span className={styles['main-message-span']}>New status of ORDER ID - {notification.message_token} has been arrived on {new Date(notification.notification_date).toLocaleString()}!</span>
          <span className={styles['time-ago-span']}>{timeAgo(notification.notification_date)}</span>
          <div className={notification.viewed === 0 ? styles['message-icon-active'] : styles['.message-icon-inactive']}></div>
        </section>

      case 'invoice-message':
        return <section key={uuidv4()} className={styles['user-message-main-section']} onClick={() => { handleOrderClick(Number(notification.message_token)); handleViewChange(notification.notification_user_no); }}>
          <span className={styles['main-message-span']}>We have send the payment invoice on the customer's ordered email for ORDER ID - {notification.message_token} on {new Date(notification.notification_date).toLocaleString()}!</span>
          <span className={styles['time-ago-span']}>{timeAgo(notification.notification_date)}</span>
          <div className={notification.viewed === 0 ? styles['message-icon-active'] : styles['.message-icon-inactive']}></div>
        </section>

      case 'order-canceled':
        return <section key={uuidv4()} className={styles['user-message-main-section']} onClick={() => { handleViewChange(notification.notification_user_no); }}>
          <span className={styles['main-message-span']}>Dear customer, your'r ORDER ID - {notification.message_token} has been canceled on {new Date(notification.notification_date).toLocaleString()}.</span>
          <span className={styles['time-ago-span']}>{timeAgo(notification.notification_date)}</span>
          <div className={notification.viewed === 0 ? styles['message-icon-active'] : styles['.message-icon-inactive']}></div>
        </section>

      case 'support-question':
        return <section key={uuidv4()} className={styles['user-message-main-section']} onClick={() => { handleSupportQuestionClick(notification.message_token); handleViewChange(notification.notification_user_no); }}>
          <span className={styles['main-message-span']}>You have asked a question on {new Date(notification.notification_date).toLocaleString()}! Please read the answer.</span>
          <span className={styles['time-ago-span']}>{timeAgo(notification.notification_date)}</span>
          <div className={notification.viewed === 0 ? styles['message-icon-active'] : styles['.message-icon-inactive']}></div>
        </section>

      case 'support-pre-order':
        return <section key={uuidv4()} className={styles['user-message-main-section']} onClick={() => { handleSupportPreOrderClick(notification.message_token); handleViewChange(notification.notification_user_no); }}>
          <span className={styles['main-message-span']}>You'r pre order product is avaialable on the site!! Arrived on {new Date(notification.notification_date).toLocaleString()}.</span>
          <span className={styles['time-ago-span']}>{timeAgo(notification.notification_date)}</span>
          <div className={notification.viewed === 0 ? styles['message-icon-active'] : styles['.message-icon-inactive']}></div>
        </section>
      default: return null;
    }
  };

  return (
    <section className={styles['notification-main-outer-container']}>
      <span className={styles['notification-main-head']}>Notifications</span>
      <section className={styles['notification-full-main-section']}>
        {
          Notifications &&
            Notifications.length > 0 ?
            Notifications.map((notification) => {
              return renderNotification(notification);
            })
            : <div className={styles['no-message-div']}>No messages.</div>
        }
      </section>
    </section>
  )
}

export default UserMessages;