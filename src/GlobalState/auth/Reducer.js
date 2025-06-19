import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./ActionType"

const initialState = {
    user: null,
    error: null,
    isLoading: false,
    token: null
}

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
                token: null,
                user: null
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload,
            }
        case LOGIN_FAILURE:
            return {
                ...initialState,
                error: action.payload
            }
        default:
            return state;
    }
}