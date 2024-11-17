import React from 'react'

import styles from '../../styles/AdminHome/page.one.module.css';

import { FcBullish } from "react-icons/fc";
import { FcSalesPerformance } from "react-icons/fc";
import { FcElectroDevices } from "react-icons/fc";
import { FcComboChart } from "react-icons/fc";

import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { MdRemoveShoppingCart } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { MdSell } from "react-icons/md";


import { RxLayers } from "react-icons/rx";
import { GoContainer } from "react-icons/go";

import { FaUsers } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";

import MyChart from '../../components/AdminHome/MyChart';




const PageOne = () => {
  const salesOverview = {
    totalSales: '789',
    revenue: '17583',
    cost: '12487',
    profit: '5097'
  }

  const InventorySummary = {
    quantityInHand: '214',
    willBeReceived: '44'
  }

  const purchaseOverView = {
    noOfPurchase: '45',
    cancleOrder: '04',
    cost: '786',
    returns: '07'
  }

  const productDetails = {
    lowStockItems: '02',
    itemGroup: '14',
    noOfItems: '104'
  }

  const noOfUsers = {
    totalUsers: '1.8k',
    totalSuppliers: '27'
  }


  return (
    <div className={styles.container}>



      <section className={styles.upperSection}>
        {/* ----------------------------------------------- */}
        <section className={styles.sectionOne}>

          <label className={styles.label}>Sales Overview</label>
          <div className={styles.firstInner}>

            <div><div className={styles.secondInner}>
              <span className={styles.logo} id={styles.logo_1}><FcSalesPerformance /></span>
              <div className={styles.text_number}>
                <span className={styles.header}>Total Sales</span>
                <span className={styles.numbers}>{salesOverview.totalSales}</span>
              </div>
            </div>

              <div className={styles.secondInner}>
                <span className={styles.logo} id={styles.logo_2}><FcBullish /></span>
                <div className={styles.text_number}>
                  <span className={styles.header}>Revenue</span>
                  <span className={styles.numbers}>{salesOverview.revenue}</span>
                </div>
              </div></div>

            <div>
              <div className={styles.secondInner}>
                <span className={styles.logo} id={styles.logo_3}><FcElectroDevices /></span>
                <div className={styles.text_number}>
                  <span className={styles.header}>Cost</span>
                  <span className={styles.numbers}>{salesOverview.cost}</span>
                </div>
              </div>
              <div className={styles.secondInner}>
                <span className={styles.logo} id={styles.logo_4}><FcComboChart /></span>
                <div className={styles.text_number}>
                  <span className={styles.header}>Profit</span>
                  <span className={styles.numbers}>{salesOverview.profit}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- */}
        <section className={styles.sectionTwo}>
          <label className={styles.label}>Purchase Overview</label>
          <div className={styles.firstInner}>

            <div><div className={styles.secondInner}>
              <span className={styles.logo} id={styles.logo_5}><RiMoneyDollarBoxFill /></span>
              <div className={styles.text_number}>
                <span className={styles.header}>Number Of Purchase</span>
                <span className={styles.numbers}>{purchaseOverView.noOfPurchase}</span>
              </div>
            </div>

              <div className={styles.secondInner}>
                <span className={styles.logo} id={styles.logo_6}><MdRemoveShoppingCart /></span>
                <div className={styles.text_number}>
                  <span className={styles.header}>Cancel Order</span>
                  <span className={styles.numbers}>{purchaseOverView.cancleOrder}</span>
                </div>
              </div></div>

            <div><div className={styles.secondInner}>
              <span className={styles.logo} id={styles.logo_7}><GrMoney /></span>
              <div className={styles.text_number}>
                <span className={styles.header}>Cost</span>
                <span className={styles.numbers}>{purchaseOverView.cost}</span>
              </div>
            </div>
              <div className={styles.secondInner}>
                <span className={styles.logo} id={styles.logo_8}><MdSell /></span>
                <div className={styles.text_number}>
                  <span className={styles.header}>Returns</span>
                  <span className={styles.numbers}>{purchaseOverView.returns}</span>
                </div>
              </div>
            </div></div>
        </section>

      </section>




      {/* ------------------------------------------------------------------ */}
      <section className={styles.Middle}>

        <section className={styles.InventorySummary}>
          <label className={styles.label}>Inventory Summary</label>
          <div className={styles.InnerInventory}>
            <div className={styles.innerDiv}>
              <span className={styles.logo} id={styles.logo_9}><RxLayers /></span>
              <span className={styles.header}>Quantity in Hand</span>
              <span className={styles.numbers}>{InventorySummary.quantityInHand}</span>
            </div>
            <div className={styles.innerDiv}>
              <span className={styles.logo} id={styles.logo_10}><GoContainer /></span>
              <span className={styles.header}>Will be Received</span>
              <span className={styles.numbers}>{InventorySummary.willBeReceived}</span>
            </div>
          </div>
        </section>


        <section className={styles.productDetails}>
          <label className={styles.label}>Product Details</label>
          <div className={styles.innerDetailDiv}>
            <div className={styles.text_number}>
              <span className={styles.header}>Low Stock Items</span>
              <span className={styles.numbers}>{productDetails.lowStockItems}</span>
            </div>
            <hr></hr>
            <div className={styles.text_number}>
              <span className={styles.header}>Item Group</span>
              <span className={styles.numbers}>{productDetails.itemGroup}</span>
            </div>
            <hr></hr>
            <div className={styles.text_number}>
              <span className={styles.header}>No of Items</span>
              <span className={styles.numbers}>{productDetails.noOfItems}</span>
            </div>
            <hr></hr>
          </div>
        </section>


        <section className={styles.endSection}>

          <label className={styles.userLabel}>No. of Users</label>
          <div className={styles.UserInnerDiv}>
            <div className={styles.UserInner}>
              <span id={styles.UserLogo_1}><FaUsers/></span>
              <span id={styles.UserHeader}>Total Customers</span>
              <span id={styles.UserNumbers}>{noOfUsers.totalUsers}</span>
            </div>
            <div className={styles.UserInner}>
              <span id={styles.UserLogo_2}><HiMiniUsers/></span>
              <span id={styles.UserHeader}>Total suppliers</span>
              <span id={styles.UserNumbers}>{noOfUsers.totalUsers}</span>
            </div>
          </div>
        </section>

      </section>

      {/* -------------------------------------------------------- */}



        <section className={styles.graph}>
          <MyChart />
        </section>


    </div>
  )
}

export default React.memo(PageOne);