import { GetCategoryName } from "./GetCategoryName";

export const SearchInventory = (searchedProduct, products, setProductsData) => {


    setProductsData(products.map((item) => ({ ...item, point: 0 })));
    products.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'point' && key !== 'hide') {
                if (key === 'category' || key === 'p_name') {
                    totalPoint += GetCategoryName(value).toLowerCase().includes(searchedProduct.toLowerCase()) ? 1 : 0;
                    totalPoint += GetCategoryName(value).toLowerCase() === searchedProduct.toLowerCase() ? 10 : 0;
                }

                if (key === 'incoming' || key === 'reserved' || key === 'quantity' || key === 'price' || key === 'id') {
                    totalPoint += String(value).includes(searchedProduct) ? 1 : 0;
                    totalPoint += String(value) === searchedProduct.trim() ? 10 : 0;
                }
            }
        });

        setProductsData((prev) => prev.map((item_, index_) => index === index_ ? { ...item_, point: totalPoint } : item_));
    });


    setProductsData((prev) => prev.sort((a, b) => b.point - a.point));

    setProductsData((prev) => prev.filter(item =>
        String(item.p_name).toLowerCase().includes(searchedProduct.toLowerCase()) ||
        String(item.id).toLowerCase().includes(searchedProduct.toLowerCase()) ||
        String(GetCategoryName(item.category)).toLowerCase().includes(searchedProduct.toLowerCase()) ||
        String(item.incoming).toLowerCase().includes(searchedProduct.toLowerCase()) ||
        String(item.reserved).toLowerCase().includes(searchedProduct.toLowerCase()) ||
        String(item.quantity).toLowerCase().includes(searchedProduct.toLowerCase()) ||
        String(item.price).toLowerCase().includes(searchedProduct.toLowerCase())
    ));
};