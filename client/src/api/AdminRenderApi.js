import axios from 'axios'

export const AdminRenderApi = async ( dispatch ) => {
    try {
        dispatch({ type: 'toggle_loading', payload: true });
        const response = await axios.get('http://localhost:7000/products/categoryNames');
        dispatch({ type: 'set_products_render', payload: { categoryName: response.data.categoryName, subCategoryName: response.data.subCategoryName, initialMandatoryColumns:response.data.initialMandatoryColumns } });
        dispatch({ type: 'toggle_loading', payload: false });

    } catch (error) {
        dispatch({ type: 'toggle_loading', payload: false });
        console.log('Product render fetch error - ' + error);

    }

}

