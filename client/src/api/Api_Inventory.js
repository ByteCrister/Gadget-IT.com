import axios from "axios";

export const Api_Inventory = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/inventory`);
        dispatch({ type: 'set_inventory_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api_Inventory fetch error - ' + error);

    }
}
