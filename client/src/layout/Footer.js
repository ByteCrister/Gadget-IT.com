import React from 'react';
import styles from '../styles/HomePageStyles/Footer.module.css';
import { FaPhoneAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn } from 'react-icons/fa';


const Footer = () => {
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
              <span>09678148148</span>
            </div>
            <div className={styles.storeLocator}>
              <HiLocationMarker className={styles.icon} />
              <span className={styles.stick}></span>
              <span>Find Our Stores</span>
            </div>
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
            <p>Apple Gadgets</p>
            <p>Basement 2, Shop 26, Bashundhara City Shopping Complex</p>
            <p>Level 6, Block D, Shop 72-73, Bashundhara City Shopping Complex</p>
            <p>Level 4, Zone A (West Court), Shop 2BD, Jamuna Future Park</p>
            <p>Level 4, Shop 505, Mascot Plaza - Uttara</p>
            <p>Email: contact@gadgetIT.com</p>
          </section>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2024 Thanks From GadgetIT.com | All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
