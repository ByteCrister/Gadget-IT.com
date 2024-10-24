import { GetCategoryName } from "./GetCategoryName";

export const SearchOfferProducts = (searchedValue, offerProducts, setOfferProducts) => {
    searchedValue = isNaN(searchedValue) ? String(GetCategoryName(searchedValue.trim())).toLowerCase() : String(searchedValue);
    let Updated = [...offerProducts.ProductStorage.map((offer) => ({ ...offer, point: 0 }))];
    offerProducts.ProductStorage.forEach((offer) => {
        let totalPoint = 0;
        Object.entries(offer).forEach(([key, value]) => {
            if (key !== 'point') {
                totalPoint += String(value).toLowerCase().includes(searchedValue) ? 1 : 0;
                totalPoint += String(value).toLowerCase() === searchedValue ? 10 : 0;
            }
        });

        Updated = Updated.map((offer_) => offer_.product_id === offer.product_id ? { ...offer, point: totalPoint } : offer_);
    });


    Updated = Updated.filter((offer) => {
        return String(offer.product_id).includes(searchedValue) ||
            String(GetCategoryName(offer.name)).toLowerCase().includes(searchedValue) ||
            String(GetCategoryName(offer.category)).toLowerCase().includes(searchedValue) ||
            String(offer.serial_no).includes(searchedValue) ||
            String(offer.offer).includes(searchedValue)
    });

    Updated.sort((a, b) => b.point - a.point);

    setOfferProducts((prev) => ({
        ...prev,
        offerProductsMain: [...Updated]
    }));
};