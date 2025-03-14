import axios from "axios";

export const Api_Users = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/users-page`);
        dispatch({ type: 'set_users_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api users page fetch error - ' + error);

    }
};
