import img from '../../Resource/images/ig.png'
import { IoReorderThree } from "react-icons/io5";
import SlieItems from "./SlideItems"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import CreatePostModal from '../Post/CreatePostModal';
import Search from "../Search/Search.jsx"


const Slidebar = () => {
    const [activeTab, setActiveTab] = useState()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleCloseSearch = ()=>{
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
        setActiveTab(title)
    }

    return (
        <div className='sticky top-0 h-[100vh] flex'>
            <div className='flex flex-col justify-between h-full'>
                <div>
                    <div className='pt-10'>
                        {activeTab !== "Search" && <img src={img} alt="Logo" className='w-40' />}
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
                <div className='flex items-center cursor-pointer pb-10'>
                    <IoReorderThree />
                    {activeTab !== "Search" && <p className='ml-5 text-lg'>More</p>}
                </div>
            </div>
            <CreatePostModal onClose={onClose} isOpen={isOpen} />
            {activeTab === "Search" && <Search handleCloseSearch={handleCloseSearch} />}

        </div>
    )
}

export default Slidebar