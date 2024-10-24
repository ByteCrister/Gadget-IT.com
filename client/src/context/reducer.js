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


const initializeCart = (productStorage, payload, CartStorage) => {
    let initialCartProduct = [...CartStorage];
    let allProducts = [];
    productStorage.product_table.forEach((table) => {
        table.table_products.forEach((product) => {
            allProducts.push(product);
        });
    });

    payload.forEach((cart) => {
        const product = allProducts.find((product_) => Number(product_.product_id) === Number(cart.product_id));
        if (Number(cart.product_id) === Number(product.product_id)) {
            const productPrice = productStorage.product_prices.find((product_) => Number(product_.product_id) === Number(cart.product_id))?.price;
            initialCartProduct.push({ ...cart, image: product.image, product_name: product.product_name, brand: product.brand, price: productPrice });
        }
    });
    return [...initialCartProduct];
};

const addProductToCart = (ProductStorage, product_id, CartStorage) => {
    console.log(`Product ID : ${product_id} added to cart.`);
    let allProducts = [];
    const initialProducts = window.localStorage.getItem('CartStorage') ? JSON.parse(window.localStorage.getItem('CartStorage')) : [];
    const productExists = initialProducts.some(product => product.product_id === product_id);

    if (productExists) return [...CartStorage];

    ProductStorage.product_table.forEach((table) => {
        table.table_products.forEach((product) => {
            allProducts.push(product);
        });
    });

    allProducts.forEach((product) => {
        if (Number(product.product_id) === Number(product_id)) {
            const productPrice = ProductStorage.product_prices.find((product_) => product_.product_id === product.product_id)?.price;
            initialProducts.unshift({ product_id: product_id, quantity: 1 });
            window.localStorage.setItem('CartStorage', JSON.stringify(initialProducts));
            CartStorage.unshift({ product_id: product_id, quantity: 1, image: product.image, product_name: product.product_name, brand: product.brand, price: productPrice });
            return [...CartStorage];
        }
    });
    return [...CartStorage];
};

const removeProductFromCart = (product_id, CartStorage) => {
    const initialProducts = window.localStorage.getItem('CartStorage') ? JSON.parse(window.localStorage.getItem('CartStorage')) : [];
    if (initialProducts && initialProducts.length !== 0) {
        window.localStorage.setItem('CartStorage', JSON.stringify([...initialProducts.filter((product) => product.product_id !== product_id)]));
        return [...CartStorage.filter((product) => product.product_id !== product_id)];
    }

};


const reducer = (state, action) => {

    switch (action.type) {

        case 'update_product_from_cart':
            return {
                ...state,
                CartStorage: action.payload
            }

        case 'initialize_cart':
            return {
                ...state,
                CartStorage: initializeCart(state.productStorage, action.payload, state.CartStorage)
            }

        case 'add_product_to_cart':
            return {
                ...state,
                CartStorage: addProductToCart(state.productStorage, action.payload, state.CartStorage)
            }

        case 'remove_product_from_cart':
            return {
                ...state,
                CartStorage: removeProductFromCart(action.payload, state.CartStorage)
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

        case 'delete_answer':
            return {
                ...state,
                Support_Page: {
                    ...state.Support_Page,
                    questions: state.Support_Page.questions.filter((question) => question.question_no !== action.payload)
                }
            }

        case 'set_new_answer':
            return {
                ...state,
                Support_Page: {
                    ...state.Support_Page,
                    questions: state.Support_Page.questions.map((question) => question.question_no === action.payload.questionNo ? { ...question, answer: action.payload.answer } : question)
                }
            }

        case 'set_support_page':
            return {
                ...state,
                Support_Page: action.payload
            }

        case 'set_select_offer_products':
            return {
                ...state,
                Setting_Page: {
                    ...state.Setting_Page,
                    offer_carts_products: action.payload
                }
            }

        case 'set_new_offer_carts':
            return {
                ...state,
                Setting_Page: {
                    ...state.Setting_Page,
                    offer_carts: action.payload
                }
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