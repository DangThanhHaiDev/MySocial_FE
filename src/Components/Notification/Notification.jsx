import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@chakra-ui/react";

// Data giả cho notification
const mockNotifications = [
  {
    id: 1,
    type: "COMMENT",
    content: "Nguyễn Văn A đã bình luận vào bài viết của bạn!",
    isRead: false,
    createdAt: "2024-07-01T10:30:00",
  },
  {
    id: 2,
    type: "FRIEND_REQUEST",
    content: "Trần Thị B đã gửi lời mời kết bạn!",
    isRead: true,
    createdAt: "2024-06-30T15:20:00",
  },
  {
    id: 3,
    type: "REACTION",
    content: "Lê Văn C đã thích bài viết của bạn!",
    isRead: false,
    createdAt: "2024-07-01T09:00:00",
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", { hour12: false });
}

const typeIcon = {
  COMMENT: <span className="text-blue-600 text-xl mr-3">💬</span>,
  FRIEND_REQUEST: <span className="text-green-600 text-xl mr-3">🤝</span>,
  FRIEND_ACCEPT: <span className="text-green-600 text-xl mr-3">✅</span>,
  REACTION: <span className="text-red-500 text-xl mr-3">❤️</span>,
  DEFAULT: <span className="text-gray-400 text-xl mr-3">🔔</span>,
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stompClient = useRef(null);
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth?.user?.id);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
    connectWebSocket();
    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => { });
      }
    };
    // eslint-disable-next-line
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/notification", {
        headers: { Authorization: token },
      });
      setNotifications(res.data);
    } catch (err) {
      setError("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  // Kết nối WebSocket để nhận notification realtime
  const connectWebSocket = () => {
    if (!userId || !token) return;
    stompClient.current = Stomp.over(() => new SockJS(`${window.location.origin.replace('3000', '2208')}/ws?token=${token}`));
    stompClient.current.reconnect_delay = 5000;
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/topic/notifications/${userId}`, (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => {
          // Nếu notification đã có trong danh sách (theo id), không thêm nữa
          if (prev.some(n => n.id === notification.id)) return prev;
          return [notification, ...prev];
        });
      });
    });
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await axiosInstance.put(`/api/notification/${id}/read`, {}, {
        headers: { Authorization: token },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      alert("Đánh dấu đã đọc thất bại!");
    }
  };

  // Xử lý click notification
  const handleNotificationClick = (noti) => {
    if (!noti.isRead) handleMarkAsRead(noti.id, noti.isRead);
    if ((noti.type === "FRIEND_REQUEST" || noti.type === "FRIEND_ACCEPT") && noti.relatedUserId) {
      navigate(`/profile/${noti.relatedUserId}`);
    }
    else if(noti.type === "REACTION" || noti.type === "COMMENT"){
      navigate(`/username?postId=${noti.relatedUserId}`)
    }
    
    // Có thể mở rộng cho các loại notification khác
  };

  const handleDeleteNotification = async(id)=>{
    try {
      axiosInstance.delete(`/api/notification/${id}`)
      setNotifications(notifications.filter((n)=>(n.id!==id)))
    } catch (error) {
      alert("Đã có vấn đề khi xóa thông báo")
    }
  }

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-center mb-6 font-bold text-xl tracking-wide">
        Thông báo
      </h2>
      {loading && <div className="text-center text-gray-500">Đang tải...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <ul className="list-none p-0 m-0">
        {!loading && notifications.length === 0 && (
          <li>Không có thông báo nào.</li>
        )}
        {notifications.map((noti) => (
          <li
            key={noti.id}
            className={`text-left flex items-center mb-5 p-4 rounded-xl border-l-4 transition-colors duration-200 shadow-sm hover:bg-blue-50 ${noti.isRead
              ? "bg-gray-100 border-gray-400"
              : "bg-blue-50 border-blue-600 font-semibold shadow-md"
              }`}
          >
            {typeIcon[noti.type] || typeIcon.DEFAULT}
            <div onClick={() => handleNotificationClick(noti)}
              className="flex-1 cursor-pointer "
            >
              <div  >
                <div className="text-base">
                  {noti.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">{formatDate(noti.createdAt)}</div>
                {!noti.isRead && (
                  <span className="text-blue-600 text-xs mt-1 inline-block">● Chưa đọc</span>
                )}
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation(); 
                handleDeleteNotification(noti.id); 
              }}
            >
              Xóa thông báo
            </Button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
