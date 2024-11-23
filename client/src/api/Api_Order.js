import axios from "axios";

export const Api_Order = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/get/order-page');
        dispatch({ type: 'set_order_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api order page fetch error - ' + error);

    }
};