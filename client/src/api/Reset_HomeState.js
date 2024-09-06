import axios from 'axios'

export const Reset_HomeState = async (dispatch) => {
    try {
        await axios.delete('http://localhost:7000/reset-home-state', { withCredentials: true });
        dispatch({
            type: 'set_home_view', payload: {
                isAdmin: false,
                isUserLoggedIn: false,
                token: false
            }
        });

    } catch (error) {
        console.log('Reset_HomeState fetch error - ' + error);
    }
};