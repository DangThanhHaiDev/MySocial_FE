import { useEffect, useState } from "react";
import axiosInstance from "../../../AppConfig/axiosConfig";
import url from "../../../AppConfig/urlApp";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentDetail, setCommentDetail] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    fetchReports(page, size);
    // eslint-disable-next-line
  }, [page, size]);

  const fetchReports = async (page, size) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/admin/reports?page=${page}&size=${size}`, {
        headers: { Authorization: token },
      });
      setReports(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setReports([]);
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

  const handleViewPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/post/${postId}`, {
        headers: { Authorization: token },
      });
      setPostDetail(res.data);
      setShowPostModal(true);
    } catch (err) {
      alert("Không thể lấy chi tiết bài viết!");
    }
  };

  const handleViewComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/comment/${commentId}`, {
        headers: { Authorization: token },
      });
      setCommentDetail(res.data);
      setShowCommentModal(true);
    } catch (err) {
      alert("Không thể lấy chi tiết bình luận!");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Quản lý báo cáo</h2>
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Loại</th>
                  <th className="py-2 px-4 border">ID đối tượng</th>
                  <th className="py-2 px-4 border">Lý do</th>
                  <th className="py-2 px-4 border">Trạng thái</th>
                  <th className="py-2 px-4 border">Ngày tạo</th>
                  <th className="py-2 px-4 border">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4">Không có báo cáo nào.</td></tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 border">{report.id}</td>
                      <td className="py-2 px-4 border">{report.type}</td>
                      <td className="py-2 px-4 border">{report.targetId}</td>
                      <td className="py-2 px-4 border">{report.reason}</td>
                      <td className="py-2 px-4 border">{report.status}</td>
                      <td className="py-2 px-4 border">{report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}</td>
                      <td className="py-2 px-4 border">
                        {report.type === "POST" && (
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                            onClick={() => handleViewPost(report.targetId)}
                          >
                            Xem bài viết
                          </button>
                        )}
                        {report.type === "COMMENT" && (
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded"
                            onClick={() => handleViewComment(report.targetId)}
                          >
                            Xem bình luận
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
      {/* Modal xem chi tiết bài viết */}
      {showPostModal && postDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative animate-fade-in max-h-screen overflow-y-auto">
            {/* Nút đóng */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowPostModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={postDetail.user?.avatarUrl ? postDetail.user.avatarUrl : "/default-avt.jpg"}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <div className="font-semibold text-lg">{postDetail.user?.firstName} {postDetail.user?.lastName}</div>
                <div className="text-xs text-gray-500">{postDetail.createdAt ? new Date(postDetail.createdAt).toLocaleString() : ""}</div>
              </div>
            </div>
            {/* Nội dung */}
            <div className="mb-4">
              <div className="font-medium text-gray-800 mb-2">Nội dung:</div>
              <div className="text-gray-700 whitespace-pre-line">{postDetail.content}</div>
            </div>
            {/* Ảnh slider */}
            {postDetail.images && postDetail.images.length > 0 && (
              <ImageSlider images={postDetail.images} />
            )}
            {/* Footer */}
            <div className="flex justify-end">
              <button
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                onClick={() => setShowPostModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xem chi tiết bình luận */}
      {showCommentModal && commentDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-2">Chi tiết bình luận</h3>
            <p><b>Người bình luận:</b> {commentDetail.user?.firstName} {commentDetail.user?.lastName}</p>
            <p><b>Nội dung:</b> {commentDetail.content}</p>
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={() => setShowCommentModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  return (
    <div className="relative flex items-center justify-center mb-4" style={{ minHeight: 180 }}>
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-400 text-xl px-2 py-1 rounded-full z-10"
        onClick={handlePrev}
        disabled={total <= 1}
        style={{ opacity: total <= 1 ? 0.5 : 1 }}
        aria-label="Trước"
      >&#8592;</button>
      <img
        src={images[current] ? url+images[current] :  ""}
        alt=""
        className="max-h-[60vh] w-auto object-contain rounded-lg border mx-8"
        style={{ maxWidth: "90vw" }}
        onError={e => e.target.style.display = 'none'}
      />
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-400 text-xl px-2 py-1 rounded-full z-10"
        onClick={handleNext}
        disabled={total <= 1}
        style={{ opacity: total <= 1 ? 0.5 : 1 }}
        aria-label="Sau"
      >&#8594;</button>
      {/* Chỉ số ảnh */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded">
        {current + 1} / {total}
      </div>
    </div>
  );
} 