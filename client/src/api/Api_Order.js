import axios from "axios";

export const Api_Order = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/order-page`);
        dispatch({ type: 'set_order_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api order page fetch error - ' + error);

    }
};