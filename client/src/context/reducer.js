
const reducer = (state, action) => {

    switch (action.type) {

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