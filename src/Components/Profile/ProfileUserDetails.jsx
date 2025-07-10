
import { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, Edit3 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../AppConfig/axiosConfig';
import UpdateModal from './UpdateModal';
import { updateUser } from "../../GlobalState/auth/Action"
import PostCard from "../Post/PostCard";
import url from '../../AppConfig/urlApp';
import UpdateAvatarModal from './UpdateAvatar';
import { useSearchParams } from 'react-router-dom';

const SocialProfile = () => {
    const user = useSelector(state => state.auth.user)
    const [friend, setFriend] = useState([])
    const [post, setPost] = useState([])
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false)
    const dispatch = useDispatch()
    const [isOpenUpdateAvatar, setisOpenUpdateAvatar] = useState(false)
    const [searchParams] = useSearchParams()
    const postRefs = useRef({});

    const assignRef = (postId) => (el) => {
        if (el) postRefs.current[postId] = el;
    };



    useEffect(() => {
        getFriends()
        getPosts()
    }, [])

    useEffect(() => {
        const postId = searchParams.get("postId");
        if (post.length > 0 && postId && postRefs.current[postId]) {
            postRefs.current[postId].scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Optional: highlight bài viết
            postRefs.current[postId].classList.add("ring", "ring-blue-400", "rounded-md");
            setTimeout(() => {
                postRefs.current[postId]?.classList.remove("ring", "ring-blue-400");
            }, 3000);
        }
    }, [post]);



    const openUpdateModal = () => {
        setIsOpenUpdateModal(true)
    }

    const closeUpdateModal = () => {
        setIsOpenUpdateModal(false)
    }

    const openUpdateAvatarModal = () => {
        setisOpenUpdateAvatar(true)
    }

    const closeUpdateAvatarModal = () => {
        setisOpenUpdateAvatar(false)
    }

    const handleUpdate = async (request) => {
        dispatch(updateUser(request))
        setIsOpenUpdateModal(false)
    }

    const getFriends = async () => {
        try {
            const response = await axiosInstance.get("/api/friends/list")
            const { data } = response
            setFriend(data)
        } catch (error) {
            alert("Danh sách bạn bè đang có vấn đề")
        }
    }

    const getPosts = async () => {
        try {
            const respone = await axiosInstance.get("/api/post/user")
            const { data } = respone
            console.log("Hẹ hẹ hẹ ");
            console.log(data);

            setPost(data)
        } catch (error) {
            console.log(error);

        }
    }

    const safeFriend = Array.isArray(friend) ? friend : [];
    const safePost = Array.isArray(post) ? post : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto p-4">


                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-200">

                    <div className="flex items-center gap-6 relative">
                        <div className='relative'>
                            <img
                                src={user?.avatarUrl ? url + user.avatarUrl : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"}
                                alt={`${user?.firstName} ${user?.lastName}`}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <button className="absolute -bottom-1 -right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg" onClick={openUpdateAvatarModal}>
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>

                        <button className="absolute -bottom-[20px] -right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg" onClick={openUpdateModal}>
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="text-gray-600 mt-1">{user?.biography ? user?.biography : "Chưa cập nhật tiểu sử"}</p>

                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">

                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {user?.address ? user?.address : "Chưa cập nhật vị trí"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(user?.birthDate).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="font-bold text-lg">{safeFriend.length}</div>
                            <div className="text-sm text-gray-500">Bạn bè</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Sidebar */}
                    <div className="md:col-span-1">

                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Thông tin</h3>
                            <div className="space-y-2 text-sm">
                                <p className='text-left'><span className="font-medium">Email:</span> {user?.email}</p>
                                <p className='text-left'><span className="font-medium">Điện thoại:</span> {user?.phone}</p>
                                <p className='text-left'><span className="font-medium">Giới tính:</span> {user?.gender ? 'Nam' : 'Nữ'}</p>
                            </div>
                        </div>

                        {/* Bạn bè */}
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Bạn bè ({safeFriend.length})</h3>
                            <div className="space-y-3">
                                {safeFriend.map((f) => (
                                    <div key={f.id} className="flex items-center gap-3">
                                        <img
                                            src={f.avatarUrl}
                                            alt={`${f.firstName} ${f.lastName}`}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="text-sm font-medium">
                                            {f.firstName} {f.lastName}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2">

                        {/* Posts */}
                        <div className="space-y-4">
                            {safePost.map((p) => (
                                <div key={p.id} ref={assignRef(p.id)}
                                >
                                    <PostCard post={p} />

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <UpdateModal isOpen={isOpenUpdateModal} onClose={closeUpdateModal} user={user} onSave={handleUpdate} />
            <UpdateAvatarModal isOpen={isOpenUpdateAvatar} onClose={closeUpdateAvatarModal} />
        </div>
    );
};

export default SocialProfile;