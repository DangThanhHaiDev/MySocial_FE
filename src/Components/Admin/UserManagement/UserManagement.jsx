import { useEffect, useState } from "react";
import axiosInstance from "../../../AppConfig/axiosConfig";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showBannedOnly, setShowBannedOnly] = useState(false);

  useEffect(() => {
    fetchUsers(page, size, showBannedOnly);
    // eslint-disable-next-line
  }, [page, size, showBannedOnly]);

  const fetchUsers = async (page, size, bannedOnly) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `/api/admin/users?page=${page}&size=${size}`;
      if (bannedOnly) {
        url += `&status=BANNED`;
      }
      const res = await axiosInstance.get(url, {
        headers: { Authorization: token },
      });
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setUsers([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn khóa tài khoản này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/api/admin/users/${userId}/ban`, {}, {
        headers: { Authorization: token },
      });
      fetchUsers(page, size, showBannedOnly);
    } catch (err) {
      alert("Khóa tài khoản thất bại!");
    }
  };

  const handleUnbanUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/api/admin/users/${userId}/unban`, {}, {
        headers: { Authorization: token },
      });
      fetchUsers(page, size, showBannedOnly);
    } catch (err) {
      alert("Mở khóa tài khoản thất bại!");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Quản lý tài khoản</h2>
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${!showBannedOnly ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => { setShowBannedOnly(false); setPage(0); }}
        >
          Tất cả tài khoản
        </button>
        <button
          className={`px-4 py-2 rounded ${showBannedOnly ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => { setShowBannedOnly(true); setPage(0); }}
        >
          Tài khoản đã khóa
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Họ tên</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Trạng thái</th>
                  <th className="py-2 px-4 border">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">Không có tài khoản nào.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 border">{user.id}</td>
                      <td className="py-2 px-4 border">{user.email}</td>
                      <td className="py-2 px-4 border">{user.firstName} {user.lastName}</td>
                      <td className="py-2 px-4 border">{user.role}</td>
                      <td className="py-2 px-4 border">{user.status}</td>
                      <td className="py-2 px-4 border">
                        {user.status !== "BANNED" && (
                          <button
                            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleBanUser(user.id)}
                          >
                            Khóa
                          </button>
                        )}
                        {user.status === "BANNED" && (
                          <button
                            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                            onClick={() => handleUnbanUser(user.id)}
                          >
                            Mở khóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Phân trang */}
            <div className="flex items-center justify-between mt-4">
              <div>
                Trang {page + 1} / {totalPages} (Tổng: {totalElements})
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  Trước
                </button>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 