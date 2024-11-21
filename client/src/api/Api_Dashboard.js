import axios from "axios";

export const Api_Dashboard = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/dashboard-information');
        dispatch({ type: 'set_dashboard_page', payload: await response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Api_Dashboard fetch error - ' + error);
    }
};