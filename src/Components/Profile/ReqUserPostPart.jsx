import { useState } from "react"
import { AiOutlineTable, AiOutlineUser } from "react-icons/ai"
import { BiBookmark } from "react-icons/bi"
import { RiVideoAddLine } from "react-icons/ri"
import ReqUserPostCard from "./ReqUserPostCard"

const ReqUserPostPart = () => {
    const tabs = [
        { tab: "Post", icon: <AiOutlineTable></AiOutlineTable>, activeTab: "" },
        { tab: "Reels", icon: <RiVideoAddLine></RiVideoAddLine> },
        { tab: "Saved", icon: <BiBookmark></BiBookmark> },
        { tab: "Tagged", icon: <AiOutlineUser></AiOutlineUser> }
    ]

    const [activeTab, setActiveTab] = useState()

    const handleOnTab = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div>
            <div className="flex space-x-14 relative">
                {
                    tabs.map((item, index) => (
                        <div key={index} onClick={() => handleOnTab(item.tab)} className={`flex items-center cursor-pointer py-2 text-sm ${activeTab === item.tab ? 'font-semibold border-t-2 border-black' : ''}`}>
                            <p>{item.icon}</p>
                            <p className="ml-1">{item.tab}</p>
                        </div>
                    ))
                }
            </div>
            <div>
                <div className="flex flex-wrap">
                    {
                        [1, 2, 3, 4, 5, 6,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item, index) => (
                            <div className="p-2">
                                <ReqUserPostCard />

                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ReqUserPostPart