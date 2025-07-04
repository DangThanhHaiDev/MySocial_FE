import { Navigate, Route, Routes } from "react-router-dom";
import Router from "./Router";
import AuthRouter from "./AuthRouter";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const AppRouter = () => {
    const token = localStorage.getItem("token")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const user = useSelector(state => state.auth.user)
    
    useEffect(()=>{
        if(token){            
            if(token){
                setIsLoggedIn(true)
            }   
           
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
