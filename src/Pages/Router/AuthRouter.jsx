import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../../Components/Auth/Login/Login"

const AuthRouter = ()=>{
    
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </div>
    )
}

export default AuthRouter