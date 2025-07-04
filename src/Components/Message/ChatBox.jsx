import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import axiosInstance from "../../AppConfig/axiosConfig";
import { FiRotateCcw } from "react-icons/fi";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text
} from "@chakra-ui/react";

const WS_URL = "http://localhost:2208/ws";
const PAGE_SIZE = 20;

const ChatBox = ({ user, onClose, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const oldestMsgId = messages.length > 0 ? messages[0].id : null;
  const token = localStorage.getItem("token");
  const [revokeMsgId, setRevokeMsgId] = useState(null);

  // Load 20 tin nhắn mới nhất khi mở chat
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/api/messages/history?userId=${user.id}&size=${PAGE_SIZE}`);
        setMessages(res.data.reverse()); // đảo lại để tin cũ lên trên
        setHasMore(res.data.length === PAGE_SIZE);
      } catch (e) {
        setMessages([]);
        setHasMore(false);
      }
    };
    fetchHistory();
  }, [user]);

  // Infinite scroll: load thêm khi kéo lên đầu
  const handleScroll = async (e) => {
    if (loadingMore || !hasMore) return;
    if (e.target.scrollTop === 0 && oldestMsgId) {
      setLoadingMore(true);
      try {
        const res = await axiosInstance.get(`/api/messages/history?userId=${user.id}&beforeMessageId=${oldestMsgId}&size=${PAGE_SIZE}`);
        if (res.data.length > 0) {
          setMessages(prev => [...res.data.reverse(), ...prev]);
        }
        setHasMore(res.data.length === PAGE_SIZE);
      } catch {}
      setLoadingMore(false);
    }
  };

  // Kết nối websocket khi mở chat
  useEffect(() => {
    const socket = new SockJS(`${WS_URL}?token=${token}`);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect(
      {},
      () => {
        const topic = `/topic/messages/${currentUser.id}/${user.id}`;
        stompClient.current.subscribe(topic, (msg) => {
          const body = JSON.parse(msg.body);
          if (body.action === "update" && body.messageId && body.data) {
            setMessages(prev => prev.map(m => m.id === body.messageId ? { ...m, ...body.data } : m));
          } else if (body.data) {
            setMessages((prev) => [...prev, body.data]);
          } else if (body.action === "revoke" && body.messageId) {
            setMessages(prev => prev.map(m => m.id === body.messageId ? { ...m, isDeleted: true } : m));
          }
        });
      }
    );
    return () => {
      if (stompClient.current) stompClient.current.disconnect();
    };
  }, [user, currentUser]);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      receiverId: user.id,
      content: input,
      type: "TEXT"
    };
    stompClient.current.send("/app/messages", {}, JSON.stringify(msg));
    setInput("");
  };

  const handleConfirmRevoke = () => {
    if (stompClient.current && stompClient.current.connected && revokeMsgId) {
      stompClient.current.send(
        "/app/messages/revoke",
        {},
        JSON.stringify(revokeMsgId)
      );
    }
    setRevokeMsgId(null);
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-white p-6 mt-4 rounded-2xl shadow-lg w-full max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center w-full mb-4">
        <button onClick={onClose} className="mr-3 text-blue-500 hover:text-blue-700 focus:outline-none text-lg px-2 py-1 rounded-full bg-white shadow">
          ←
        </button>
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white shadow">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              (user?.firstName?.charAt(0) || "?")
            )}
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            {user?.firstName} {user?.lastName}
          </div>
        </div>
      </div>
      {/* Khung chat */}
      <div
        className="w-full bg-white rounded-xl shadow-inner flex-1 flex flex-col min-h-[200px] max-h-[60vh] mb-2 overflow-y-auto p-4"
        onScroll={handleScroll}
        ref={messagesBoxRef}
      >
        {loadingMore && (
          <div className="text-center text-xs text-gray-400 mb-2">Đang tải thêm...</div>
        )}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-base italic">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isMine = msg.sender && msg.sender.id === currentUser.id;
              return (
                <div
                  key={msg.id || idx}
                  className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
                  style={{ position: "relative" }}
                >
                  <div
                    className={`group px-4 py-2 rounded-2xl shadow break-words whitespace-pre-line max-w-[70%] text-base leading-relaxed relative ${
                      msg.isDeleted
                        ? "bg-gray-200 text-gray-500 italic flex items-center justify-center"
                        : isMine
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-gray-200 text-gray-900 rounded-bl-md"
                    }`}
                    style={{ wordBreak: "break-word", minHeight: 40 }}
                  >
                    {msg.isDeleted ? (
                      <span className="flex items-center justify-center w-full">
                        <FiRotateCcw className="mr-2 text-xl text-gray-400" />
                        Tin nhắn đã được thu hồi
                      </span>
                    ) : (
                      <>
                        {msg.content}
                        {isMine && !msg.isDeleted && (
                          <button
                            className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-red-100 transition-all shadow opacity-0 group-hover:opacity-100"
                            title="Thu hồi tin nhắn"
                            onClick={() => setRevokeMsgId(msg.id)}
                            style={{
                              border: "none",
                              outline: "none",
                              cursor: "pointer",
                              zIndex: 10
                            }}
                          >
                            <FiRotateCcw className="text-red-500" size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="w-full flex items-center mt-2">
        <input
          type="text"
          className="flex-1 border-2 border-blue-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-400 shadow-sm transition-all"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition-all"
          onClick={sendMessage}
        >
          Gửi
        </button>
      </div>
      {/* Modal xác nhận thu hồi */}
      <Modal isOpen={!!revokeMsgId} onClose={() => setRevokeMsgId(null)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thu hồi tin nhắn</ModalHeader>
          <ModalBody>
            <Text>Bạn có chắc chắn muốn thu hồi tin nhắn này không?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setRevokeMsgId(null)}>
              Hủy
            </Button>
            <Button colorScheme="red" onClick={handleConfirmRevoke}>
              Thu hồi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChatBox; 