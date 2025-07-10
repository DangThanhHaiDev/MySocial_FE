import { AiFillCompass, AiFillHeart, AiFillMessage, AiFillPlusCircle, AiOutlineCompass, AiOutlineHeart, AiOutlineHome, AiOutlineMessage, AiOutlinePlusCircle, AiOutlineSearch, AiOutlineUsergroupAdd } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { RiVideoAiFill, RiVideoAiLine } from "react-icons/ri";



const SlideItems = [
    {title: "Home", icon: <AiOutlineHome className="text-2xl mr-5"></AiOutlineHome>, iactiveIcon: <AiFillHome className="text-2xl mr-5"></AiFillHome>},
    {title:"Search", icon: <AiOutlineSearch className="text-2xl mr-5"></AiOutlineSearch>, iactiveIcon: <AiOutlineSearch className="text-2xl mr-5"></AiOutlineSearch>},
    {title: "Message", icon: <AiOutlineMessage className="text-2xl mr-5"></AiOutlineMessage>, iactiveIcon: <AiFillMessage className="text-2xl mr-5"></AiFillMessage>},
    {title: "Notification", icon: <AiOutlineHeart className="text-2xl mr-5"></AiOutlineHeart>, iactiveIcon: <AiFillHeart className="text-2xl mr-5"></AiFillHeart>},
    {title: "FriendShip", icon: <AiOutlineUsergroupAdd className="text-2xl mr-5" />, iactiveIcon: <AiOutlineUsergroupAdd className="text-2xl mr-5 text-blue-500" />},
    {title: "Create", icon: <AiOutlinePlusCircle className="text-2xl mr-5"></AiOutlinePlusCircle>, iactiveIcon: <AiFillPlusCircle className="text-2xl mr-5"></AiFillPlusCircle>},
    {title: "Profile", icon:<CgProfile className="text-2xl mr-5"></CgProfile>, iactiveIcon: <CgProfile className="text-2xl mr-5"></CgProfile>}
]

export default SlideItems