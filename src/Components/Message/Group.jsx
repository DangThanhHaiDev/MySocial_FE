import { Button } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import CreateGroupModal from "./CreatedGroupModal"
import axiosInstance from "../../AppConfig/axiosConfig"
import url from "../../AppConfig/urlApp"
import ChatGroup from "./ChatGroup"
import { Stomp } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const Group = ({ currentUser }) => {
    const [isOpenGroupCreatedModal, setIsOpenGroupCreatedModal] = useState(false)

    const [group, setGroup] = useState([])
    const [search, setSearch] = useState("")
    const [conversations, setConversations] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)
    const stompClient = useRef(null);


    useEffect(() => {
        reloadConversations()
    }, [])

    useEffect(() => {
        if (!currentUser?.id) return

        if (stompClient.current?.connected) {
            stompClient.current.disconnect(() => {
                console.log("❌ Disconnected (out of screen)");
            });
        }


        const token = localStorage.getItem("token");
        if (!token) return;
        if (stompClient.current?.connected) return;

        stompClient.current = Stomp.over(() => new SockJS(`${url}/ws?token=${token}`));
        stompClient.current.reconnect_delay = 5000;

        stompClient.current.connect({}, () => {


            stompClient.current.subscribe(`/topic/conversations/group/${currentUser.id}`, (message) => {
                console.log("Hải ơi");
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

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                let url = "/api/friends/l";
                if (search.trim() !== "") {
                    url = `/api/friends/search?q=${encodeURIComponent(search)}`;
                }
                const res = await axiosInstance.get(url);
                setGroup(res.data);
                console.log(res.data);

            } catch (e) {
                setGroup([]);
            }
        };
        fetchGroup();
    }, [search]);


    const handleCloseGroupCreatedModal = () => {
        setIsOpenGroupCreatedModal(false)
    }

    const handleCreateGroup = async (groupName) => {
        try {
            await axiosInstance.post('/api/groups', { groupName })
            alert("Bạn đã tạo nhóm thành công")
        } catch (error) {
            alert("Lỗi khi tạo nhóm")
        }
    }

    const handleCloseChatGroup = () => {
        setSelectedGroup(null)
    }



    const reloadConversations = async () => {
        try {
            const res = await axiosInstance.get("/api/conversations/group");
            setConversations(res.data);
        } catch (error) {
            console.error("❌ Error reloading conversations:", error);
        }
    };

    useEffect(() => {
        if (!selectedGroup) {

            reloadConversations()
        }
        console.log(selectedGroup);

    }, [selectedGroup])

    return (
        <div>
            {
                !selectedGroup
                    ?
                    <div>
                        <div className="p-4 border-b bg-gray-50">
                            <div className="text-left p-3">
                                <Button size={"sm"} onClick={() => setIsOpenGroupCreatedModal(true)}>Tạo nhóm</Button>
                            </div>
                            <input
                                type="text"
                                className="border p-2 rounded w-full mb-2"
                                placeholder="Tìm nhóm để nhắn tin..."
                            />
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {group.length === 0 && <div className="text-gray-500">Không có nhóm phù hợp</div>}
                            </div>
                        </div>

                        <div>
                            {
                                conversations.length > 0 && conversations.map((conversation) => {
                                    if (conversation.unreadCount === 0) {
                                        return (
                                            <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg w-[3000px]" onClick={() => setSelectedGroup(conversation)}>
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">

                                                        {conversation?.avatarUrl ? (
                                                            <img src={url + conversation.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                                                                {'A'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {conversation?.isOnline && (
                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-medium text-gray-900 truncate">{conversation?.name}</h3>
                                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                            {conversation?.timestamp || "1 giờ"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate mt-1 text-left">
                                                        {
                                                            conversation?.deleted ? "Tin nhắn đã được thu hồi" : conversation?.lastMessage ? conversation.lastMessage : "Chưa có tin nhắn nào"
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )

                                    }
                                    return (
                                        <div className="flex items-center space-x-3 p-3 hover:bg-blue-50 cursor-pointer rounded-lg bg-blue-25" onClick={() => setSelectedGroup(conversation)}>
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                                                    {conversation.avatarUrl ? (
                                                        <img src={url + conversation.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
                                                            {conversation.name}
                                                        </div>
                                                    )}
                                                </div>
                                                {conversation.isOnline && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-bold text-gray-900 truncate">{conversation.name}</h3>
                                                    <span className="text-xs text-blue-600 font-semibold ml-2 flex-shrink-0">
                                                        {conversation.timestamp || "5 phút"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-900 font-semibold truncate mt-1 text-left">
                                                    {conversation?.deleted ? "Tin nhắn đã được thu hồi" : conversation.lastMessage
                                                    }
                                                </p>
                                            </div>
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-white font-bold">{conversation.unreadCount || "2"}</span>
                                            </div>
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                    </div>
                    :
                    <ChatGroup user={currentUser} onClose={handleCloseChatGroup} group={selectedGroup} />
            }


            <CreateGroupModal isOpen={isOpenGroupCreatedModal} handleCreateGroup={handleCreateGroup} handleClose={handleCloseGroupCreatedModal} x />
        </div>
    )
}

export default Group