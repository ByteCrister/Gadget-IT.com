import React from 'react'
import styles from '../../styles/AdminHome/PageFour.module.css';


const OrderPageFilter = ({setFilterActiveState, filterActiveState}) => {
  return (
    <div id={styles.filterFormContainer}>

      <section id={styles.filterForm}>

        <span id={styles.filterLabel}>Filter</span>

        <div id={styles.dateRange}>
          <div id={styles.div_1}>
            <span>Date Range</span>
            <span id={styles.resetDate}>Reset</span>
          </div>
          <div id={styles.div_2}>
            <div>
              <span>From:</span>
              <input type='date'></input>
            </div>
            <div>
              <span>To:</span>
              <input type='date'></input>
            </div>
          </div>
        </div>

        <hr />

        <div id={styles.actionType}>
          <div id={styles.div_3}>
            <span>Action Type</span>
            <span id={styles.resetAction}>Reset</span>
          </div>
          <div>
            <select id={styles.actionTypeDropdown}>
              <option value=""></option>
              <option value="Order Is Processing">Order Is Processing</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Way to Destination">Way to Destination</option>
              <option value="Ready to Collect">Ready to Collect</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        <hr />

        <div id={styles.inventoryState}>
          <div id={styles.div_5}>
            <span>Inventory State</span>
            <span id={styles.resetInventory}>Reset</span>
          </div>
          <div>
            <select id={styles.inventoryStateDropdown}>
              <option ></option>
              <option value="Category">Category</option>
              <option value="Date">Date</option>
              <option value="Quantity">Quantity</option>
              <option value="Price">Price</option>
            </select>
          </div>
        </div>

        <hr />

        <div id={styles.resetAndApply}>
          <button id={styles.resetButton}>Reset all</button>
          <button id={styles.applyButton}>Apply now</button>
        </div>


        <button id={styles.toggleButton} onClick={() => { setFilterActiveState(!filterActiveState) }}>
          Back
        </button>

      </section>
    </div>
  )
}

export default OrderPageFilter