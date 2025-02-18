import { Route, Routes } from "react-router-dom"
import Slidebar from "../../Components/Slidebar/Slidebar"
import HomePage from "../HomePage/HomePage"
import Profile from "../Profile/Profile"

const Router = () => {
    return (
        <div>
            <div className="flex">
                    <div className="w-[20%] border border-1-slate-500 pl-10">
                        <Slidebar />
                    </div>

                <div className="w-full">
                    <Routes>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/username" element={<Profile />}></Route>
                    </Routes>
                </div>
            </div>

        </div>
    )
}
export default Router