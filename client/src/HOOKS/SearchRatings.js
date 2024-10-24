import { GetCategoryName } from "./GetCategoryName";

export const SearchRatings = (searchValue, RatingProducts, setRatingProducts) => {

    searchValue = isNaN(searchValue) ? String(GetCategoryName(searchValue).toLowerCase().trim()) : String(searchValue);
    setRatingProducts((prev) => ({
        ...prev,
        RatingProductsMain: prev.searchRatingProduct.map((item) => ({ ...item, point: 0 }))
    }));

    RatingProducts.RatingProductsMain.forEach((item, index) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            const valueStr = isNaN(value) ? GetCategoryName(value).toLowerCase() : String(value);
            if (key !== 'point') {
                totalPoint += valueStr.includes(searchValue) ? 1 : 0;
                totalPoint += valueStr === searchValue ? 10 : 0;
            }
        });

        setRatingProducts((prev) => ({
            ...prev,
            RatingProductsMain: prev.RatingProductsMain.map((item_, index_) => index === index_ ? { ...item_, point: totalPoint } : item_)
        }));
    });

    setRatingProducts((prev) => ({
        ...prev,
        RatingProductsMain: prev.RatingProductsMain.sort((a, b) => b.point - a.point)
    }));

    setRatingProducts((prev) => ({
        ...prev,
        RatingProductsMain: prev.RatingProductsMain.filter(item =>
            String(item.product_id).toLowerCase().includes(searchValue) ||
            String(GetCategoryName(item.main_category)).toLowerCase().includes(searchValue.toLowerCase()) ||
            String(item.no_of_rating).toLowerCase().includes(searchValue.toLowerCase()) ||
            String(Number(item.rating_stars).toFixed(2)).toLowerCase().includes(searchValue) ||
            String(item.status).toLowerCase().includes(searchValue.toLowerCase())
        )
    }));
};
