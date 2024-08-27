import axios from "axios";

export const User_Products = async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:7000/user/products');
        dispatch({ type: 'set_user_products', payload: response.data });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('User_Products fetch error - ' + error);

    }
}
