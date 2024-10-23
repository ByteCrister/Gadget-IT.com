import React, { useState } from 'react';
import styles from '../../styles/AdminHome/show.messages.module.css';
import { AiOutlineClose } from 'react-icons/ai';

const ShowMessages = ({ handleUpper }) => {
  const initialMessages = [
    { id: 1, time: '2024-07-10T10:00:00Z', userName: 'User 1', content: 'Message content 1' },
    { id: 2, time: '2024-07-10T12:00:00Z', userName: 'User 2', content: 'Message content 2' },
    { id: 3, time: '2024-07-10T12:00:00Z', userName: 'User 2', content: 'Message content 2' },
    { id: 4, time: '2024-07-10T12:00:00Z', userName: 'User 2', content: 'Message content 2' },
    { id: 5, time: '2024-07-10T12:00:00Z', userName: 'User 2', content: 'Message content 2' },
    { id: 6, time: '2024-07-10T12:00:00Z', userName: 'User 2', content: 'Message content 2' }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [showReplyId, setShowReplyId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  const toggleReply = (id) => {
    setShowReplyId(showReplyId === id ? null : id);
  };

  const handleDelete = (id) => {
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
  };

  const timeAgo = (time) => {
    // const now = new Date();
    // const messageTime = new Date(time);
    // const diffInSeconds = Math.floor((now - messageTime) / 1000);

    // if (diffInSeconds < 60) {
    //   return `${diffInSeconds} seconds ago`;
    // } else if (diffInSeconds < 3600) {
    //   const minutes = Math.floor(diffInSeconds / 60);
    //   return `${minutes} minutes ago`;
    // } else if (diffInSeconds < 86400) {
    //   const hours = Math.floor(diffInSeconds / 3600);
    //   return `${hours} hours ago`;
    // } else {
    //   const days = Math.floor(diffInSeconds / 86400);
    //   return `${days} days ago`;
    // }
    return 0;
  };

  return (
    <div>
        <button className={styles.closeButton} onClick={() => { handleUpper(0) }}>
          <AiOutlineClose style={{ fontSize: '24px', color: 'red' }} />
        </button>
      <div className={styles.messageContainer}>
        {messages.map((message) => (
          <div key={message.id} className={`${styles.messageBox} ${styles.fadeIn}`}>
            <div className={styles.messageHeader} onClick={() => toggleExpand(message.id)}>
              <span className={styles.messageTime}>{timeAgo(message.time)}</span>
              <span className={styles.userName}>{message.userName}</span>
              <button className={styles.toggleButton}>
                {expandedMessageId === message.id ? 'Hide' : 'Show'}
              </button>
              <button className={styles.deleteButton} onClick={() => handleDelete(message.id)}>
                <AiOutlineClose />
              </button>
            </div>
            {expandedMessageId === message.id && (
              <div className={styles.messageContent}>
                <p>{message.content}</p>
                <button className={styles.replyButton} onClick={() => toggleReply(message.id)}>
                  {showReplyId === message.id ? 'Cancel' : 'Reply'}
                </button>
                {showReplyId === message.id && (
                  <div className={styles.replySection}>
                    <textarea placeholder="Write your reply..." className={styles.replyInput}></textarea>
                    <button className={styles.sendReplyButton}>Send Reply</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default ShowMessages;
