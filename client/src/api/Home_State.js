import axios from 'axios'

export const Home_State = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/', { withCredentials: true });
        console.log(response.data);
        dispatch({
            type: 'set_home_view', payload: {
                isAdmin: response.data.isAdmin === "true" || response.data.isAdmin === true,
                isUserLoggedIn: response.data.isLogged === "true" || response.data.isLogged === true,
                token: response.data.token
            }
        });

    } catch (error) {
        console.log('Home_State fetch error - ' + error);
    }
};