import { GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, UPDATE_USER, UPDATE_USER_SUCCESS } from "./ActionType"

const initialState = {
    user: null,
    error: null,
    isLoading: false,
    token: null
}

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case GET_USER:
        case UPDATE_USER:
            return {
                ...state,
                isLoading: true,
                error: null,
                token: null,
                user: null
            }
        case LOGIN_SUCCESS:
        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload,
            }
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:


            return {
                ...initialState,
                error: action.payload
            }
            case "LOGOUT":
                return {
                    ...initialState
                }
        default:
            return state;
    }
}