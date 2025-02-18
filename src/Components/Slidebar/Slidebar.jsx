import img from '../../Resource/images/ig.png'
import { IoReorderThree } from "react-icons/io5";
import SlieItems from "./SlideItems"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Slidebar = () => {
    const [activeTab, setActiveTab] = useState()
    const navigate  = useNavigate()

    const handleOnTab = (title)=>{
        if(title === "Profile"){
            navigate("/username")
        }
        else if(title === "Home"){
            navigate("/")
        }
        setActiveTab(title)
    }

    return (
        <div className='sticky top-0 h-[100vh]'>    
            <div className='flex flex-col justify-between h-full'>
                <div>
                    <div className='pt-10'>
                        <img src={img} alt="Logo" className='w-40' />
                    </div>
                    <div className='mt-10'>
                        {
                            SlieItems.map((item, index) => (
                                <div key={index} onClick={() => handleOnTab(item.title)} className='flex items-center cursor-pointer text-lg mb-5'>
                                    <p>{item.title === activeTab ? item.iactiveIcon : item.icon}</p>
                                    <p className={item.title === activeTab?'font-bold': 'font-semibold'}>{item.title}</p>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className='flex items-center cursor-pointer pb-10'>
                    <IoReorderThree />
                    <p className='ml-5 text-lg'>More</p>
                </div>
            </div>

        </div>
    )
}

export default Slidebar