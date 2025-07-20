import { NavLink } from "react-router-dom";

const AdminNav = () => {
  return (
    <nav className="h-full w-56 bg-white border-r flex flex-col py-6 px-2 shadow-sm">
      <div className="mb-8 text-2xl font-bold text-blue-600 text-center">Admin Panel</div>
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `block px-4 py-3 rounded-lg mb-2 font-medium transition-colors ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
        }
      >
        Quản lý tài khoản
      </NavLink>
      <NavLink
        to="/admin/reports"
        className={({ isActive }) =>
          `block px-4 py-3 rounded-lg mb-2 font-medium transition-colors ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
        }
      >
        Quản lý vi phạm
      </NavLink>
    </nav>
  );
};

export default AdminNav; 