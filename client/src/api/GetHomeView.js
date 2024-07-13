import axios from 'axios';

export const GetHomeView = async (dispatch) => {
    dispatch({ type: 'toggle_loading', payload: true });

    await axios.get('http://localhost:7000/user/home/view')
        .then((res) => {
            console.log('API Response:', res.data);
            let userId = false;
            const isAdmin = res.data.isAdmin === "true" || res.data.isAdmin === true ;
            const isUserLoggedIn = res.data.isLogged === "true" || res.data.isLogged === true ;

            if (res.data.userId !== 'false') {
                userId = res.data.userId;
            }
            dispatch({ type: 'set_home_view', payload: { isAdmin: isAdmin, isUserLoggedIn: isUserLoggedIn, UserID: userId } })

            dispatch({ type: 'toggle_loading', payload: false });
        })
        .catch((error) => {
            console.error('Error fetching home view:', error);
            dispatch({ type: 'toggle_loading', payload: false });
        });
}
