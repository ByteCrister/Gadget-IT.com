import axios from "axios";

export const Api_Outer_Page = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/get/outer-page-information');
        dispatch({ type: 'set_outer_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api Api Outer_Page fetch error - ' + error);

    }
};
