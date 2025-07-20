import { useState } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";

const ReportModal = ({ type, targetId, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("/api/reports", {
        type,
        targetId,
        reason,
      }, {
        headers: { Authorization: token },
      });
      alert("Báo cáo của bạn đã được gửi!");
      onClose();
    } catch (err) {
      alert("Gửi báo cáo thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">Báo cáo {type === "POST" ? "bài viết" : "bình luận"}</h3>
        <textarea
          className="w-full border rounded p-2 mb-3"
          rows={3}
          placeholder="Nhập lý do báo cáo..."
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
          <button
            onClick={handleReport}
            className="px-4 py-2 bg-red-500 text-white rounded"
            disabled={loading || !reason.trim()}
          >
            Gửi báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal; 