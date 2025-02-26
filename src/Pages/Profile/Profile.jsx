import ProfileUserDetails from "../../Components/Profile/ProfileUserDetails"
import ReqUserPostPart from "../../Components/Profile/ReqUserPostPart"

const Profile = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="w-[85%]">
                <div>
                    <ProfileUserDetails />
                </div>
                <div>
                    <ReqUserPostPart />
                </div>
            </div>

        </div>
    )
}

export default Profile