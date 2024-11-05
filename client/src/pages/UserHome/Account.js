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

const Account = () => {
    const { dataState } = useContext(useData);
    const navigate = useNavigate();
    const [ButtonState, setButtonState] = useState(0);
    const [UserInformation, setUserInformation] = useState({});
    const [UserAddress, setUserAddress] = useState({});
    const [Orders, setOrders] = useState([]);

    useEffect(() => {
        const GetUserInfo = async () => {
            try {
                const res = await axios.get('http://localhost:7000/get-user-information', {
                    headers: {
                        Authorization: dataState.token
                    }
                });
                console.log(res.data);
                setOrders(await res.data.Orders);
                setUserInformation((prev) => ({ ...prev, f_name: res.data.user.first_name, l_name: res.data.user.last_name, email: res.data.user.email }));
                setUserAddress((prev) => ({ ...prev, ...res.data.address }));
            } catch (error) {
                window.localStorage.removeItem('token');
                navigate('/');
                window.location.reload();
                console.log(error);
            }
        };

        GetUserInfo();
        window.scrollTo(0, 0);
    }, [dataState.token, navigate]);

    const RenderPages = useCallback(() => {
        switch (ButtonState) {
            case 1: return <MyOrders Orders={Orders}/>
            case 2: return <Report />
            case 3: return <Address AddressInfo={UserAddress} setUserAddress={setUserAddress} />
            case 4: return <ChangePassword />
            default: return <PersonalInformation UserInformation={UserInformation} />
        }
    }, [ButtonState, UserAddress, UserInformation]);

    return (
        <section className={styles.OuterMain}>
            <AccountButtonStates setButtonState={setButtonState} UserInformation={UserInformation} />
            {RenderPages()}
        </section>
    )
}

export default React.memo(Account);