import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import FriendList from "./FriendList";
import ChatBox from "./ChatBox";
import ConversationList from "./ConversationList";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import url from "../../AppConfig/urlApp";
import { Button } from "@chakra-ui/react";
import Group from "./Group";




const Message = () => {
  const [conversations, setConversations] = useState([]);
  // Friend list state
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const stompClient = useRef(null);
  const [title, setTitle] = useState("don")
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Nếu là nhóm thì disconnect WebSocket nếu đang kết nối
    if (title === "nhom") {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {
          console.log("❌ Disconnected because title is 'nhom'");
        });
      }
      return; // Ngừng luôn, không kết nối nữa
    }

    if (stompClient.current?.connected) return;

    stompClient.current = Stomp.over(() => new SockJS(`${url}/ws?token=${token}`));
    stompClient.current.reconnect_delay = 5000;

    stompClient.current.connect({}, () => {
      console.log("✅ WebSocket connected");

      stompClient.current.subscribe(`/topic/conversations/${currentUser.id}`, (message) => {
        console.log("📨 Received message:", message.body);
        if (message.body === "update") {
          reloadConversations();
        }
      });
    });

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {
          console.log("❌ Disconnected (unmount)");
        });
      }
    };
  }, [currentUser]); 

  // Lấy user hiện tại
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axiosInstance.get("/api/users/me");
        setCurrentUser(res.data);
        console.log(res.data);

      } catch (e) {
        setCurrentUser(null);
      }
    };
    fetchMe();
  }, []);


  const reloadConversations = async () => {
    try {
      console.log("🔄 Reloading conversations...");
      const res = await axiosInstance.get("/api/conversations");
      console.log("✅ Conversations loaded:", res.data);
      setConversations(res.data);
    } catch (error) {
      console.error("❌ Error reloading conversations:", error);
    }
  };

  useEffect(() => {
    reloadConversations();
  }, []);


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
    <div className="max-w-3xl py-5 mx-auto bg-white shadow-lg rounded-lg overflow-hidden h-[100vh] overflow-y-auto">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Tin nhắn</h1>

      </div>
      <div className="text-left p-4 space-x-3">
        <Button onClick={() => setTitle("don")}>Tin nhắn</Button>
        <Button onClick={() => setTitle("nhom")}>Tin nhắn nhóm</Button>
      </div>
      {
        title === "don" ?
          <div>
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
                  normalMessages={normalMessages}
                  onSelectUser={handleSelectUserFromConversation}
                />
              </>
            )}
          </div>
          :
          <Group currentUser={currentUser} />
      }

    </div>
  );
};

export default Message;