import axios from 'axios';

export const LoginPost = async (setDataState, values, dispatch, handleUserEntryPage) => {

    setDataState((prev) => ({
        ...prev,
        isButtonLoading: true,
        emailNotFound: false,
        passNotMatch: false,
        adminPassNotMatched: false,
        isExternalError: false
    }));

    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/log-in`, values);
        const data = response.data;

        console.log('Log in message : ' + data.message);
        if (data.message === 'User email not found') {
            setDataState((prev) => ({
                ...prev,
                emailNotFound: true
            }));
        } else if (data.message === 'Invalid user password') {
            setDataState((prev) => ({
                ...prev,
                passNotMatch: true
            }));

        } else if (data.message === 'Invalid admin password') {
            setDataState((prev) => ({
                ...prev,
                adminPassNotMatched: true
            }));
        }
        else {
            const token = data.token;
            const isAdmin = data.isAdmin === "true" || data.isAdmin === true;
            const isUserLoggedIn = data.isLogged === "true" || data.isLogged === true;

            window.localStorage.setItem('token', JSON.stringify(token));

            dispatch({ type: 'set_home_view', payload: { isAdmin: isAdmin, isUserLoggedIn: isUserLoggedIn, token: token } })
            if (isAdmin) {
                window.location.href = '/';
            }
            handleUserEntryPage(0);
        }
        setDataState((prev) => ({
            ...prev,
            isButtonLoading: false
        }));
    } catch (error) {
        console.log(error);
        setDataState((prev) => ({
            ...prev,
            isButtonLoading: false,
            isExternalError: true
        }));
    }
};
