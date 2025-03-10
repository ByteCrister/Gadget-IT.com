import axios from 'axios';

export const Api_Support = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/product/support`);
        dispatch({ type: 'set_support_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api_support fetch error - ' + error);

    }
}
