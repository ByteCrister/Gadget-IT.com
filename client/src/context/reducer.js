
const reducer = (state, action) => {

    switch (action.type) {

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
            console.log('from reducer is Admin - ' + action.payload.isAdmin + ' is logIn - ' + action.payload.isUserLoggedIn + ' userId - ' + action.payload.UserID);
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