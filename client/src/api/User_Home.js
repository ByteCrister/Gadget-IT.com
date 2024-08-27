import axios from "axios";

export const User_Home = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/user/home');
        dispatch({ type: 'set_user_home_contents_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('User_Home fetch error - ' + error);

    }
}