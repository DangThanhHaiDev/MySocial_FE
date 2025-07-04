import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import FriendList from "./FriendList";
import ChatBox from "./ChatBox";
import ConversationList from "./ConversationList";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const WS_URL = "http://localhost:2208/ws";

// Component cho tin nhắn nhóm
const GroupMessage = ({ message }) => {
  const { groupName, lastMessage, lastSender, timestamp, avatarUrls, unreadCount } = message;
  
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
      {/* Avatar nhóm (nhiều avatar chồng lên nhau) */}
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {groupName?.charAt(0) || 'G'}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 border-2 border-white overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
            {lastSender?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 truncate">{groupName || "Nhóm bạn bè"}</h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {timestamp || "2 giờ"}
          </span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-sm text-gray-600 font-medium">{lastSender || "Minh"}:</span>
          <p className="text-sm text-gray-600 truncate">
            {lastMessage || "Hẹn gặp lại các bạn nhé!"}
          </p>
        </div>
      </div>
      
      {unreadCount && (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">{unreadCount}</span>
        </div>
      )}
    </div>
  );
};

// Component cho tin nhắn bình thường (đã đọc)
const NormalMessage = ({ message }) => {
  const { senderName, lastMessage, timestamp, avatarUrl, isOnline } = message;
  
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg w-[3000px]">
      {/* Avatar với trạng thái online */}

      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {senderName?.charAt(0) || 'A'}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">{senderName || "Hà Anh"}</h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {timestamp || "1 giờ"}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate mt-1 text-left">
          {lastMessage || "Cảm ơn bạn nhiều nhé"}
        </p>
      </div>
    </div>
  );
};

// Component cho tin nhắn chưa đọc
const UnreadMessage = ({ message }) => {
  const { senderName, lastMessage, timestamp, avatarUrl, unreadCount, isOnline } = message;
  
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-blue-50 cursor-pointer rounded-lg bg-blue-25">
      {/* Avatar với trạng thái online */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
              {senderName?.charAt(0) || 'T'}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 truncate">{senderName || "Tuấn Anh"}</h3>
          <span className="text-xs text-blue-600 font-semibold ml-2 flex-shrink-0">
            {timestamp || "5 phút"}
          </span>
        </div>
        <p className="text-sm text-gray-900 font-semibold truncate mt-1 text-left">
          {lastMessage || "Bạn có rảnh không? Mình muốn hỏi một chút"}
        </p>
      </div>
      
      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">{unreadCount || "2"}</span>
      </div>
    </div>
  );
};

const Message = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Friend list state
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const stompClient = useRef(null);

  // Lấy user hiện tại
  useEffect(() => {
    const fetchMe = async () => {
      try {
        // Thử gọi API lấy user hiện tại
        const res = await axiosInstance.get("/api/users/me");
        setCurrentUser(res.data);
      } catch (e) {
        setCurrentUser(null);
      }
    };
    fetchMe();
  }, []);

  // Hàm reload hội thoại
  const reloadConversations = async () => {
    try {
      console.log("🔄 Reloading conversations...");
      const res = await axiosInstance.get("/api/conversations");
      console.log("✅ Conversations loaded:", res.data);
      setConversations(res.data);
    } catch (error) {
      console.error("❌ Error reloading conversations:", error);
      setError("Không thể tải danh sách tin nhắn");
    }
  };

  useEffect(() => {
    reloadConversations();
  }, []);

  // Lắng nghe realtime cập nhật hội thoại
  useEffect(() => {
    if (!currentUser) {
      console.log("⏳ Waiting for currentUser...");
      return;
    }
    
    console.log("🔌 Connecting to WebSocket for user:", currentUser.id);
    const socket = new SockJS(WS_URL);
    stompClient.current = Stomp.over(socket);
    
    stompClient.current.connect(
      { Authorization: localStorage.getItem("token") ? "Bearer " + localStorage.getItem("token") : "" },
      () => {
        console.log("✅ WebSocket connected successfully");
        const topic = `/topic/conversations/${currentUser.id}`;
        console.log("📡 Subscribing to topic:", topic);
        
        stompClient.current.subscribe(topic, (msg) => {
          console.log("📨 Received message on topic:", topic, "Body:", msg.body);
          if (msg.body === "update") {
            console.log("🔄 Received update signal, reloading conversations...");
            reloadConversations();
          }
        });
      },
      (error) => {
        console.error("❌ WebSocket connection failed:", error);
      }
    );
    
    return () => {
      if (stompClient.current) {
        console.log("🔌 Disconnecting WebSocket...");
        stompClient.current.disconnect();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoadingFriends(true);
      try {
        let url = "/api/friends/list";
        if (friendSearch.trim() !== "") {
          url = `/api/friends/search?q=${encodeURIComponent(friendSearch)}`;
        }
        const res = await axiosInstance.get(url);
        setFriends(res.data);
      } catch (e) {
        setFriends([]);
      }
      setLoadingFriends(false);
    };
    fetchFriends();
  }, [friendSearch]);

  // Phân loại hội thoại
  const unreadMessages = conversations.filter(
    c => !c.isGroup && c.unreadCount > 0
  ).map(c => ({
    ...c,
    senderName: c.name,
    lastMessage: c.lastMessage,
    timestamp: c.timestamp,
    avatarUrl: c.avatarUrl,
    unreadCount: c.unreadCount,
    isOnline: c.isOnline
  }));

  const groupMessages = conversations.filter(
    c => c.isGroup
  ).map(c => ({
    ...c,
    groupName: c.name,
    lastMessage: c.lastMessage,
    lastSender: c.lastSender,
    timestamp: c.timestamp,
    avatarUrl: c.avatarUrl,
    unreadCount: c.unreadCount
  }));

  const normalMessages = conversations.filter(
    c => !c.isGroup && (!c.unreadCount || c.unreadCount === 0)
  ).map(c => ({
    ...c,
    senderName: c.name,
    lastMessage: c.lastMessage,
    timestamp: c.timestamp,
    avatarUrl: c.avatarUrl,
    isOnline: c.isOnline
  }));

  // Hàm chọn user từ hội thoại (cá nhân)
  const handleSelectUserFromConversation = (conv) => {
    if (conv.isGroup) return; // chỉ xử lý hội thoại cá nhân
    setSelectedUser({
      id: conv.id,
      firstName: conv.name?.split(" ")[0] || conv.name,
      lastName: conv.name?.split(" ").slice(1).join(" ") || "",
      avatarUrl: conv.avatarUrl || ""
    });
  };

  // Hàm đóng chat, cập nhật lại hội thoại
  const handleCloseChat = () => {
    setSelectedUser(null);
    reloadConversations();
  };

  return (
    <div className="max-w-3xl py-5 mx-auto bg-white shadow-lg rounded-lg overflow-hidden max-h-screen overflow-y-auto">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Tin nhắn</h1>
      </div>
      {selectedUser && currentUser ? (
        <ChatBox user={selectedUser} onClose={handleCloseChat} currentUser={currentUser} onNewMessage={reloadConversations} />
      ) : (
        <>
          <FriendList
            friends={friends}
            friendSearch={friendSearch}
            setFriendSearch={setFriendSearch}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            loadingFriends={loadingFriends}
          />
          <ConversationList
            unreadMessages={unreadMessages}
            groupMessages={groupMessages}
            normalMessages={normalMessages}
            onSelectUser={handleSelectUserFromConversation}
          />
        </>
      )}
    </div>
  );
};

export default Message;