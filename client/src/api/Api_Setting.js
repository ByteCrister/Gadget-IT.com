import axios from "axios";

export const Api_Setting = async(dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/get/product/setting');
        dispatch({ type: 'set_setting_page', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api_Production fetch error - ' + error);

    }
};
