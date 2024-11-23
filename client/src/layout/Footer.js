import React, { useContext } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

import styles from '../styles/HomePageStyles/Footer.module.css';
import { useData } from '../context/useData';

const Footer = () => {
  const { dataState } = useContext(useData);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Support Section */}
        <div className={styles.footerSection}>
          <h2>SUPPORT</h2>
          <div className={styles.contactInfo}>
            <div className={styles.phone}>
              <FaPhoneAlt className={styles.icon} />
              <span className={styles.stick}></span>
              <span>{dataState?.UserHomeContents?.footer_information?.phone}</span>
            </div>
            <a  href={dataState?.UserHomeContents?.footer_information?.location} className={styles.storeLocator} target='_blank'  rel="noopener noreferrer" >
              <HiLocationMarker className={styles.icon} />
              <span className={styles.stick}></span>
              <span>Find Our Stores</span>
            </a>
            <div className={styles.socialIcons}>
              <FaFacebookF className={styles.icon} />
              <FaInstagram className={styles.icon} />
              <FaYoutube className={styles.icon} />
              <FaTiktok className={styles.icon} />
              <FaLinkedinIn className={styles.icon} />
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className={styles.footerSection}>
          <h2>About Us</h2>
          <ul>
            <li>About Us</li>
            <li>Shop Address</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Press Coverage</li>
            <li>Order Tracking</li>
            <li>Complain / Advice</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className={styles.footerSection}>
          <h2>Help</h2>
          <ul>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>EMI Policy</li>
            <li>Privacy Policy</li>
            <li>Warranty Policy</li>
            <li>Exchange Any Device</li>
            <li>Delivery Terms & Conditions</li>
          </ul>
        </div>

        {/* Stay Connected Section */}
        <div className={styles.footerSection}>
          <h2>Stay Connected</h2>
          <section className={styles.address}>
            <p>GadgetIT.com</p>
            {
              dataState?.UserHomeContents?.footer_information?.connected_text?.split('|').map((item, index) => {
                return <p key={index}>{item}</p>
              })
            }
          </section>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© Thanks From GadgetIT.com | All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
