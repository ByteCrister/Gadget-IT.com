import React, { useContext } from 'react'
import style from '../styles/HomePageStyles/uppernav.module.css'
import { BsBoxSeamFill } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";

import { Link } from 'react-router-dom';
import { useData } from '../context/useData';

const NavBar = ({ handleUserEntryPage }) => {
  const { dataState } = useContext(useData);

  return (
    <>
      <div className={style.upperNav}>
        <div ><Link to={'/'} className={style.logo}>Gadget It</Link></div>
        <input type="text" className={style.searchBar} placeholder="Search..." />

        <div className={style.upperContents}>

          <Link to="#offers" className={style.navLink}>
            <div className={style.offerBox}>
              <BsBoxSeamFill className={style.Icon} />
              <div className={style.Head_and_Text}>
                <span className={style.Head}>
                  Offers
                </span>
                <span className={style.Text}>
                  Latest Offers
                </span>
              </div>
            </div>
          </Link>

          <Link to={'/user/cart'} className={style.navLink}>
            <div className={style.cartBox}>
              <IoCartOutline className={style.Icon} />
              <div className={style.Head_and_Text}>
                <span className={style.Head}>
                  Carts({dataState.CartStorage.length})
                </span>
                <span className={style.Text}>
                  Add Items
                </span>
              </div>
            </div>
          </Link>

          <Link to="#preorder" className={style.navLink}>
            <div className={style.offerBox}>
              <RiShoppingBag4Fill className={style.Icon} />
              <div className={style.Head_and_Text}>
                <span className={style.Head}>
                  Pre-Order
                </span>
                <span className={style.Text}>
                  Order Today
                </span>
              </div>
            </div>
          </Link>


          {
            dataState.isUserLoggedIn ?

              <Link to={'/user/account'} className={style.navLink}>
                <div className={style.registerBox}>
                  <VscAccount className={style.Icon} />
                  <div className={style.Head_and_Text}>
                    <span className={style.Head}>
                      Account
                    </span>
                    <span className={style.Text}>
                      Profile
                    </span>
                  </div>
                </div>
              </Link>

              :

              <Link onClick={() => { handleUserEntryPage(1) }} className={style.navLink}>
                <div className={style.registerBox}>
                  <VscAccount className={style.Icon} />
                  <div className={style.Head_and_Text}>
                    <span className={style.Head}>
                      Account
                    </span>
                    <span className={style.Text}>
                      Register or Login
                    </span>
                  </div>
                </div>
              </Link>


          }

        </div>

      </div>
    </>

  )
}

export default NavBar