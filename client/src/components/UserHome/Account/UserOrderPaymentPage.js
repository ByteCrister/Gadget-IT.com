import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "../../../styles/HomePageStyles/UserOrderPaymentPage.module.css";
import axios from "axios";
import { useData } from "../../../context/useData";

const UserOrderPaymentPage = () => {
  const { dataState } = useContext(useData);
  const location = useLocation();
  const navigate = useNavigate();
  const [ErrorState, setErrorState] = useState({
    isError: false,
    message: "Wrong password",
  });
  const [isLoading, setIsLoading] = useState(false);
  const SourceIdRef = useRef();
  const AmountRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isValid = () => {
    if (
      Number(AmountRef.current.value) !==
      Number(location.state.store.reduce((s, c) => s + c.price * c.quantity, 0))
    ) {
      setErrorState({
        isError: true,
        message: "Please fill the required amount!",
      });
      return false;
    }

    if (
      SourceIdRef.current.value.trim().length === 0 ||
      SourceIdRef.current.value.trim() < 5
    ) {
      setErrorState({
        isError: true,
        message: "Please type your Bank Source Id correctly.",
      });
      return false;
    }

    return true;
  };

  const handlePay = async () => {
    if (isValid()) {
      setIsLoading(true);
      setErrorState({ isError: false, message: '' });
      try {
        await axios.post("http://localhost:7000/perform-payment", {
          funding_source: SourceIdRef.current.value,
          amount_value: AmountRef.current.value,
        });
        const resData = await axios.post('http://localhost:7000/insert-new-order', {
          store: location.state.store,
          FormInfo: location.state.FormInfo,
          payMethodState: location.state.payMethodState
        }, {
          headers: {
            Authorization: dataState.token
          }
        });
        navigate('/user-orders-page', {
          state: { OrderInfo: resData.data.OrderInfo[0], OrderProducts: resData.data.OrderProducts }
        });
        setIsLoading(false);
      } catch (error) {
        setErrorState({
          isError: true,
          message: error.message + '. Enter correct id. Please try again.'
        });
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <section className={styles["main-payment-section"]}>
      {ErrorState.isError ? (
        <span className={styles["payment-div-error-span"]}>
          {ErrorState.message}
          <sup>*</sup>
        </span>
      ) : null}
      <div>
        {
          <>
            <span className={styles["payment-default-span"]}>Payment</span>
            <span className={styles["payment-div-amount-span"]}>
              Amount: BDT{" "}
              {location?.state?.store && location.state.store.length !== 0
                ? location.state.store.reduce((s, c) => s + c.price * c.quantity, 0)
                : 0}
            </span>
            <input
              type="password"
              onChange={() => setErrorState({ isError: false, message: "" })}
              ref={SourceIdRef}
              placeholder="Bank source id"
            ></input>
            <input
              type="number"
              onChange={() => setErrorState({ isError: false, message: "" })}
              ref={AmountRef}
              placeholder="Amount"
              min={0}
            ></input>
            <button onClick={handlePay}>{isLoading ? 'Wait...' : 'Pay'}</button>
          </>
        }
      </div>
    </section>
  );
};

export default UserOrderPaymentPage;
