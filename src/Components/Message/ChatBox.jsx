import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import axiosInstance from "../../AppConfig/axiosConfig";
import { FiRotateCcw } from "react-icons/fi";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaAngry, FaLaugh, FaSadTear, FaSurprise, FaThumbsUp } from "react-icons/fa";
import ReactionModal from "./ReactionModal";
import url from "../../AppConfig/urlApp";
import { CircleX, Reply, Loader2 } from "lucide-react";

const WS_URL = "http://localhost:2208/ws";
// Đổi lại PAGE_SIZE = 20
const PAGE_SIZE = 5;

const REACTIONS = [
  { id: 1, type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
  { id: 2, type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
  { id: 3, type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
  { id: 4, type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' },
  { id: 5, type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
  { id: 6, type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
  { id: 7, type: 'NONE', icon: <AiOutlineHeart />, title: 'Like' },
];

const ChatBox = ({ user, onClose, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [pageInfo, setPageInfo] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const topObserverRef = useRef(null);
  const bottomObserverRef = useRef(null);
  const topObserverInstanceRef = useRef(null);
  const bottomObserverInstanceRef = useRef(null);
  const isLoadingMoreRef = useRef(false); // kiểm soát trạng thái loadMore
  const shouldAutoScrollRef = useRef(true); // kiểm soát auto scroll khi có tin nhắn mới

  const token = localStorage.getItem("token");
  const [revokeMsgId, setRevokeMsgId] = useState(null);
  const [showReaction, setShowReaction] = useState(null);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [selectedMessageReactions, setSelectedMessageReactions] = useState([]);
  const [reply, setReply] = useState(null);
  const [file, setFile] = useState(null);

  const [justLoaded, setJustLoaded] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [hasReachedBottomOnce, setHasReachedBottomOnce] = useState(false);
  const [pendingScrollRestore, setPendingScrollRestore] = useState(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [pendingAutoScroll, setPendingAutoScroll] = useState(false);

  const oldestMsgId = messages.length > 0 ? messages[0].id : null;

  // Load more messages khi scroll đến đầu
  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMore || !oldestMsgId || initialLoading) return;
    setLoadingMore(true);
    isLoadingMoreRef.current = true;
    const currentScrollHeight = messagesBoxRef.current?.scrollHeight || 0;
    const start = Date.now();
    try {
      const res = await axiosInstance.get(
        `/api/messages/history?userId=${user.id}&beforeMessageId=${oldestMsgId}&size=${PAGE_SIZE}`
      );
      const paged = res.data;
      if (paged.content.length > 0) {
        setMessages(prev => {
          const newMessages = paged.content.slice().reverse().map(msg => ({
            ...msg,
            createdAt: typeof msg.createdAt === 'string' ? msg.createdAt : (msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString())
          }));
          const existingIds = new Set(prev.map(msg => msg.id));
          const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
          const result = [...uniqueNewMessages, ...prev];
          // Dùng requestAnimationFrame để giữ vị trí scroll
          requestAnimationFrame(() => {
            if (messagesBoxRef.current) {
              const newScrollHeight = messagesBoxRef.current.scrollHeight;
              const scrollDiff = newScrollHeight - currentScrollHeight;
              messagesBoxRef.current.scrollTop = scrollDiff;
            }
            isLoadingMoreRef.current = false;
          });
          return result;
        });
      }
      setHasMore(paged.hasNext);
      setPageInfo(paged);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      // Đảm bảo loading indicator hiển thị ít nhất 400ms
      const elapsed = Date.now() - start;
      const minDelay = 400;
      if (elapsed < minDelay) {
        setTimeout(() => {
          setLoadingMore(false);
          setInitialLoading(false);
        }, minDelay - elapsed);
      } else {
        setLoadingMore(false);
        setInitialLoading(false);
      }
    }
  }, [loadingMore, hasMore, oldestMsgId, user.id, initialLoading, messages.length]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  // Scroll event handler
  const handleScroll = (e) => {
    const target = e.target;
    const { scrollTop, scrollHeight, clientHeight } = target;
    // Nếu user ở gần cuối (cách bottom < 100px), cho phép auto scroll
    if (scrollHeight - scrollTop - clientHeight < 100) {
      shouldAutoScrollRef.current = true;
    } else {
      shouldAutoScrollRef.current = false;
    }
  };

  // Setup Intersection Observer for loading more messages
  useEffect(() => {
    if (!hasMore || initialLoading) return;
    const topObserver = topObserverRef.current;
    if (!topObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingMore) {
          loadMoreMessages();
        }
      },
      {
        root: messagesBoxRef.current,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
    observer.observe(topObserver);
    topObserverInstanceRef.current = observer;
    return () => {
      if (topObserverInstanceRef.current) {
        topObserverInstanceRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMoreMessages, initialLoading, messages.length]);

  // Setup Intersection Observer for auto-scroll detection
  useEffect(() => {
    const bottomObserver = bottomObserverRef.current;
    if (!bottomObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Không cần làm gì với entry.isIntersecting
        // Chỉ cần có observer này để detect khi cần scroll
      },
      {
        root: messagesBoxRef.current,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    observer.observe(bottomObserver);
    bottomObserverInstanceRef.current = observer;

    return () => {
      if (bottomObserverInstanceRef.current) {
        bottomObserverInstanceRef.current.disconnect();
      }
    };
  }, []);

  // Load initial messages
  useEffect(() => {
    console.log('useEffect loadInitialMessages called', user?.id);
    if (!user?.id) return;

    const loadInitialMessages = async () => {
      try {
        setInitialLoading(true);
        setMessages([]); // Đã reset về rỗng
        setHasMore(true);

        const res = await axiosInstance.get(`/api/messages/history?userId=${user.id}&size=${PAGE_SIZE}`);
        const paged = res.data;
        const msgs = paged.content
          .slice().reverse()
          .map(msg => ({
            ...msg,
            createdAt: typeof msg.createdAt === 'string' ? msg.createdAt : (msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString())
          }));
        setMessages(msgs);
        setHasMore(paged.hasNext);
        setPageInfo(paged);
        setHasLoadedInitial(true); // Đánh dấu đã load xong initial
        console.log('Initial messages:', msgs.length, msgs);
      } catch (e) {
        console.error("Error fetching history:", e);
        setMessages([]);
        setHasMore(false);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialMessages();
  }, [user?.id]);

  // Auto scroll to bottom khi có tin nhắn mới và user đang ở gần cuối
  useEffect(() => {
    if (!initialLoading && messages.length > 0 && shouldAutoScrollRef.current && !isLoadingMoreRef.current) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 100);
    }
  }, [messages.length, initialLoading]);

  useLayoutEffect(() => {
    if (pendingScrollRestore && messagesBoxRef.current) {
      const { scrollTopBefore, scrollHeightBefore } = pendingScrollRestore;
      const scrollHeightAfter = messagesBoxRef.current.scrollHeight;
      console.log('---RESTORE SCROLL---');
      console.log('Before:', { scrollTopBefore, scrollHeightBefore });
      console.log('After:', { scrollHeightAfter });
      messagesBoxRef.current.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
      setPendingScrollRestore(null);
      isLoadingMoreRef.current = false; // Đánh dấu loadMore đã xong
      setPendingAutoScroll(false); // Cho phép auto scroll lại sau khi restore scroll xong
      console.log('Restored scrollTop:', messagesBoxRef.current.scrollTop);
    }
  }, [pendingScrollRestore, messages]);

  // WebSocket connection
  useEffect(() => {
    const socket = new SockJS(`${WS_URL}?token=${token}`);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      const topic = `/topic/messages/${currentUser.id}/${user.id}`;
      stompClient.current.subscribe(topic, (msg) => {
        const body = JSON.parse(msg.body);
        console.log(body);

        if (body.action === "update" && body.messageId && body.data) {
          setMessages(prev => prev.map(m =>
            m.id === body.messageId ? { ...m, ...body.data } : m
          ));
        } else if (body.action === "del-reaction") {
          const { data } = body;
          setMessages(prev => prev.map(item =>
            item.id === data.messageId
              ? { ...item, reactions: item.reactions.filter(r => r.id !== data.reactionId) }
              : item
          ));
        } else if (body.action === "reaction") {
          setMessages(prev => prev.map(m =>
            m.id === body.data.messageId
              ? { ...m, reactions: body.data.reactionList }
              : m
          ));
        } else if (body.data) {
          setMessages(prev => [
            ...prev,
            {
              ...body.data,
              createdAt: typeof body.data.createdAt === 'string' ? body.data.createdAt : (body.data.createdAt ? new Date(body.data.createdAt).toISOString() : new Date().toISOString())
            }
          ]);
          // Nếu user đang ở gần cuối, auto scroll
          if (shouldAutoScrollRef.current) {
            setTimeout(() => {
              if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
              }
            }, 100);
          }
        } else if (body.action === "revoke" && body.messageId) {
          setMessages(prev => prev.map(m =>
            m.id === body.messageId ? { ...m, deleted: true } : m
          ));
        }
      });
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [user, currentUser, scrollToBottom]);

  const openReactionModal = (reactions) => {
    setSelectedMessageReactions(reactions || []);
    setShowReactionModal(true);
  };

  const closeReactionModal = () => {
    setShowReactionModal(false);
    setSelectedMessageReactions([]);
  };

  // Send message
  const sendMessage = () => {
    if (!input.trim() && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        const msg = {
          receiverId: user.id,
          type: "IMAGE",
          fileBase64: base64,
          fileName: file.name,
          replyToId: reply ? reply.id : null,
          content: input,
        };
        try {
          await axiosInstance.post(
            "/api/conversations/image",
            msg,
            { headers: { Authorization: token } }
          );
          setInput("");
          setReply(null);
          setFile(null);
          setTimeout(() => {
            if (shouldAutoScrollRef.current && messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }
          }, 100);
        } catch (err) {
          alert("Gửi ảnh thất bại!");
        }
      };
      reader.readAsDataURL(file);
    } else {
      const msg = {
        receiverId: user.id,
        content: input,
        type: "TEXT",
        replyToId: reply ? reply.id : null
      };
      stompClient.current.send("/app/messages", {}, JSON.stringify(msg));
      setInput("");
      setReply(null);
      setFile(null);
      setTimeout(() => {
        if (shouldAutoScrollRef.current && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 100);
    }
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

  const handleReact = (messageId, id) => {
    if (!stompClient.current || !stompClient.current.connected) return;

    const reactionPayload = {
      messageId,
      reactionId: id,
      receiverId: user.id,
    };

    stompClient.current.send("/app/messages/reaction", {}, JSON.stringify(reactionPayload));
    setShowReaction(false);
  };

  const handleDelReact = (messageId) => {
    if (!stompClient.current || !stompClient.current.connected) return;
    const message = messages.find(item => item.id === messageId);
    const messageReaction = message.reactions.find(item => item.user.id === currentUser.id);

    const reactionPayload = {
      messageReactionId: messageReaction.id,
      messageId: messageId,
      receiverId: user.id
    };

    stompClient.current.send("/app/messages/reaction/delete", {}, JSON.stringify(reactionPayload));
    setShowReaction(false);
  };

  return (
    <div className="flex flex-col bg-gray-50 mx-auto w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.avatarUrl ? (
              <img src={url + user.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              (user?.firstName?.charAt(0) || "?")
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-base">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-green-500">Đang hoạt động</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 max-h-[50vh] scroll-smooth hide-scrollbar"
        ref={messagesBoxRef}
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
      >
        {/* Top observer for loading more messages - luôn render ở đầu */}
        <div ref={topObserverRef} style={{ height: 8 }} />
        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500 mr-2" />
            <span className="text-sm text-gray-500">Đang tải thêm tin nhắn...</span>
          </div>
        )}
        {/* Initial loading */}
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-gray-500">Đang tải tin nhắn...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          <>
            {console.log('Rendering messages:', messages.length)}
            {messages.map((msg, idx) => {
              const isMine = msg.sender && msg.sender.id === currentUser.id;
              return (
                <div
                  key={msg.id || idx}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}
                  onMouseLeave={() => setShowReaction(false)}
                >

                  <div className={`group relative max-w-[80%] ${isMine ? "order-1" : "order-2"}`}>
                    {/* Reply preview */}
                    {msg.replyTo && (
                      <div className={`mb-1 ${isMine ? "text-right" : "text-left"}`}>
                        <div className={`inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs max-w-[250px] border-l-2 border-blue-500`}>
                          <div className="flex items-center gap-1 mb-1">
                            <Reply size={10} className="text-blue-500" />
                            <span className="font-medium text-blue-600">
                              {msg.replyTo.sender?.firstName || "Người dùng"}
                            </span>
                          </div>
                          <div className="truncate">
                            {msg.replyTo.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`group relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.deleted
                        ? "bg-gray-100 text-gray-500 italic border border-gray-200"
                        : isMine
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                        } ${isMine ? "rounded-br-md" : "rounded-bl-md"}`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {msg.deleted ? (
                        <div className="flex items-center text-xs">
                          <FiRotateCcw className="mr-2 text-gray-400" size={12} />
                          Tin nhắn đã được thu hồi
                        </div>
                      ) : (
                        <>
                          <div className="whitespace-pre-line">
                            {msg.content}
                            {msg.imageUrl && (
                              <div className="my-2">
                                <img
                                  src={url + msg.imageUrl}
                                  alt="Ảnh gửi"
                                  className="max-w-xs rounded-lg"
                                  style={{ maxHeight: 300 }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Message actions */}
                          <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? "left-[-30px]" : "right-[-30px]"
                            }`}>
                            <div className="flex items-center space-x-1 bg-white rounded-full shadow-md p-1">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full"
                                onClick={() => setReply(msg)}
                                title="Trả lời"
                              >
                                <Reply size={12} className="text-gray-500" />
                              </button>
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full"
                                onMouseEnter={() => setShowReaction(msg.id)}
                                title="Reaction"
                              >
                                <AiOutlineHeart size={12} className="text-gray-500" />
                              </button>
                            </div>
                          </div>

                          {/* Revoke button */}
                          {isMine && !msg.deleted && (
                            <button
                              className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setRevokeMsgId(msg.id)}
                              title="Thu hồi"
                            >
                              <FiRotateCcw size={10} />
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs text-gray-400 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
                        : ""}
                    </div>

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div
                        className={`absolute -bottom-0 ${isMine ? "left-[-13px]" : "right-[-13px]"} bg-white rounded-full px-2 py-1 shadow-sm border cursor-pointer`}
                        onClick={() => openReactionModal(msg.reactions)}
                      >
                        <span className="text-xs">
                          {REACTIONS.find(r => r.type === msg.reactions[0]?.reaction.reactionType)?.icon}
                        </span>
                      </div>
                    )}

                    {/* Reaction popup */}
                    {showReaction === msg.id && (
                      <div className={`absolute bottom-0 ${isMine ? "right-0" : "left-0"} z-20`}>
                        <div className="bg-white rounded-full shadow-lg border p-2 flex space-x-1">
                          {REACTIONS.map((reaction) => (
                            <button
                              key={reaction.id}
                              className="text-lg hover:scale-125 transition-transform p-1"
                              title={reaction.title}
                              onClick={() => {
                                if (reaction.id !== 7) {
                                  handleReact(msg.id, reaction.id);
                                } else {
                                  handleDelReact(msg.id);
                                }
                              }}
                            >
                              {reaction.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bottom observer for auto-scroll detection */}
            <div ref={bottomObserverRef} className="h-1" />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        {/* Reply preview */}
        {reply && (
          <div className="mb-3 p-3 bg-gray-50 rounded-xl border-l-4 border-blue-500 relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center">
              <Reply size={12} className="mr-1" />
              Trả lời {reply.sender?.firstName || "Người dùng"}
            </div>
            <div className="text-sm text-gray-800 truncate pr-6">{reply.content}</div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setReply(null)}
            >
              <CircleX size={16} />
            </button>
          </div>
        )}

        {/* Input row */}
        <div className="flex items-center space-x-2">
          {!file ? (
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer">
              <label htmlFor="file">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
              <input type="file" hidden id="file" onChange={(e) => setFile(e.target.files[0])} />
            </button>
          ) : (
            <div className="relative">
              <img src={URL.createObjectURL(file)} alt="" className="w-10 h-10 rounded" />
              <button
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                onClick={() => setFile(null)}
              >
                ×
              </button>
            </div>
          )}

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-8V3a1 1 0 011-1h4a1 1 0 011 1v3M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full bg-gray-100 border-0 rounded-2xl px-4 py-2 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
          </div>

          <button
            className={`p-2 rounded-full transition-colors ${input.trim() || file
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            onClick={sendMessage}
            disabled={!input.trim() && !file}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Revoke confirmation modal */}
      {revokeMsgId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Thu hồi tin nhắn</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn thu hồi tin nhắn này không?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setRevokeMsgId(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={handleConfirmRevoke}
              >
                Thu hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reaction modal */}
      <ReactionModal
        isOpen={showReactionModal}
        onClose={closeReactionModal}
        reactions={selectedMessageReactions}
      />
    </div>
  );
};

export default ChatBox;