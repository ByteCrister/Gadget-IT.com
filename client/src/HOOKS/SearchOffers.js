import { DisplayBangladeshTime } from "./DisplayBangladeshTime";
import { GetCategoryName } from "./GetCategoryName"

export const SearchOffers = (searchValue, offerCarts, dataStateOffers, setOfferCarts) => {
    if (!searchValue) {
        setOfferCarts((prev) => ({
            ...prev,
            MainOfferCarts: [...dataStateOffers]
        }));
        return;
    }

    searchValue = isNaN(searchValue) ? String(GetCategoryName(searchValue).toLowerCase()) : String(searchValue);

    setOfferCarts((prev) => ({
        ...prev,
        MainOfferCarts: dataStateOffers.map((offer) => ({ ...offer, point: 0 }))
    }));


    offerCarts.MainOfferCarts.forEach((offer) => {
        let totalPoint = 0;
        Object.entries(offer).forEach(([key, value]) => {
            if (key !== 'point' && key !== 'cart_image') {
                totalPoint += String(value).toLowerCase().includes(searchValue) ? 1 : 0;
                totalPoint += String(value).toLowerCase() === searchValue ? 10 : 0;
            }
        });
        setOfferCarts((prev) => ({
            ...prev,
            MainOfferCarts: prev.MainOfferCarts.map((offer_) => offer_.cart_no === offer.cart_no ? { ...offer_, point: totalPoint } : offer_)
        }));
    });

    setOfferCarts((prev) => ({
        ...prev,
        MainOfferCarts: prev.MainOfferCarts.sort((a, b) => b.point - a.point)
    }));

    setOfferCarts((prev) => ({
        ...prev,
        MainOfferCarts: prev.MainOfferCarts.filter((offer) =>
            offer.cart_title.toLowerCase().includes(searchValue) ||
            offer.cart_description.toLowerCase().includes(searchValue) ||
            String(DisplayBangladeshTime(offer.offer_start)).includes(searchValue) ||
            String(DisplayBangladeshTime(offer.offer_end)).includes(searchValue))
    }));

    console.log(offerCarts.MainOfferCarts);
};