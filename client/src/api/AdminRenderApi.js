import axios from 'axios'

export const AdminRenderApi = async ( dispatch ) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/categoryNames`);
        dispatch({ type: 'set_products_render', payload: { categoryName: response.data.categoryName, subCategoryName: response.data.subCategoryName, initialMandatoryColumns:response.data.initialMandatoryColumns } });
        

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Product render fetch error - ' + error);

    }

}

