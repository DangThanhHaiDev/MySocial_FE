import {  AiFillHeart, AiFillMessage, AiFillPlusCircle, AiOutlineHeart, AiOutlineHome, AiOutlineMessage, AiOutlinePlusCircle, AiOutlineSearch, AiOutlineUsergroupAdd } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";



const SlideItems = [
    {title: "Trang chủ", icon: <AiOutlineHome className="text-2xl mr-5"></AiOutlineHome>, iactiveIcon: <AiFillHome className="text-2xl mr-5"></AiFillHome>},
    {title:"Tìm kiếm", icon: <AiOutlineSearch className="text-2xl mr-5"></AiOutlineSearch>, iactiveIcon: <AiOutlineSearch className="text-2xl mr-5"></AiOutlineSearch>},
    {title: "Tin nhắn", icon: <AiOutlineMessage className="text-2xl mr-5"></AiOutlineMessage>, iactiveIcon: <AiFillMessage className="text-2xl mr-5"></AiFillMessage>},
    {title: "Thông báo", icon: <AiOutlineHeart className="text-2xl mr-5"></AiOutlineHeart>, iactiveIcon: <AiFillHeart className="text-2xl mr-5"></AiFillHeart>},
    {title: "Bạn bè", icon: <AiOutlineUsergroupAdd className="text-2xl mr-5" />, iactiveIcon: <AiOutlineUsergroupAdd className="text-2xl mr-5 text-blue-500" />},
    {title: "Tạo bài viết", icon: <AiOutlinePlusCircle className="text-2xl mr-5"></AiOutlinePlusCircle>, iactiveIcon: <AiFillPlusCircle className="text-2xl mr-5"></AiFillPlusCircle>},
    {title: "Trang cá nhân", icon:<CgProfile className="text-2xl mr-5"></CgProfile>, iactiveIcon: <CgProfile className="text-2xl mr-5"></CgProfile>}
]

export default SlideItems