import { GetCategoryName } from "./GetCategoryName";

export const SearchInventory = (searchValue, products, setProductsData) => {
    setProductsData(products.filter(item =>
        String(item.p_name).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.id).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(GetCategoryName(item.category)).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.incoming).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.reserved).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.quantity).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.price).toLowerCase().includes(searchValue.toLowerCase())
    ));
};
