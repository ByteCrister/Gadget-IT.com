import axios from 'axios';

export const LoginPost = async (handleLoginStates, values, dispatch, handleUserEntryPage) => {
    // alert(JSON.stringify(values, null, 2));
    handleLoginStates({
        isButtonLoading: true,
        emailNotFound: false,
        passNotMatch: false
    });

    try {
        const response = await axios.post('http://localhost:7000/user/log-in', values);
        const data = response.data;

        console.log('Log in message : ' + data.message);
        if (data.message === 'Email not found') {
            handleLoginStates({
                isButtonLoading: false,
                emailNotFound: true,
                passNotMatch: false
            });
        } else if (data.message === 'Invalid password') {

            handleLoginStates({
                isButtonLoading: false,
                emailNotFound: false,
                passNotMatch: true
            });

        } else {
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
            handleUserEntryPage(0);

            handleLoginStates({
                isButtonLoading: false,
                passNotMatch: false,
                emailNotFound: false,
            });
        }
    } catch (error) {
        console.log(error);
        handleLoginStates({
            isButtonLoading: false,
            passNotMatch: false,
            emailNotFound: true,
        });
    }
};
