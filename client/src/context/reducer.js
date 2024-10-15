const addRecent = (CurrProduct, RecentProducts) => {
    try {
        const isExist = RecentProducts.some((product) => product.id === CurrProduct.id);

        if (isExist) {
            const updatedRecentProducts = RecentProducts.filter(product => product.id !== CurrProduct.id);
            updatedRecentProducts.unshift(CurrProduct);
            window.localStorage.setItem('RecentProducts', JSON.stringify(updatedRecentProducts));
            return updatedRecentProducts;
        }

        if (RecentProducts.length >= 10) {
            RecentProducts.pop();
        }

        RecentProducts.unshift(CurrProduct);
        window.localStorage.setItem('RecentProducts', JSON.stringify(RecentProducts));

        return RecentProducts;
    } catch (error) {
        console.error("Error with localStorage:", error);
        return RecentProducts;
    }
};


const addProductToCart = (ProductStorage, product_id) => {
    // console.log(ProductStorage);
    const initialProducts = window.localStorage.getItem('CartStorage') ? JSON.parse(window.localStorage.getItem('CartStorage')) : [];
    const productExists = initialProducts.some(product => product.product_id === product_id);

    if (productExists) return [...initialProducts];

    for (let i = 0; i < ProductStorage.product_table.length; i++) {
        ProductStorage.product_table[i].table_products.forEach((product) => {
            if (product.product_id === product_id) {
                initialProducts.push({ ...product, quantity: 1 });
                window.localStorage.setItem('CartStorage', JSON.stringify(initialProducts));
                return [...initialProducts];
            }
        });
    }
    return [...initialProducts];
};

const removeProductFromCart = (product_id) => {
    const initialProducts = window.localStorage.getItem('CartStorage') ? JSON.parse(window.localStorage.getItem('CartStorage')) : [];
    if (initialProducts && initialProducts.length !== 0) {
        window.localStorage.setItem('CartStorage', JSON.stringify([...initialProducts.filter((product) => product.product_id !== product_id)]));
        return [...initialProducts.filter((product) => product.product_id !== product_id)];
    }

};


const reducer = (state, action) => {

    switch (action.type) {

        case 'update_product_from_cart':
            return {
                ...state,
                CartStorage: action.payload
            }

        case 'remove_product_from_cart':
            return {
                ...state,
                CartStorage: removeProductFromCart(action.payload)
            }

        case 'add_product_to_cart':
            return {
                ...state,
                CartStorage: addProductToCart(state.productStorage, action.payload)
            }

        case 'set_recent_product':
            return {
                ...state,
                RecentProducts: addRecent(action.payload, state.RecentProducts),
            };


        case 'set_path_setting':
            return {
                ...state,
                pathSettings: { prevPath: action.payload.prevPath, currPath: action.payload.currPath }
            }

        case 'set_user_products':
            return {
                ...state,
                productStorage: action.payload
            }

        case 'set_user_home_contents_page':
            return {
                ...state,
                UserHomeContents: action.payload
            }

        case 'set_setting_page':
            return {
                ...state,
                Setting_Page: action.payload
            }

        case 'set_inventory_page':
            return {
                ...state,
                Inventory_Page: action.payload
            }

        case 'set_production_page':
            return {
                ...state,
                Production_Page: action.payload
            }

        case 'set_categories':
            return {
                ...state,
                menuItems: action.payload
            }

        case 'set_products_render':
            return {
                ...state,
                categoryName: action.payload.categoryName,
                subCategoryName: action.payload.subCategoryName
            }

        case 'set_home_view':
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
                isUserLoggedIn: action.payload.isUserLoggedIn,
                token: action.payload.token
            }

        case 'toggle_loading':
            return {
                ...state,
                isLoading: action.payload
            }
        case 'toggle_isError':
            return {
                ...state,
                isError: action.payload
            }
        case 'toggle_isServerIssue':
            return {
                ...state,
                isServerIssue: action.payload
            }

        case 'admin_loggedIn':
            return {
                ...state,
                isAdmin: true,
                isUserLoggedIn: false,
                UserID: null
            }

        case 'user_loggedIn':
            return {
                ...state,
                isAdmin: false,
                isUserLoggedIn: true,
                UserID: action.payload
            }

        case 'logOut':
            return {
                ...state,
                isAdmin: false,
                isUserLoggedIn: false,
                UserID: null
            }


        default:
            return state
    }
}

export default reducer