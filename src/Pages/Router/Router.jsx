import { Route, Routes } from "react-router-dom"
import Slidebar from "../../Components/Slidebar/Slidebar"
import HomePage from "../HomePage/HomePage"
import Profile from "../Profile/Profile"
import Story from "../Story/Story"
import { useEffect } from "react"

//Private route tưc là route đã đã nhập
const Router = () => {
   

    return (
        <div>
            <div className="flex">
                    <div className="w-[20%] shadow-md pl-10">
                        <Slidebar />
                    </div>

                <div className="w-full">
                    <Routes>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/username" element={<Profile />}></Route>
                        <Route path="/story" element={<Story />}></Route>
                    </Routes>
                </div>
            </div>

        </div>
    )
}
export default Router