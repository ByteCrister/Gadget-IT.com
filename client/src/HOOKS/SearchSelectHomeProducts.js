import { GetCategoryName } from './GetCategoryName';

export const SearchSelectHomeProducts = (searchValue, products, setProductsData, GetSerialNo) => {
    searchValue = isNaN(searchValue) ? GetCategoryName(searchValue).toLowerCase() : String(searchValue);
    setProductsData(products.map((item) => ({ ...item, point: 0 })));
    products.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'incoming' && key !== 'reserved' && key !== 'quantity' && key !== 'cut_price' && key !== 'price' && key !== 'vendor') {
                totalPoint += String((value)).includes(searchValue) || String(GetSerialNo(item.id)).includes(searchValue) ? 1 : 0;
                totalPoint += String(value) === searchValue.trim().toLowerCase() || String(GetSerialNo(item.id)) === searchValue ? 10 : 0;
            }
        });

        setProductsData((prev) => prev.map((item_, index_) => index === index_ ? { ...item_, point: totalPoint } : item_));
    });

    setProductsData((prev) => prev.sort((a, b) => b.point - a.point));
    setProductsData((prev) => prev.filter(item =>
        String(item.name).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.id).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(GetCategoryName(item.type)).toLowerCase().includes(searchValue.toLowerCase()) ||
        searchValue.includes(String(GetSerialNo(item.id)))
    ));
}