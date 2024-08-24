import axios from "axios";

export const Api_Production = async(dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/get/production');
        dispatch({ type: 'set_production_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api_Production fetch error - ' + error);

    }
};
