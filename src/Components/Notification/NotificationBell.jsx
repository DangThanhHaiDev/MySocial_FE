import React, { useEffect, useRef, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useSelector } from "react-redux";

const NotificationBell = () => {
  const [hasUnread, setHasUnread] = useState(false);
  const stompClient = useRef(null);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth?.user?.id);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUnread();
    connectWebSocket();
    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {});
      }
    };
    // eslint-disable-next-line
  }, [userId, token]);

  const fetchUnread = async () => {
    try {
      const res = await axiosInstance.get("/api/notification/unread", {
        headers: { Authorization: token },
      });
      setHasUnread(res.data && res.data.length > 0);
    } catch (err) {
      setHasUnread(false);
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
        if (!notification.isRead) setHasUnread(true);
      });
    });
  };

  const handleClick = () => {
    setHasUnread(false); // Reset badge khi vào notification
    navigate("/notification");
  };

  return (
    <div className="relative cursor-pointer group" onClick={handleClick} title="Thông báo">
      <AiOutlineBell className="text-4xl text-gray-700 group-hover:text-blue-600 transition duration-200" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></span>
      )}
    </div>
  );
};

export default NotificationBell; 