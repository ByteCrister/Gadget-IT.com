import axios from "axios";

export const Api_Production = async(dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/production`);
        dispatch({ type: 'set_production_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api_Production fetch error - ' + error);

    }
};
