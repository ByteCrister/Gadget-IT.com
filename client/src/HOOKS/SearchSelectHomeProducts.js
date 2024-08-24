import { GetCategoryName } from './GetCategoryName';

export const SearchSelectHomeProducts = (searchValue, products, setProductsData) => {
    setProductsData(products.filter(item =>
        String(item.name).trim().toLowerCase().replace(' ', '').includes(searchValue.trim().toLowerCase().replace(' ', '')) ||
        String(item.id).toLowerCase().includes(searchValue.trim().toLowerCase()) ||
        String(GetCategoryName(item.type)).trim().replace(' ', '').toLowerCase().includes(searchValue.trim().toLowerCase().replace(' ', ''))
    ));
}