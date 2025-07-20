import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaAngry, FaLaugh, FaSadTear, FaSurprise, FaThumbsUp } from "react-icons/fa";
import url from "../../AppConfig/urlApp";
import { CircleX, Loader2, Reply, UserMinus, UserPlus } from "lucide-react";
import { FiRotateCcw } from "react-icons/fi";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import ReactionModal from "./ReactionModal";
import AddMemberModal from "./AddMemberModal";
import GroupMembersModal from "./MemberModal";

const PAGE_SIZE = 5;
const WS_URL = "http://localhost:2208/ws";


const REACTIONS = [
    { id: 1, type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
    { id: 2, type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
    { id: 3, type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
    { id: 4, type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' },
    { id: 5, type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
    { id: 6, type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
    { id: 7, type: 'NONE', icon: <AiOutlineHeart />, title: 'Like' },
];

const ChatGroup = ({ user, onClose, group }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesBoxRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const isScrollingRef = useRef(false);
    const shouldScrollToBottomRef = useRef(true);
    const lastScrollTopRef = useRef(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const token = localStorage.getItem("token");
    const [revokeMsgId, setRevokeMsgId] = useState(null);
    const [showReaction, setShowReaction] = useState(null);
    const [showReactionModal, setShowReactionModal] = useState(false);
    const [selectedMessageReactions, setSelectedMessageReactions] = useState([]);
    const [reply, setReply] = useState(null);
    const [file, setFile] = useState(null);
    const oldestMsgId = messages.length > 0 ? messages[0].id : null;

    const [isOpenAddMemberModal, setIsOpenAddMemberModal] = useState(false)
    const [isOpenMembersModal, setIsOpenmembersModal] = useState(false)

    const closeAddMemberModal = () => {
        setIsOpenAddMemberModal(false)
    }

    const closeMembersModal = ()=>{
        setIsOpenmembersModal(false)
    }


    const isNearBottom = useCallback(() => {
        if (!messagesBoxRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } = messagesBoxRef.current;
        return scrollHeight - scrollTop - clientHeight < 100;
    }, []);


    const openReactionModal = (reactions) => {
        setSelectedMessageReactions(reactions || []);
        setShowReactionModal(true);
    };

    const closeReactionModal = () => {
        setShowReactionModal(false);
        setSelectedMessageReactions([]);
    };

    // Smooth scroll to bottom
    const scrollToBottom = useCallback((behavior = "smooth") => {
        if (messagesEndRef.current && shouldScrollToBottomRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior,
                block: "end",
                inline: "nearest"
            });
        }
    }, []);

    const loadMoreMessages = useCallback(async () => {
        if (loadingMore || !hasMore || !oldestMsgId || initialLoading) return;
        setLoadingMore(true);
        const currentScrollHeight = messagesBoxRef.current?.scrollHeight || 0;
        try {
            const res = await axiosInstance.get(
                `/api/messages/history/group?groupId=${group.id}&beforeMessageId=${oldestMsgId}&size=${PAGE_SIZE}`
            );
            const paged = res.data;
            if (paged.content.length > 0) {
                setMessages(prev => {
                    const newMessages = paged.content.slice().reverse();
                    const existingIds = new Set(prev.map(msg => msg.id));
                    const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
                    const result = [...uniqueNewMessages, ...prev];
                    requestAnimationFrame(() => {
                        if (messagesBoxRef.current) {
                            const newScrollHeight = messagesBoxRef.current.scrollHeight;
                            const scrollDiff = newScrollHeight - currentScrollHeight;
                            messagesBoxRef.current.scrollTop = scrollDiff;
                        }
                    });
                    return result;
                });
            }
            setHasMore(paged.hasNext);
        } catch (error) {
            console.error("Error loading more messages:", error);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, oldestMsgId, group.id, initialLoading, messages.length]);


    const handleScroll = useCallback((e) => {
        const target = e.target;
        const { scrollTop, scrollHeight, clientHeight } = target;

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        isScrollingRef.current = true;

        // Update scroll position tracking
        shouldScrollToBottomRef.current = isNearBottom();

        // Load more messages when scrolled to top
        if (scrollTop < 50 && !loadingMore && hasMore) {
            loadMoreMessages();
        }

        // Debounced scroll end detection
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 150);

        lastScrollTopRef.current = scrollTop;
    }, [loadMoreMessages, loadingMore, hasMore, isNearBottom]);




    useEffect(() => {
        const socket = new SockJS(`${WS_URL}?token=${token}`);
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, () => {
            const topic = `/topic/messages/group/${group.id}`;
            stompClient.current.subscribe(topic, (msg) => {
                const body = JSON.parse(msg.body);

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
                    // New message received
                    const wasNearBottom = isNearBottom();
                    setMessages(prev => [...prev, body.data]);

                    // Auto-scroll for new messages only if user was near bottom
                    if (wasNearBottom) {
                        shouldScrollToBottomRef.current = true;
                    }
                } else if (body.action === "revoke" && body.messageId) {
                    setMessages(prev => prev.map(m =>
                        m.id === body.messageId ? { ...m, deleted: true } : m
                    ));
                }
            });
        });

        return () => {
            if (stompClient.current) stompClient.current.disconnect();
        };
    }, [user, isNearBottom]);

    const fetchHistory = async () => {
        try {
            setInitialLoading(true);
            const res = await axiosInstance.get(`/api/messages/history/group?groupId=${group.id}&size=${PAGE_SIZE}`);
            const paged = res.data;
            const msgs = paged.content.slice().reverse();
            setMessages(msgs);
            setHasMore(paged.hasNext);
            shouldScrollToBottomRef.current = true;
        } catch (e) {
            setMessages([]);
            setHasMore(false);
        } finally {
            setInitialLoading(false);
        }

    };

    const handleReact = (messageId, id) => {
        if (!stompClient.current || !stompClient.current.connected) return;

        const reactionPayload = {
            messageId,
            reactionId: id,
            groupId: group.id,
        };

        stompClient.current.send("/app/messages/reaction/group", {}, JSON.stringify(reactionPayload));
        setShowReaction(false)
    };

    const handleDelReact = (messageId) => {
        if (!stompClient.current || !stompClient.current.connected) return;
        const message = messages.find(item => item.id === messageId);
        const messageReaction = message.reactions.find(item => item.user.id === user.id);

        const reactionPayload = {
            messageReactionId: messageReaction.id,
            messageId: messageId,
            groupId: group.id
        };

        stompClient.current.send("/app/messages/reaction/delete/group", {}, JSON.stringify(reactionPayload));
    };

    const sendMessage = () => {
        if (!input.trim() && !file) return;

        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];
                const msg = {
                    type: "IMAGE",
                    fileBase64: base64,
                    fileName: file.name,
                    replyToId: reply ? reply.id : null,
                    content: input,
                    groupId: group.id
                };
                try {
                    await axiosInstance.post(
                        "/api/messages/image",
                        msg,
                        { headers: { Authorization: token } }
                    );
                    setInput("");
                    setReply(null);
                    setFile(null);
                    shouldScrollToBottomRef.current = true;
                } catch (err) {
                    alert("Gửi ảnh thất bại!");
                }
            };
            reader.readAsDataURL(file);
        } else {
            // Gửi tin nhắn văn bản như bình thường
            const msg = {
                groupId: group.id,
                content: input,
                type: "TEXT",
                replyToId: reply ? reply.id : null
            };
            stompClient.current.send("/app/messages/group", {}, JSON.stringify(msg));
            setInput("");
            setReply(null);
            setFile(null);
            shouldScrollToBottomRef.current = true;
        }
    };

    const handleConfirmRevoke = () => {
        if (stompClient.current && stompClient.current.connected && revokeMsgId) {
            stompClient.current.send(
                "/app/messages/group/revoke",
                {},
                JSON.stringify(revokeMsgId)
            );
        }
        setRevokeMsgId(null);
    };

    const handleAddMember = async (userIds) => {
        try {
            await axiosInstance.post(`/api/groups/${group.id}/members/add`, { userIds })
            alert("Đã thêm thành công thành viên mới")
        } catch (error) {
            alert("Thêm thành viên thất bại")
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (!initialLoading) {
            scrollToBottom("auto");
        }
    }, [messages, initialLoading, scrollToBottom]);


    return (
        <div>
            {/* Header */}
            <div className="flex flex-col bg-gray-50 mx-auto w-full">
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            {group?.avatarUrl ? (
                                <img src={url + group.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                (group?.name[0])
                            )}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-base">
                                {group.name}
                            </div>
                            <div className="text-xs text-green-500">Đang hoạt động</div>
                        </div>
                    </div>
                    <div className="flex space-x-2 relative">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                        {/* Menu thêm xóa thành viên */}
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsOpenAddMemberModal(true)
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <UserPlus className="w-4 h-4 mr-3" />
                                        Thêm thành viên
                                    </button>


                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsOpenmembersModal(true)
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        
                                    >
                                        <UserMinus className="w-4 h-4 mr-3" />
                                        Xem thành viên
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {/* Tin nhắn */}
            <div
                className="flex-1 overflow-y-auto px-4 py-2 space-y-2 max-h-[40vh] scroll-smooth"
                onScroll={handleScroll}
                ref={messagesBoxRef}
                style={{ scrollBehavior: 'smooth' }}
            >
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
                        {messages.map((msg, idx) => {
                            const isMine = msg.sender && msg.sender.id === user.id;
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
                                            {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>

                                        {/* Reactions */}
                                        {msg.reactions && msg.reactions.length > 0 && (
                                            <div
                                                className={`absolute -bottom-0 ${isMine ? "left-[-13px]" : "right-[-13px]"} bg-white rounded-full px-2 py-1 shadow-sm border cursor-pointer flex items-center space-x-1`}
                                                onClick={() => openReactionModal(msg.reactions)}
                                            >
                                                <span className="text-xs">
                                                    {msg.reactions.length}
                                                </span>
                                                <span className="text-xs">
                                                    {REACTIONS.find(r => r.type === msg.reactions[msg.reactions.length - 1]?.reaction.reactionType)?.icon}
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
                                                                if (reaction.id !== 8) {
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
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Nhắn tin */}
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

            {/* Thu hồi và cảm xúc */}
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
            <AddMemberModal isOpen={isOpenAddMemberModal} onAddMembers={handleAddMember} onClose={closeAddMemberModal} groupId={group.id} />
            <GroupMembersModal isOpen={isOpenMembersModal} onClose={closeMembersModal} id={group.id}/>
        </div>

    )
}
export default ChatGroup