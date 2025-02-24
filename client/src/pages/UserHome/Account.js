import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from '../../styles/HomePageStyles/Account.module.css';

import AccountButtonStates from '../../components/UserHome/Account/AccountButtonStates';
import PersonalInformation from '../../components/UserHome/Account/PersonalInformation';
import { useData } from '../../context/useData';
import MyOrders from '../../components/UserHome/Account/MyOrders';
import Address from '../../components/UserHome/Account/Address';
import ChangePassword from '../../components/UserHome/Account/ChangePassword';
import Report from '../../components/UserHome/Account/Report';
import UserMessages from '../../components/UserHome/Account/UserMessages';

const Account = () => {
    const { dataState, dispatch } = useContext(useData);
    const navigate = useNavigate();
    const [UserInformation, setUserInformation] = useState({});
    const [UserAddress, setUserAddress] = useState({});
    const [Orders, setOrders] = useState([]);

    useEffect(() => {
        const GetUserInfo = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-user-information`, {
                    headers: {
                        Authorization: dataState.token
                    }
                });
                // console.log(res.data.User_Notifications);
                setOrders(await res.data.Orders);
                setUserInformation((prev) => ({ ...prev, f_name: res.data.user.first_name, l_name: res.data.user.last_name, email: res.data.user.email }));
                setUserAddress((prev) => ({ ...prev, ...res.data.address }));
                dispatch({ type: 'set_user_notifications', payload: res.data.User_Notifications });
            } catch (error) {
                window.localStorage.removeItem('token');
                navigate('/');
                window.location.reload();
                console.log(error);
            }
        };

        GetUserInfo();
        window.scrollTo(0, 0);
    }, [dataState.token, dispatch, navigate]);

    const RenderPages = useCallback(() => {
        switch (dataState.ProfileButtonState) {
            case 1: return <UserMessages Orders={Orders} />
            case 2: return <MyOrders Orders={Orders} />
            case 3: return <Report />
            case 4: return <Address AddressInfo={UserAddress} setUserAddress={setUserAddress} />
            case 5: return <ChangePassword />
            default: return <PersonalInformation UserInformation={UserInformation} />
        }
    }, [Orders, UserAddress, UserInformation, dataState?.ProfileButtonState]);

    return (
        <section className={styles.OuterMain}>
            <AccountButtonStates UserInformation={UserInformation} />
            {RenderPages()}
        </section>
    )
}

export default React.memo(Account);