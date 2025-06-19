import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Router from "./Router";
import AuthRouter from "./AuthRouter";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const user = useSelector(state => state.auth.user)
    
    useEffect(()=>{
        if(user){
            setIsLoggedIn(true)
        }
        else{
            setIsLoggedIn(false)
        }
    }, [user])
    return (
        <Routes>
            {isLoggedIn ? (
                <Route path="/*" element={<Router  />} />
            ) : (
                <Route path="/*" element={<AuthRouter />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRouter;
