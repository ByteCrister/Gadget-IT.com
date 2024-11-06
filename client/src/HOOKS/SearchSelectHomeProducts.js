import { GetCategoryName } from './GetCategoryName';

export const SearchSelectHomeProducts = (searchValue, products, setProductsData) => {
    setProductsData(products.map((item) => ({ ...item, point: 0 })));
    products.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'incoming' && key !== 'reserved' && key !== 'quantity' && key !== 'cut_price' && key !== 'price' && key !== 'vendor') {
                if (key === 'type' || key === 'name') {
                    totalPoint += String(GetCategoryName(value).toLowerCase()).includes(searchValue.toLowerCase()) ? 1 : 0;
                    totalPoint += String(GetCategoryName(value).toLowerCase()) === searchValue.toLowerCase() ? 10 : 0;
                }
                if (key === 'id' || key === 'serial_no') {
                    totalPoint += String(value).includes(searchValue.trim()) ? 1 : 0;
                    totalPoint += String(value) === searchValue.trim().toLowerCase() ? 10 : 0;
                }
            }
        });

        setProductsData((prev) => prev.map((item_, index_) => index === index_ ? { ...item_, point: totalPoint } : item_));
    });

    setProductsData((prev) => prev.sort((a, b) => b.point - a.point));
    setProductsData((prev) => prev.filter(item =>
        String(item.name).trim().toLowerCase().includes(searchValue.trim().toLowerCase()) ||
        String(item.id).toLowerCase().trim().includes(searchValue.trim().toLowerCase()) ||
        String(GetCategoryName(item.type)).trim().toLowerCase().includes(searchValue.trim().toLowerCase())
    ));
}