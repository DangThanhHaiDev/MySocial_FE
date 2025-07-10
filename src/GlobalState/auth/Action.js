import axiosInstance from "../../AppConfig/axiosConfig"
import { GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, UPDATE_USER, UPDATE_USER_FAILURE, UPDATE_USER_SUCCESS } from "./ActionType"

export const login = (request) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST })
    try {
        const response = await axiosInstance.post("/auth/login", { email: request.email, password: request.password })
        const { data } = response
        if (data.status === 200) {
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("token", data.token)
            dispatch({ type: LOGIN_SUCCESS, payload: data.user })
        }

    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error.response.data.message })
    }
}

export const getUserByJwt = (navigate) => async (dispatch) => {
    dispatch({ type: GET_USER })

    try {
        const response = await axiosInstance.get("/api/users")
        const { data } = response
        if (data.status === 200) {
            localStorage.setItem("user", JSON.stringify(data.data.user))
            localStorage.setItem("token", data.data.token)
            dispatch({ type: GET_USER_SUCCESS, payload: data.data.user })
        }

    } catch (error) {
        dispatch({ type: GET_USER_FAILURE, payload: error.response.data.message })
        navigate("/login")
    }
}

export const updateUser = (request) => async (dispatch) => {
    dispatch({ type: UPDATE_USER })

    try {
        const response = await axiosInstance.put("/api/users", request)
        const { data } = response
        localStorage.setItem("user", JSON.stringify(data))
        
        dispatch({ type: UPDATE_USER_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: UPDATE_USER_FAILURE, payload: error.response.data.message })
    }
}

export const logout = ()=>(dispatch)=>{
    dispatch({type:"LOGOUT"})
    
}