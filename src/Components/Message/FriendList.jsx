import React from "react";

const FriendList = ({ friends, friendSearch, setFriendSearch, selectedUser, setSelectedUser, loadingFriends }) => (
  <div className="p-4 border-b bg-gray-50">
    <input
      type="text"
      className="border p-2 rounded w-full mb-2"
      placeholder="Tìm bạn bè để nhắn tin..."
      value={friendSearch}
      onChange={e => setFriendSearch(e.target.value)}
    />
    {loadingFriends ? (
      <div>Đang tải danh sách bạn bè...</div>
    ) : (
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {friends.length === 0 && <div className="text-gray-500">Không có bạn bè phù hợp</div>}
        {friends.map(friend => (
          <div
            key={friend.id}
            className={`flex flex-col items-center cursor-pointer px-2 ${selectedUser?.id === friend.id ? 'bg-blue-100 rounded' : ''}`}
            onClick={() => setSelectedUser(friend)}
            title={friend.firstName + ' ' + friend.lastName}
          >
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white mb-1">
              {friend.avatarUrl ? (
                <img src={friend.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                (friend.firstName?.charAt(0) || "?")
              )}
            </div>
            <span className="text-xs text-gray-700 truncate w-16 text-center">{friend.firstName} {friend.lastName}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default FriendList; 