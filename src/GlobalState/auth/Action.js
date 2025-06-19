import axiosInstance from "../../AppConfig/axiosConfig"
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./ActionType"

export const login = (request)=>async(dispatch)=>{
    dispatch({type: LOGIN_REQUEST})
    try {
            const response = await axiosInstance.post("/auth/login", { email:request.email, password:request.password })
            const {data} = response
            if(data.status === 200){
                localStorage.setItem("token", data.token)
                dispatch({type: LOGIN_SUCCESS, payload: data.user})
            }            
        } catch (error) {
            dispatch({type: LOGIN_FAILURE,payload:error.response.data.message})
        }
}