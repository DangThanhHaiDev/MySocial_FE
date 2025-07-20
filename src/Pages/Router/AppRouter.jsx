import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Router from "./Router";
import AuthRouter from "./AuthRouter";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import AdminRouter from "./AdminRouter";
import { getUserByJwt } from "../../GlobalState/auth/Action";

const AppRouter = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "";
  const isLoggedIn = !!token && !!user;

  // Khi có token mà chưa có user, tự động lấy lại user từ token
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserByJwt());
    }
  }, [token, user, dispatch]);

  if (!isLoggedIn) {
    // Chưa đăng nhập: chỉ cho vào AuthRouter
    return (
      <Routes>
        <Route path="*" element={<AuthRouter />} />
      </Routes>
    );
  }

  if (role === "ADMIN") {
    // Nếu đang ở /login mà là admin, chuyển hướng sang /admin/users
    if (location.pathname === "/login") {
      return <Navigate to="/admin/users" replace />;
    }
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    );
  }

  if (role === "CUSTOMER") {
    // Nếu đang ở /login mà là user thường, chuyển hướng sang /
    if (location.pathname === "/login") {
      return <Navigate to="/" replace />;
    }
    return (
      <Routes>
        <Route path="/*" element={<Router />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Trường hợp không xác định role
  return <Navigate to="/login" />;
};

export default AppRouter;
