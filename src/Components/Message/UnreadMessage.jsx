import React from "react";

const UnreadMessage = ({ message }) => {
  const { senderName, lastMessage, timestamp, avatarUrl, unreadCount, isOnline } = message;
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-blue-50 cursor-pointer rounded-lg bg-blue-25">
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
              {senderName?.charAt(0) || 'T'}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 truncate">{senderName || "Tuấn Anh"}</h3>
          <span className="text-xs text-blue-600 font-semibold ml-2 flex-shrink-0">
            {timestamp || "5 phút"}
          </span>
        </div>
        <p className="text-sm text-gray-900 font-semibold truncate mt-1 text-left">
          {lastMessage || "Bạn có rảnh không? Mình muốn hỏi một chút"}
        </p>
      </div>
      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-bold">{unreadCount || "2"}</span>
      </div>
    </div>
  );
};

export default UnreadMessage; 