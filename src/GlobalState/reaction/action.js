import axiosInstance from "../../AppConfig/axiosConfig"

export const getAllReaction = ()=>async(dispatch)=>{
    try {
        const response = await axiosInstance.get('/api/reactions')
        dispatch({type:"GET_REACTION_SUCCESS" ,payload: response.data})        
    } catch (error) {
    }
}