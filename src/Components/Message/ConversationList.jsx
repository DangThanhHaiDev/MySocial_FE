import React from "react";
import UnreadMessage from "./UnreadMessage";
import GroupMessage from "./GroupMessage";
import NormalMessage from "./NormalMessage";

const ConversationList = ({ unreadMessages, groupMessages, normalMessages, onSelectUser }) => (
  <div className="divide-y divide-gray-200">
    {/* Tin nhắn chưa đọc */}
    {unreadMessages.map((message, index) => (
      <div key={`unread-${index}`} onClick={() => onSelectUser && onSelectUser(message)} className="cursor-pointer">
        <UnreadMessage message={message} />
      </div>
    ))}
    {/* Tin nhắn nhóm */}
    {groupMessages.map((message, index) => (
      <div key={`group-${index}`} /* onClick={() => ...} */>
        <GroupMessage message={message} />
      </div>
    ))}
    {/* Tin nhắn bình thường */}
    {normalMessages.map((message, index) => (
      <div key={`normal-${index}`} onClick={() => onSelectUser && onSelectUser(message)} className="cursor-pointer">
        <NormalMessage message={message} />
      </div>
    ))}
  </div>
);

export default ConversationList; 