import axios from "axios";

export const Api_Report = async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get/report`);
        dispatch({ type: 'set_report_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api report page fetch error - ' + error);

    }
};
