import { GetCategoryName } from './GetCategoryName';

export const SearchProduction = (searchValue, products, setProductsData) => {
    setProductsData(products.filter(item =>
        String(item.name).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.id).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(GetCategoryName(item.type)).toLowerCase().includes(searchValue.toLowerCase()) ||
        Number(item.quantity) <= 0 ? 'out of stock' :  Number(item.reserved) > Number(item.quantity) ? 'low stock' : 'in stock'.includes(searchValue.toLowerCase()) ||
        String(item.vendor).toLowerCase().includes(searchValue.toLowerCase())
    ));
}
