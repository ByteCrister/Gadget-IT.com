import axios from 'axios';

export const LoginPost = async (setDataState, values, dispatch, handleUserEntryPage) => {

    setDataState((prev) => ({
        isButtonLoading: true,
        emailNotFound: false,
        passNotMatch: false,
        adminPassNotMatched : false,
        isExternalError : false
    }));

    try {
        const response = await axios.post('http://localhost:7000/user/log-in', values);
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
            let userId = false;
            const isAdmin = data.isAdmin === "true" || data.isAdmin === true;
            const isUserLoggedIn = data.isLogged === "true" || data.isLogged === true;
            if (data.userId !== 'false') {
                userId = data.userId;
            }

            window.localStorage.setItem('_isAdmin', JSON.stringify(isAdmin));
            window.localStorage.setItem('_isUserLoggedIn', JSON.stringify(isUserLoggedIn));
            window.localStorage.setItem('_userId', JSON.stringify(userId));

            dispatch({ type: 'set_home_view', payload: { isAdmin: isAdmin, isUserLoggedIn: isUserLoggedIn, UserID: userId } })
            if (isAdmin) {
                window.location.href = '/';
            } else {
                window.location.href = data.path;
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
