import React, { useContext, useEffect, useState } from 'react';
import styles from '../../styles/AdminHome/show.notification.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useData } from '../../context/useData';
import axios from 'axios';

const ShowNotifications = ({ handleUpper, handlePage }) => {
  const { dataState, dispatch } = useContext(useData);
  const [AdminNotifications, setAdminNotifications] = useState([]);
  useEffect(() => {
    console.log('Messages render...');
    if (dataState?.Outer_Page?.notification_admin) {
      setAdminNotifications(dataState.Outer_Page.notification_admin);
    }
  }, [dataState?.Outer_Page?.notification_admin]);

  const UpdateViewApi = async (notification_no) => {
    try {
      await axios.patch(`http://localhost:7000/toggle-admin-view/${notification_no}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageDivClick = async (notification_no) => {
    const Updated = dataState?.Outer_Page?.notification_admin?.map((item) => {
      return item.notification_no === notification_no ? { ...item, viewed: 1 }
        : item;
    });
    dispatch({ type: 'set_new_notification_admin', payload: await Updated });
    await UpdateViewApi(notification_no);
  };


  const handleDeleteApi = async (notification_no) => {
    try {
      await axios.delete(`http://localhost:7000/delete-admin-view/${notification_no}`);
      await axios.patch(`http://localhost:7000/update-admin-count/${AdminNotifications.length - 1}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (notification_no) => {
    console.log('Delete notification : ' + notification_no);
    const Updated = AdminNotifications.filter((item) => {
      return item.notification_no !== notification_no;
    });
    await handleDeleteApi(notification_no);
    dispatch({ type: 'set_new_notification_admin', payload: Updated });
    dispatch({ type: 'set_new_admin_count', payload: AdminNotifications.length - 1 });
  };

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



  return (
    <div className={styles.mainOuter}>
      <button className={styles.closeButton} onClick={() => handleUpper(0)}>
        <AiOutlineClose style={{ fontSize: '24px', color: 'red' }} />
      </button>
      <div className={styles.notificationContainer}>
        {AdminNotifications &&
          AdminNotifications.length > 0 &&
          AdminNotifications.map((notification) => (
            <div key={notification.notification_no} className={`${styles.notificationBox} ${styles.fadeIn}`} onClick={() => { handlePage(notification.page); handleMessageDivClick(notification.notification_no) }}>
              <div className={notification.viewed === 0 ? styles['message-new-active'] : styles['message-new-inactive']}></div>
              <div className={styles.notificationHeader}>
                <span className={styles.notificationTime}>{timeAgo(notification.notification_date)}</span>
                <span className={styles.notificationType}>{notification.type}</span>
                <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation();; handleDelete(notification.notification_no) }}>
                  <AiOutlineClose />
                </button>
              </div>
              <div className={styles.notificationContent}>
                <span className={styles.senderName}>{notification.sender_type}</span>
                <span>{new Date(notification.notification_date).toLocaleString()}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default React.memo(ShowNotifications);
