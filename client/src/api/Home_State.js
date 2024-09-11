import axios from 'axios'

export const Home_State = async (dispatch, token) => {
    console.log(token);
    try {
        const response = await axios.get('http://localhost:7000/', {
            headers: {
              Authorization: token
            }
          });
        console.log(response.data);
        dispatch({
            type: 'set_home_view', payload: {
                isAdmin: response.data.isAdmin === "true" || response.data.isAdmin === true,
                isUserLoggedIn: response.data.isLogged === "true" || response.data.isLogged === true,
                token: response.data.token
            }
        });

    } catch (error) {
        if (error.response) {
            console.log('Response Error:', error.response.status, error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
};