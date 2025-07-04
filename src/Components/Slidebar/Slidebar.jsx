import img from '../../Resource/images/logo.jpg'
import SlieItems from "./SlideItems"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import CreatePostModal from '../Post/CreatePostModal';
import Search from "../Search/Search.jsx"
import SettingsModal from "./Setting.jsx";
import { IoSettings } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { getUserByJwt } from '../../GlobalState/auth/Action.js';

const Slidebar = () => {
    const [activeTab, setActiveTab] = useState("Home")
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const dispatch = useDispatch()
    const err = useSelector(state => state.auth.error)    

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        dispatch(getUserByJwt(navigate))
        navigate("/")
    }, [])

    useEffect(()=>{
        if(err){
            console.log("Oke có lỗi rồi Hải ơi");
            localStorage.removeItem("token")
            navigate("/")
        }
    }, [err])



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
        setActiveTab(title)
    }

    // Hàm xử lý click Settings
    const handleSettingsClick = () => {
        setIsSettingsOpen(true);
    }

    return (
        <div>
            <div className='fixed top-0 h-[100vh] flex'>
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <div className='pt-10'>
                            {activeTab !== "Search" && <img src={img} alt="Logo" className='w-20' />}
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

                    {/* Settings button với animation hover */}
                    <div
                        className='flex items-center cursor-pointer pb-10 hover:bg-gray-100 rounded-xl p-3 transition-all duration-300 transform hover:scale-105'
                        onClick={handleSettingsClick}
                    >
                        <IoSettings className="text-gray-600 hover:text-blue-600 transition-colors duration-300" />
                        {activeTab !== "Search" && <p className='ml-5 text-lg text-gray-600 hover:text-blue-600 transition-colors duration-300'>Setting</p>}
                    </div>
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