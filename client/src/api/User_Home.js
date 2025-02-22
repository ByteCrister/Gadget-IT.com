import axios from "axios";

export const User_Home = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/home`);
        dispatch({ type: 'set_user_home_contents_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('User_Home fetch error - ' + error);

    }
}
