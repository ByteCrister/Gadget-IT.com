import { GetCategoryName } from "./GetCategoryName";

export const SearchInventory = (searchedProduct, products, setProductsData) => {


    setProductsData(products.map((item) => ({ ...item, point: 0 })));
    products.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'point' && key !== 'hide') {
                if (key === 'category') {
                    totalPoint += GetCategoryName(value).toLowerCase().includes(searchedProduct.toLowerCase()) ? 1 : 0;
                }

                if (key === 'incoming' || key === 'reserved' || key === 'quantity' || key === 'price' || key === 'id') {
                    totalPoint += String(value).includes(searchedProduct) ? 1 : 0;
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



// setProductsData((prev) =>
//     prev.map((item_, index_) => {
//         if (index_ === index) {
//             let plusPoint = 0;
//             if (typeof item_[key] === 'string' && key !== 'point' && key !== 'hide') {
//                 if (key === 'category') {
//                     plusPoint = GetCategoryName(item_[key]).toLowerCase().includes(searchedProduct.toLowerCase()) === true ? plusPoint + 1 : plusPoint;
//                 }

//                 if (key === 'incoming' || key === 'reserved' || key === 'quantity' || key === 'price' || key === 'id') {
//                     plusPoint = String(item_[key]).includes(searchedProduct) === true ? plusPoint + 1 : plusPoint;
//                 }
//             }
//             return {
//                 ...item_,
//                 point: plusPoint
//             };
//         }
//         return item_;
//     })
// );