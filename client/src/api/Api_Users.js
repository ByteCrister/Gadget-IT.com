import axios from "axios";

export const Api_Users = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/get/users-page');
        dispatch({ type: 'set_users_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api users page fetch error - ' + error);

    }
};
