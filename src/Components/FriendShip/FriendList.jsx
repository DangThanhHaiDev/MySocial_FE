import React, { useEffect, useState } from 'react';
import { Search, UserPlus, MessageCircle, MoreHorizontal, Users, UserCheck, ArrowLeft } from 'lucide-react';
import { data, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../AppConfig/axiosConfig';
import { useSelector } from 'react-redux';

const FriendsListPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [allFriends, setAllFriends] = useState([])
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  const [mutualFriends, setMutualFriends] = useState([])

  const { userId } = useParams()

  useEffect(() => {
    getFriends()
    getMutualFriend()
  }, [])

  const getMutualFriend = async()=>{
    try {
      const response = await axiosInstance.get(`/api/friends/mutual/${userId}`)
      console.log(response.data);
      
      setMutualFriends(response.data)      
    } catch (error) {
      console.log(error);
    }
  }

  const getFriends = async () => {
    try {
      const response = await axiosInstance.get(`/api/friends/user/${userId}`)
      setAllFriends(response.data)

    } catch (error) {
      console.log(error);

    }
  }


  

  // Lọc bạn bè theo tìm kiếm
  const filterFriends = (friends) => {
    if (!searchTerm) return friends;
    return friends.filter(friend =>
      `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const currentFriends = activeTab === 'all' ? allFriends : mutualFriends;

  const filteredFriends = filterFriends(currentFriends);

  
   const handleNav = (userId) => {
    if (user.id == userId) {
      navigate('/username')
    }
    else {
      navigate(`/profile/${userId}`)
    }
  }

  

  const FriendCard = ({ friend, showMutualInfo = false }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={friend.avatarUrl}
            alt={`${friend.firstName} ${friend.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        {/* Thông tin bạn bè */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate text-left">
            {friend.firstName} {friend.lastName}
          </h3>

          <div className="text-sm text-gray-600 space-y-1 text-left">
            {friend.email && (
              <p>{friend.email}</p>
            )}

            {friend.address && (
              <p>{friend.address}</p>
            )}

            
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="hidden sm:inline" onClick={()=>handleNav(friend.id)}>Profile</span>
          </button>

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bạn bè</h1>
              <p className="text-gray-600">
                {activeTab === 'all' ? allFriends.length : mutualFriends.length} người bạn
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Tất cả bạn bè ({allFriends.length})
            </button>
            <button
              onClick={() => setActiveTab('mutual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'mutual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Bạn chung ({mutualFriends.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Friends List */}
        {filteredFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                showMutualInfo={activeTab === 'mutual'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy bạn bè' : 'Chưa có bạn bè nào'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `Không có bạn bè nào khớp với "${searchTerm}"`
                : 'Hãy bắt đầu kết bạn với mọi người!'
              }
            </p>
            {!searchTerm && (
              <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mx-auto">
                <UserPlus size={20} />
                Tìm bạn bè
              </button>
            )}
          </div>
        )}


      </div>

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
          <UserPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default FriendsListPage;