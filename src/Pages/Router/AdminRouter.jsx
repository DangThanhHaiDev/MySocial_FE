import { Routes, Route, Navigate } from "react-router-dom";
import AdminNav from "../../Components/Admin/AdminNav/AdminNav";
import UserManagement from "../../Components/Admin/UserManagement/UserManagement";
import ReportManagement from "../../Components/Admin/ReportManagement/ReportManagement";

const AdminRouter = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <div className="flex-1">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="*" element={<Navigate to="users" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRouter;
