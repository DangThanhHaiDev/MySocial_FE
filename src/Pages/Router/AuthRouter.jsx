import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../../Components/Auth/Login/Login"
import Register from "../../Components/Auth/Register/Register"

const AuthRouter = ()=>{

    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
            </Routes>
        </div>
    )
}

export default AuthRouter