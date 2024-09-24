import { GetCategoryName } from './GetCategoryName';
const getStock = (item) => {
    return Number(item.quantity) <= 0 ? 'out of stock' : Number(item.reserved) > Number(item.quantity) ? 'low stock' : 'in stock';
}

export const SearchProduction = (searchValue, products, setProductsData) => {
    setProductsData(products.map((item) => ({ ...item, point: 0 })));
    products.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'incoming' && key !== 'reserved' && key !== 'quantity') {
                if (key === 'type' || key === 'vendor') {
                    totalPoint += GetCategoryName(value).toLowerCase().includes(searchValue.toLowerCase()) ? 1 : 0;
                }
                if (key === 'id') {
                    totalPoint += String(value).includes(searchValue.trim()) ? 1 : 0;
                }
            }
        });

        setProductsData((prev) => prev.map((item_, index_) => index === index_ ? { ...item_, point: totalPoint } : item_));
    });

    setProductsData((prev) => prev.sort((a, b) => b.point - a.point));

    setProductsData((prev) => prev.filter(item =>
        String(item.name).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(item.id).toLowerCase().includes(searchValue.toLowerCase()) ||
        String(GetCategoryName(item.type)).toLowerCase().includes(searchValue.toLowerCase()) ||
        getStock(item).includes(searchValue.toLowerCase()) ||
        String(item.vendor).toLowerCase().includes(searchValue.toLowerCase())
    ));
}
