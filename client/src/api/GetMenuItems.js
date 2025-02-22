import axios from 'axios';

const generateId = (title) => title.toLowerCase().replace(/\s+/g, '-');

export const GetMenuItems = async (dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/category/menu/items`);

      const data =  response.data;
      if (Array.isArray(data)) {
        const updatedData = data.map(item => ({
          ...item,
          id: generateId(item.title),
          nested: item.nested ? item.nested.map(subItem => ({
            ...subItem,
            id: generateId(subItem.title),
          })) : [],
        }));
        // console.log('Fetched menu items:', updatedData);
        dispatch({ type: 'set_categories', payload: updatedData });
      } else {
        throw new Error('Fetched data is not an array');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      dispatch({ type: 'toggle_loading', payload: false });
    }
  };
