import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  Users,
  Camera,
  UserPlus,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../AppConfig/axiosConfig";
import PostCard from "../Post/PostCard";
import url from "../../AppConfig/urlApp";

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [post, setPost] = useState([]);
  const [friend, setFriend] = useState([]);
  const [friendshipStatus, setFriendshipStatus] = useState("NONE");
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  // Pagination states - tương tự SocialProfile
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  // Refs for infinite scroll
  const observerRef = useRef();
  const postRefs = useRef({});

  const assignRef = (postId) => (el) => {
    if (el) postRefs.current[postId] = el;
  };

  // Infinite scroll observer - tương tự SocialProfile
  const lastPostElementRefCallback = useCallback((node) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMorePosts();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [hasMore, isLoading]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset data when userId changes
  useEffect(() => {
    if (userId) {
      // Reset all states
      setProfile(null);
      setPost([]);
      setFriend([]);
      setFriendshipStatus("NONE");
      setCurrentPage(0);
      setHasMore(true);
      setTotalElements(0);
      
      // Load initial data
      getUserProfile();
      getFriends();
      getRelationship();
      getPosts(0, true);
    }
  }, [userId]);

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/profile/${userId}`);
      const { data } = response;
      setProfile(data);
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const getFriends = async () => {
    try {
      const response = await axiosInstance.get(`/api/friends/user/${userId}`);
      const { data } = response;
      setFriend(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error loading friends:', error);
      setFriend([]);
    }
  };

  const getRelationship = async () => {
    try {
      const response = await axiosInstance.get(`/api/friends/relationship/${userId}`);
      const { data } = response;
      setFriendshipStatus(data);
    } catch (error) {
      console.log('Error loading relationship:', error);
    }
  };

  // Posts loading - cải thiện tương tự SocialProfile
  const getPosts = async (page = 0, isRefresh = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    if (isRefresh) {
      setIsRefreshing(true);
    }

    try {
      const response = await axiosInstance.get(
        `/api/post/user/${userId}?page=${page}&size=${pageSize}`
      );
      const { data } = response;
      
      if (isRefresh) {
        // Reset posts for refresh
        setPost(data.content || []);
        setCurrentPage(data.page || 0);
        setHasMore(!data.last);
        setTotalElements(data.totalElements || 0);
      } else {
        // Append new posts for pagination
        setPost(prev => [...prev, ...(data.content || [])]);
        setHasMore(!data.last);
        setTotalElements(data.totalElements || 0);
      }
      
      setCurrentPage(data.page || page);
      
    } catch (error) {
      console.log('Error loading posts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadMorePosts = useCallback(() => {
    if (!hasMore || isLoading) return;
    getPosts(currentPage + 1, false);
  }, [currentPage, hasMore, isLoading]);

  const handleRefresh = () => {
    setPost([]);
    setCurrentPage(0);
    setHasMore(true);
    getPosts(0, true);
  };

  // Friend actions
  const handleAddFriend = async (userId) => {
    try {
      const response = await axiosInstance.post(`/api/friends/request/${userId}`);
      const { data } = response;
      if (data.id) {
        setFriendshipStatus("PENDING");
      }
    } catch (error) {
      console.log('Error adding friend:', error);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await axiosInstance.post(`/api/friends/accept/profile/${userId}`);
      console.log(response);
      setFriendshipStatus("ACCEPTED");
    } catch (err) {
      alert("Lỗi khi chấp nhận lời mời!");
    }
  };

  const handleDecline = async () => {
    try {
      await axiosInstance.post(`/api/friends/decline/profile/${userId}`);
      setFriendshipStatus("NONE");
    } catch (err) {
      alert("Lỗi khi từ chối lời mời!");
    }
  };

  const handleUnfriend = async () => {
    if (!window.confirm("Bạn chắc chắn muốn hủy kết bạn với người này?")) return;
    
    try {
      await axiosInstance.post(`/api/friends/unfriend/${userId}`);
      setFriendshipStatus("NONE");
    } catch (err) {
      alert("Hủy kết bạn thất bại!");
    }
  };

  const renderFriendButton = () => {
    switch (friendshipStatus) {
      case "NONE":
        return (
          <button
            onClick={() => handleAddFriend(userId)}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus size={18} />
            Kết bạn
          </button>
        );
      case "PENDING":
        return (
          <button
            disabled
            className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
          >
            <UserCheck size={18} />
            Đã gửi lời mời
          </button>
        );
      case "ACCEPTED":
        return (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
              <UserCheck size={18} />
              Bạn bè
            </button>
            <button
              onClick={handleUnfriend}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <UserX size={18} />
              Hủy kết bạn
            </button>
          </div>
        );
      case "CONFIRM":
        return (
          <div className="flex space-x-2">
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <UserPlus size={18} />
              Chấp nhận
            </button>
            <button
              onClick={handleDecline}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <UserX size={18} />
              Từ chối
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleNav = (userId) => {
    if (user.id == userId) {
      navigate("/username");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  // Safe arrays
  const safeFriend = Array.isArray(friend) ? friend : [];
  const safePost = Array.isArray(post) ? post : [];

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải hồ sơ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover & Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-80 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Info */}
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  profile?.avatarUrl
                    ? url + profile?.avatarUrl
                    : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"
                }
                alt={`${profile?.firstName} ${profile?.lastName}`}
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
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
                    <span>{safeFriend.length} bạn bè</span>
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
                <span className="text-gray-500 text-sm">{safeFriend.length}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {safeFriend.map((i) => (
                  <div
                    key={i.id}
                    className="aspect-square shadow-md p-2 space-y-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handleNav(i.id)}
                  >
                    <img
                      src={
                        i.avatarUrl
                          ? url + i.avatarUrl
                          : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"
                      }
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <p className="text-xs truncate">{i?.firstName + " " + i?.lastName}</p>
                  </div>
                ))}
              </div>

              {safeFriend.length > 0 && (
                <button
                  className="w-full mt-4 py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => navigate(`/friend-list/${userId}`)}
                >
                  Xem tất cả bạn bè
                </button>
              )}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="lg:col-span-2">
            {/* Posts Header with Refresh Button */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Bài viết ({totalElements})
                </h3>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {safePost.map((p, index) => (
                <div 
                  key={p.id} 
                  ref={index === safePost.length - 1 && hasMore ? lastPostElementRefCallback : assignRef(p.id)}
                >
                  <PostCard post={p} />
                </div>
              ))}
            </div>

            {/* Loading Indicator */}
            {isLoading && !isRefreshing && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang tải thêm bài viết...</span>
                </div>
              </div>
            )}

            {/* End of Posts Indicator */}
            {!hasMore && safePost.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Đã hiển thị hết tất cả bài viết</p>
              </div>
            )}

            {/* Empty State */}
            {safePost.length === 0 && !isLoading && !isRefreshing && (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có bài viết nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;