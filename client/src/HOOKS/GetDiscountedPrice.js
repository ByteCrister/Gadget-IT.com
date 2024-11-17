const GetDiscountedPrice = (price, type, discount) => {
    const DiscountedPrice = type === 'percentage' ? price - (price * (discount / 100)) : price - discount;
    // console.log(price+" "+type+" "+discount+" "+Math.round(DiscountedPrice));
    return Math.round(DiscountedPrice);
};

export default GetDiscountedPrice;