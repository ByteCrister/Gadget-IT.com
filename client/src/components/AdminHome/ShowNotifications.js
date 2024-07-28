import React, { useState } from 'react';
import styles from '../../styles/AdminHome/show.notification.module.css';
import { AiOutlineClose } from 'react-icons/ai';

const ShowNotifications = ({ handleUpper, handlePage }) => {
  const initialNotifications = [
    { id: 5, time: '2024-07-10T10:00:00Z', sender: 'Reports', content: 'New report available', type: 'report' },
    { id: 4, time: '2024-07-10T11:00:00Z', sender: 'Sales', content: 'New order received', type: 'order' },
    { id: 7, time: '2024-07-10T12:00:00Z', sender: 'Support', content: 'New support message', type: 'support' },
    { id: 6, time: '2024-07-10T13:00:00Z', sender: 'User', content: 'New user registered', type: 'user' },
    { id: 6, time: '2024-07-10T13:00:00Z', sender: 'User', content: 'New user registered', type: 'user' },
    { id: 6, time: '2024-07-10T13:00:00Z', sender: 'User', content: 'New user registered', type: 'user' },
    { id: 6, time: '2024-07-10T13:00:00Z', sender: 'User', content: 'New user registered', type: 'user' },
    { id: 6, time: '2024-07-10T13:00:00Z', sender: 'User', content: 'New user registered', type: 'user' },
    { id: 6, time: '2024-07-10T13:00:00Z', sender: 'User', content: 'New user registered', type: 'user' },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDelete = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'report': return 'New Report';
      case 'order': return 'New Order';
      case 'support': return 'Support Message';
      case 'user': return 'New User';
      default: return 'Notification';
    }
  };

  return (
    <div className={styles.mainOuter}>
      <button className={styles.closeButton} onClick={() => handleUpper(0)}>
        <AiOutlineClose style={{ fontSize: '24px', color: 'red' }} />
      </button>
      <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div key={notification.id} className={`${styles.notificationBox} ${styles.fadeIn}`} onClick={()=>{ handlePage(notification.id) }}>
          <div className={styles.notificationHeader}>
            <span className={styles.notificationTime}>{timeAgo(notification.time)}</span>
            <span className={styles.senderName}>{notification.sender}</span>
            <button className={styles.deleteButton} onClick={() => handleDelete(notification.id)}>
              <AiOutlineClose />
            </button>
          </div>
          <div className={styles.notificationContent}>
            <span className={styles.notificationType}>{getTypeLabel(notification.type)}</span>
            <p>{notification.content}</p>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default ShowNotifications;
