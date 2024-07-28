
const reducer = (state, action) => {

    switch (action.type) {


        case 'set_categories':
            return {
                ...state,
                menuItems: action.payload
            }

        case 'set_products_render' :
           return {
                ...state,
                categoryName: action.payload.categoryName,
                subCategoryName : action.payload.subCategoryName
            }

        case 'set_home_view':
            console.log('from reducer is Admin - '+action.payload.isAdmin + ' is logIn - '+action.payload.isUserLoggedIn + ' userId - '+action.payload.UserID);
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
                UserID: action.payload.UserID,
                isUserLoggedIn: action.payload.isUserLoggedIn

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