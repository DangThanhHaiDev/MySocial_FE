import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Router from "./Router";
import AuthRouter from "./AuthRouter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserByJwt } from "../../GlobalState/auth/Action";
import axiosInstance from "../../AppConfig/axiosConfig";

const AppRouter = () => {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(()=>{

  }, [])

  const getUser = async () => {
    try {
      if (!localStorage.getItem("token")) {
        setIsLoggedIn(false);
        return
      }
      await axiosInstance.get("/api/users");
      setIsLoggedIn(true);
    } catch (error) {
      localStorage.clear();
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (token) {
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);
  return (
    <Routes>
      {isLoggedIn ? (
        <Route path="/*" element={<Router />} />
      ) : (
        <Route path="/*" element={<AuthRouter />} />
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
