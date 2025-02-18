import ProfileUserDetails from "../../Components/Profile/ProfileUserDetails"
import ReqUserPostPart from "../../Components/Profile/ReqUserPostPart"

const Profile = () => {
    return (
        <div>
            <div>
                <ProfileUserDetails />
            </div>
            <div>
                <ReqUserPostPart />
            </div>
        </div>
    )
}

export default Profile