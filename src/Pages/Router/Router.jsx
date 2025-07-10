import { Route, Routes } from "react-router-dom"
import Slidebar from "../../Components/Slidebar/Slidebar"
import HomePage from "../HomePage/HomePage"
import Profile from "../Profile/Profile"
import Story from "../Story/Story"
import { useEffect } from "react"
import Message from "../../Components/Message/Message"
import FriendShip from "../../Components/FriendShip/FriendShip"
import { useDispatch, useSelector } from "react-redux"
import { changeTheme } from "../../GlobalState/theme/Action"
import ProfilePage from "../../Components/ProfileAnother/ProfileAnother"
import FriendsListPage from "../../Components/FriendShip/FriendList"
import Notification from "../../Components/Notification/Notification"
import BottomNavBar from "../../Components/Slidebar/BottomNavBar"

//Private route tưc là route đã đã nhập
const Router = () => {

    const theme = useSelector(state => state.theme.theme); 
    const dispatch = useDispatch()


    useEffect(() => {
        console.log("Thêm" + theme);

    }, [theme])
    return (
        <div>

            <div className="flex ">
                <div className="w-0 lg:w-[20%] shadow-md pl-0 lg:pl-10 h-[100vh]">
                    <Slidebar />
                </div>

                <div className="w-full">
                    <Routes>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/username" element={<Profile />}></Route>
                        <Route path="/story" element={<Story />}></Route>
                        <Route path="/message" element={<Message />}></Route>
                        <Route path="/friendship" element={<FriendShip />}></Route>
                        <Route path="/profile/:userId" element={<ProfilePage />}></Route>
                        <Route path="/friend-list/:userId" element={<FriendsListPage />}></Route>
                        <Route path="/notification" element={<Notification />}></Route>
                    </Routes>
                </div>
            </div>
            <BottomNavBar />
        </div>
    )
}
export default Router