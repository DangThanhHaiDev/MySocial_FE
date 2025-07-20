import React, { useEffect, useState, useRef, useCallback } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@chakra-ui/react";

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const observerRef = useRef();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth?.user?.id);
  const token = localStorage.getItem("token");

  // Fetch notifications with pagination
  const fetchNotifications = async (page = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError("");
    }

    try {
      const res = await axiosInstance.get("/api/notification", {
        headers: { Authorization: token },
        params: {
          page: page,
          size: 10, // Số lượng notification mỗi trang
          sort: "createdAt,desc" // Sắp xếp theo thời gian tạo mới nhất
        }
      });

      const pagedData = res.data;
      
      if (append) {
        setNotifications(prev => [...prev, ...pagedData.content]);
      } else {
        setNotifications(pagedData.content);
      }
      
      setHasNext(pagedData.hasNext);
      setCurrentPage(pagedData.page);
      setTotalElements(pagedData.totalElements);
    } catch (err) {
      setError("Không thể tải thông báo");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more notifications
  const loadMoreNotifications = useCallback(() => {
    if (!loadingMore && hasNext) {
      fetchNotifications(currentPage + 1, true);
    }
  }, [currentPage, hasNext, loadingMore]);

  // Intersection Observer for infinite scroll
  const lastNotificationElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          loadMoreNotifications();
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasNext, loadMoreNotifications]
  );

  useEffect(() => {
    fetchNotifications();
    // connectWebSocket();
    // return () => {
    //   if (stompClient.current && stompClient.current.connected) {
    //     stompClient.current.disconnect(() => { });
    //   }
    // };
    // eslint-disable-next-line
  }, []);

  // Kết nối WebSocket để nhận notification realtime
  // const connectWebSocket = () => {
  //   if (!userId || !token) return;
  //   stompClient.current = Stomp.over(() => new SockJS(`${window.location.origin.replace('3000', '2208')}/ws?token=${token}`));
  //   stompClient.current.reconnect_delay = 5000;
  //   stompClient.current.connect({}, () => {
  //     stompClient.current.subscribe(`/topic/notifications/${userId}`, (message) => {
  //       const notification = JSON.parse(message.body);
  //       setNotifications((prev) => {
  //         // Nếu notification đã có trong danh sách (theo id), không thêm nữa
  //         if (prev.some(n => n.id === notification.id)) return prev;
  //         return [notification, ...prev];
  //       });
  //       // Cập nhật totalElements khi có notification mới
  //       setTotalElements(prev => prev + 1);
  //     });
  //   });
  // };

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

  const handleDeleteNotification = async(id) => {
    try {
      await axiosInstance.delete(`/api/notification/${id}`, {
        headers: { Authorization: token }
      });
      setNotifications(notifications.filter((n) => (n.id !== id)));
      setTotalElements(prev => prev - 1);
    } catch (error) {
      alert("Đã có vấn đề khi xóa thông báo");
    }
  };

  // Refresh notifications
  const handleRefresh = () => {
    setCurrentPage(0);
    setHasNext(true);
    fetchNotifications(0, false);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl tracking-wide">
          Thông báo {totalElements > 0 && `(${totalElements})`}
        </h2>
        <Button 
          onClick={handleRefresh}
          disabled={loading}
          size="sm"
          colorScheme="blue"
          variant="outline"
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </Button>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <ul className="list-none p-0 m-0">
        {!loading && notifications.length === 0 && (
          <li className="text-center text-gray-500 py-8">
            Không có thông báo nào.
          </li>
        )}
        
        {notifications.map((noti, index) => {
          const isLast = index === notifications.length - 1;
          return (
            <li
              key={noti.id}
              ref={isLast ? lastNotificationElementRef : null}
              className={`text-left flex items-center mb-5 p-4 rounded-xl border-l-4 transition-colors duration-200 shadow-sm hover:bg-blue-50 ${noti.isRead
                ? "bg-gray-100 border-gray-400"
                : "bg-blue-50 border-blue-600 font-semibold shadow-md"
                }`}
            >
              {typeIcon[noti.type] || typeIcon.DEFAULT}
              <div 
                onClick={() => handleNotificationClick(noti)}
                className="flex-1 cursor-pointer"
              >
                <div className="text-base">
                  {noti.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(noti.createdAt)}
                </div>
                {!noti.isRead && (
                  <span className="text-blue-600 text-xs mt-1 inline-block">
                    ● Chưa đọc
                  </span>
                )}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteNotification(noti.id); 
                }}
                size="sm"
                colorScheme="red"
                variant="outline"
              >
                Xóa
              </Button>
            </li>
          );
        })}
      </ul>

      {/* Loading indicator cho infinite scroll */}
      {loadingMore && (
        <div className="text-center py-4">
          <div className="inline-flex items-center text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tải thêm...
          </div>
        </div>
      )}

      {/* Thông báo khi đã tải hết */}
      {!hasNext && notifications.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Đã hiển thị tất cả thông báo
        </div>
      )}

      {/* Loading indicator cho lần tải đầu tiên */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tải...
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;