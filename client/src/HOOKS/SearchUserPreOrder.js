export const SearchUserPreOrder = (searchedItem, productStore, setPreOrders) => {
    searchedItem = String(searchedItem);

    let Updated = productStore.map((item) => ({ ...item, point: 0 }));
    productStore.forEach((item) => {
        let totalPoint = 0;
        Object.entries(item).forEach(([key, value]) => {
            if (key === 'product_name' || key === 'name' || key === 'phone_no' || key === 'email' || key === 'address') {
                totalPoint += String(value).includes(searchedItem) ? 1 : 0;
                totalPoint += String(value) === searchedItem ? 10 : 0;
            }
        });
        Updated = Updated.map((item_) => {
            return item_.preorder_no === item.preorder_no ? { ...item_, point: totalPoint }
                : item_
        });
    });

    Updated = Updated.filter((item) => {
        return String(item.product_name).includes(searchedItem) ||
            String(item.name).includes(searchedItem) ||
            String(item.phone_no).includes(searchedItem) ||
            String(item.email).includes(searchedItem) ||
            String(item.address).includes(searchedItem)
    });

    Updated = Updated.sort((a, b) => b.point - a.point);
    setPreOrders((prev) => ({
        ...prev,
        PreOrderMain: [...Updated]
    }));
};