import React from "react";

const GroupMessage = ({ message }) => {
  const { groupName, lastMessage, lastSender, timestamp, avatarUrls, unreadCount } = message;
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg">
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {groupName?.charAt(0) || 'G'}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 border-2 border-white overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
            {lastSender?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 truncate">{groupName || "Nhóm bạn bè"}</h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {timestamp || "2 giờ"}
          </span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-sm text-gray-600 font-medium">{lastSender || "Minh"}:</span>
          <p className="text-sm text-gray-600 truncate">
            {lastMessage || "Hẹn gặp lại các bạn nhé!"}
          </p>
        </div>
      </div>
      {unreadCount && (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">{unreadCount}</span>
        </div>
      )}
    </div>
  );
};

export default GroupMessage; 