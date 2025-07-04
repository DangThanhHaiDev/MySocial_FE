import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share, MapPin, Calendar, Phone, Mail, Users, Camera, Edit3, UserPlus, UserCheck, UserX, MoreHorizontal } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../AppConfig/axiosConfig';
import PostCard from '../Post/PostCard';
import url from '../../AppConfig/urlApp';

const ProfilePage = () => {

    const { userId } = useParams()
    const [profile, setProfile] = useState()
    const [post, setPost] = useState([])
    const [friend, setFriend] = useState([])
    const [friendshipStatus, setFriendshipStatus] = useState("NONE");
    const [isOwnProfile] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        getUserProfile()
        getPosts()
        getFriends()
        getRelationship()
    }, [])

    const handleAccept = async () => {
        try {

            const response = await axiosInstance.post(`/api/friends/accept/profile/${userId}`);
            console.log(response);
            
            setFriendshipStatus("ACCEPTED")
        } catch (err) {
            alert("Lỗi khi chấp nhận lời mời!");
        }
    };

    const handleDecline = async () => {
    try {
      await axiosInstance.post(`/api/friends/decline/profile/${userId}`);
      setFriendshipStatus("NONE")
    } catch (err) {
      alert("Lỗi khi từ chối lời mời!");
    }
  };


    const getRelationship = async () => {
        try {
            const response = await axiosInstance.get(`/api/friends/relationship/${userId}`)
            const { data } = response

            setFriendshipStatus(data)
        } catch (error) {
            console.log(error);

        }
    }

    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get(`/api/users/profile/${userId}`)
            const { data } = response
            setProfile(data)

        } catch (error) {
            console.log(error);

        }
    }

    const getPosts = async () => {
        try {
            const repsonse = await axiosInstance.get(`/api/post/user/${userId}`)
            const { data } = repsonse
            setPost(data)

        } catch (error) {
            console.log(error);

        }
    }

    const getFriends = async () => {
        try {
            const response = await axiosInstance.get(`/api/friends/user/${userId}`)
            const { data } = response
            setFriend(data)
        } catch (error) {
            console.log(error);

        }
    }

    const handleAddFriend = async (userId) => {
        try {
            const resposne = await axiosInstance.post(`/api/friends/request/${userId}`)
            const { data } = resposne
            if (data.id) {
                setFriendshipStatus("PENDING")
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUnfriend = async () => {
    if (!window.confirm("Bạn chắc chắn muốn hủy kết bạn với người này?")) return;
    try {
      await axiosInstance.post(`/api/friends/unfriend/${userId}`);
      setFriendshipStatus("NONE")
    } catch (err) {
      alert("Hủy kết bạn thất bại!");
    }
  };




   

    const renderFriendButton = () => {


        switch (friendshipStatus) {
            case 'NONE':
                return (
                    <button
                        onClick={() => handleAddFriend(userId)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"

                    >
                        <UserPlus size={18} />
                        Kết bạn
                    </button>
                );
            case 'PENDING':
                return (
                    <button
                        disabled
                        className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                    >
                        <UserCheck size={18} />
                        Đã gửi lời mời
                    </button>
                );
            case 'ACCEPTED':
                return (
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                            <UserCheck size={18} />
                            Bạn bè
                        </button>
                        <button
                            onClick={() => handleUnfriend()}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <UserX size={18} />
                            Hủy kết bạn
                        </button>
                    </div>
                );
            case 'CONFIRM':
                return (
                    <div className='flex space-x-2'>
                        <button
                            onClick={() => handleAccept()}
                            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"

                        >
                            <UserPlus size={18} />
                            Chấp nhận
                        </button>
                        <button
                            onClick={() => handleDecline()}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <UserX size={18} />
                            Từ chối
                        </button>
                    </div>
                )
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover & Profile Header */}
            <div className="relative">
                {/* Cover Photo */}
                <div className="h-80 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    {isOwnProfile && (
                        <button className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded-lg hover:bg-opacity-100 transition-all">
                            <Camera size={20} />
                        </button>
                    )}
                </div>

                {/* Profile Info */}
                <div className="max-w-6xl mx-auto px-4 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={profile?.avatarUrl ? url + profile?.avatarUrl : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"}
                                alt={`${profile?.firstName} ${profile?.lastName}`}
                                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            {isOwnProfile && (
                                <button className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                                    <Camera size={16} />
                                </button>
                            )}
                        </div>

                        {/* User Info & Actions */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {profile?.firstName} {profile?.lastName}
                            </h1>

                            {profile?.biography && (
                                <p className="text-gray-600 mb-4 max-w-2xl">
                                    {profile?.biography}
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users size={16} />
                                        <span>{friend?.length} bạn bè</span>
                                    </div>
                                    {profile?.address && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{profile?.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {renderFriendButton()}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - About */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>

                            <div className="space-y-3">
                                {profile?.email && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail size={18} />
                                        <span>{profile?.email}</span>
                                    </div>
                                )}

                                {profile?.phone && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone size={18} />
                                        <span>{profile?.phone}</span>
                                    </div>
                                )}

                                {profile?.birthDate && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar size={18} />
                                        <span>Sinh ngày {formatDate(profile?.birthDate)}</span>
                                    </div>
                                )}

                                {profile?.address && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin size={18} />
                                        <span>Sống tại {profile?.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Friends Preview */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Bạn bè</h2>
                                <span className="text-gray-500 text-sm">{friend?.length}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 ">
                                {friend && friend.map((i) => (
                                    <div key={i} className="aspect-square shadow-md p-2 space-y-2">
                                        <img
                                            src={i.avatarUrl ? url + i.avatarUrl : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"}
                                            alt=""
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <p>{i?.firstName + " " + i?.lastName}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={()=>navigate(`/friend-list/${userId}`)}>
                                Xem tất cả bạn bè
                            </button>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {post.map((p) => (
                            <div key={p.id}>
                                <PostCard post={p} />
                            </div>
                        ))}

                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;