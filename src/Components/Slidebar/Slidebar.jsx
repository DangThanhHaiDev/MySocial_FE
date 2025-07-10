import img from '../../Resource/images/logo.jpg'
import SlieItems from "./SlideItems"
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import CreatePostModal from '../Post/CreatePostModal';
import Search from "../Search/Search.jsx"
import SettingsModal from "./Setting.jsx";
import { IoSettings, IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { getUserByJwt, logout } from '../../GlobalState/auth/Action.js';
import NotificationBell from "../Notification/NotificationBell";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import axiosInstance from "../../AppConfig/axiosConfig";

const Slidebar = () => {
    const [activeTab, setActiveTab] = useState("Home")
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const dispatch = useDispatch()
    const err = useSelector(state => state.auth.error)    

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const stompClient = useRef(null);
    const userId = useSelector((state) => state.auth?.user?.id);
    const token = localStorage.getItem("token");

    useEffect(() => {
        dispatch(getUserByJwt(navigate))
        navigate("/")
        fetchUnread();
        connectWebSocket();
        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect(() => {});
            }
        };
    }, [])

    useEffect(()=>{
        if(err){
            console.log("Oke có lỗi rồi Hải ơi");
            localStorage.removeItem("token")
            navigate("/")
        }
    }, [err])

    useEffect(() => {
        fetchUnread();
        connectWebSocket();
        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect(() => {});
            }
        };
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

    const handleCloseSearch = () => {
        setActiveTab("")
    }

    const handleOnTab = (title) => {
        if (title === "Profile") {
            navigate("/username")
        }
        else if (title === "Home") {
            navigate("/")
        }
        else if (title === "Create") {
            onOpen()
        }
        else if (title === "Message") {
            navigate("/message")
        }
        else if (title === "FriendShip") {
            navigate("/friendship")
        }
        else if(title === "Notification"){
            navigate("/Notification")
        }
        setActiveTab(title)
    }

    // Hàm xử lý click Settings
    const handleSettingsClick = () => {
        setIsSettingsOpen(true);
    }

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.clear();
        dispatch(logout())
        navigate("/");
    }

    return (
        <div>
            <div className='fixed top-0 h-[100vh] flex z-50 hidden lg:flex'>
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <div className='pt-10 flex items-center justify-between'>
                            {activeTab !== "Search" && <img src={img} alt="Logo" className='w-20' />}
                            <div className="ml-4"><NotificationBell hasUnread={hasUnread} /></div>
                        </div>
                        <div className='mt-10'>
                            {
                                SlieItems.map((item, index) => (
                                    <div key={index} onClick={() => handleOnTab(item.title)} className='flex items-center cursor-pointer text-lg mb-5'>
                                        <p>{item.title === activeTab ? item.iactiveIcon : item.icon}</p>
                                        {activeTab !== "Search" && <p className={item.title === activeTab ? 'font-bold' : 'font-semibold'}>{item.title}</p>}
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Nút Đăng xuất */}
                    <div
                        className='flex items-center justify-center cursor-pointer mb-6 rounded-xl p-3 transition-all duration-200 text-red-600 bg-red-50 hover:bg-red-200 hover:shadow-md hover:scale-105'
                        onClick={handleLogout}
                    >
                        <IoLogOutOutline className="text-2xl mr-3" />
                        {activeTab !== "Search" && <p className='ml-2 text-lg font-semibold'>Đăng xuất</p>}
                    </div>

                    {/* Settings button với animation hover */}
                    {/* <div
                        className='flex items-center cursor-pointer pb-10 hover:bg-gray-100 rounded-xl p-3 transition-all duration-300 transform hover:scale-105'
                        onClick={handleSettingsClick}
                    >
                        <IoSettings className="text-gray-600 hover:text-blue-600 transition-colors duration-300" />
                        {activeTab !== "Search" && <p className='ml-5 text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300'>Setting</p>}
                    </div> */}
                </div>

                {/* Modals */}

                {activeTab === "Search" && <Search handleCloseSearch={handleCloseSearch} />}

            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
            <CreatePostModal onClose={onClose} isOpen={isOpen} />

        </div>

    )
}

export default Slidebar