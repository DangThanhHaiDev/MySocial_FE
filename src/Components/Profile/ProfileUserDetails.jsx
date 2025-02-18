import { TbCircleDashed } from "react-icons/tb"

const ProfileUserDetails = () => {
    return (
        <div className="border p-10">
            <div className="flex items-center">
                <div className="w-[15]">
                    <img src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="Image"
                        className="w-32 h-32 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="flex space-x-10 items-center px-5">
                        <p>Username</p>
                        <button>Edit Profile</button>
                        <TbCircleDashed></TbCircleDashed>
                    </div>
                    <div className="flex space-x-10 px-5 items-center">
                        <div>
                            <span className="font-semibold mr-2">10</span>
                            <span>posts</span>
                        </div>
                        <div>
                            <span className="font-semibold mr-2">5</span>
                            <span>followers</span>
                        </div>
                        <div>
                            <span className="font-semibold mr-2">7</span>
                            <span>following</span>
                        </div>
                    </div>
                    <div className="text-left px-5">
                        <p className="font-semibold">Full name</p>
                        <p className="font-thin text-sm">Đặng Thành Hải</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileUserDetails