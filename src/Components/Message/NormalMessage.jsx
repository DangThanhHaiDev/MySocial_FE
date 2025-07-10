
const NormalMessage = ({ message }) => {
  
  const { senderName, lastMessage, timestamp, avatarUrl, isOnline } = message;
  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg w-[3000px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {senderName?.charAt(0) || 'A'}
            </div>
          )}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">{senderName || "Hà Anh"}</h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {timestamp || "1 giờ"}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate mt-1 text-left">
          {message.deleted ? "Tin nhắn đã được thu hồi" : lastMessage}
        </p>
      </div>
    </div>
  );
};

export default NormalMessage; 