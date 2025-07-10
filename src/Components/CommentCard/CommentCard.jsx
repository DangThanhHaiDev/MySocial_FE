// import { useState } from "react"
// import { FaThumbsUp, FaLaugh, FaSadTear, FaAngry, FaSurprise } from "react-icons/fa";
// import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
// import ConfirmDeleteModal from "../Post/DeletedPostConfirm"
// import axiosInstance from "../../AppConfig/axiosConfig";
// import url from "../../AppConfig/urlApp";

// // Các loại cảm xúc mẫu (có thể lấy từ backend)
// const REACTIONS = [
//   { id: 1, type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
//   { id: 2, type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
//   { id: 3, type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
//   { id: 4, type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
//   { id: 5, type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
//   { id: 6, type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' },
// ];

// const CommentCard = ({ comment, onReply, onDelete, onEdit, currentUserId, postOwnerId, reloadComments, img }) => {
//     const [isCommentLike, setIsCommentLike] = useState(false)
//     const [showReplyInput, setShowReplyInput] = useState(false)
//     const [replyText, setReplyText] = useState("")
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [editText, setEditText] = useState(comment.content);
//     const [showReactions, setShowReactions] = useState(false);
//     const [hoverTimeout, setHoverTimeout] = useState(null);
//     const [localReactions, setLocalReactions] = useState(comment.reactions || []);

//     const handleLikeComment = () => {
//         setIsCommentLike(!isCommentLike)
//     }

//     const handleReply = () => {
//         setShowReplyInput(true)
//     }

//     const handleSendReply = () => {
//         if (onReply && replyText.trim()) {
//             onReply(replyText, comment.id)
//             setReplyText("")
//             setShowReplyInput(false)
//         }
//     }

//     const canDelete = currentUserId === comment.user.id || currentUserId === postOwnerId;

//     // Gọi API thả cảm xúc
//     const handleReact = async (reactionId) => {
//         try {
//             await axiosInstance.post("/api/comment-reactions/react", {
//                 commentId: comment.id,
//                 reactionId,
//             });
//             // Cập nhật UI ngay
//             setLocalReactions(prev => [
//                 ...prev.filter(r => r.userId !== currentUserId),
//                 {
//                     id: Math.random(), // tạm, nếu backend không trả về id
//                     userId: currentUserId,
//                     reactionId,
//                     reactionType: REACTIONS.find(r => r.id === reactionId).type,
//                     reactionTitle: REACTIONS.find(r => r.id === reactionId).title,
//                     urlReaction: "",
//                 },
//             ]);
//             setShowReactions(false);
//         } catch (e) {
//             alert("Có lỗi khi thả cảm xúc!");
//         }
//     };

//     // Gọi API xóa cảm xúc
//     const handleRemoveReaction = async () => {
//         try {
//             await axiosInstance.delete(`/api/comment-reactions/react/${comment.id}`);
//             // Cập nhật UI ngay
//             setLocalReactions(prev => prev.filter(r => r.userId !== currentUserId));
//         } catch (e) {
//             alert("Có lỗi khi xóa cảm xúc!");
//         }
//     };

//     // Kiểm tra user đã thả cảm xúc gì chưa
//     const myReaction = localReactions?.find(r => r.userId === currentUserId);
//     const myReactionType = myReaction?.reactionType;

//     // Lấy các loại cảm xúc duy nhất đã có
//     const uniqueReactionTypes = Array.from(
//       new Set(localReactions.map(r => r.reactionType?.toUpperCase()))
//     );

//     return (
//         <div style={{ marginLeft: comment.parent ? 24 : 0, borderLeft: comment.parent ? '1px solid #eee' : 'none', paddingLeft: comment.parent ? 12 : 0 }}>
//             <div className="flex items-center justify-between py-5">
//                 <div className="flex items-center"> 
//                     <div>
//                         <img className="w-9 h-9 rounded-full" src={img ? url+img : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t" } alt="" />
//                     </div>
//                     <div className="ml-3">
//                         <p>
//                             <span className="font-semibold">{comment.user.firstName + " " + comment.user.lastName}</span>
//                             <span className="ml-3">{comment.content}</span>
//                         </p>
//                         <div className="flex items-center space-x-3 text-xs opacity-60 pt-2">
//                             <span>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
//                             {/* Hiển thị các icon cảm xúc duy nhất và tổng số cảm xúc */}
//                             <span className="flex items-center">
//                               {uniqueReactionTypes.map(type => {
//                                 const react = REACTIONS.find(r => r.type === type);
//                                 return react ? (
//                                   <span key={type} title={react.title} style={{ marginRight: 2, fontSize: 18 }}>
//                                     {react.icon}
//                                   </span>
//                                 ) : null;
//                               })}
//                               <span style={{ marginLeft: 4, color: "#888" }}>{localReactions.length}</span>
//                             </span>
//                             {/* Nút thả cảm xúc nổi bật nếu user đã thả */}
//                             <span
//                               className={`text-xl cursor-pointer hover:opacity-70 transition ${myReactionType ? 'border-2 border-blue-500 rounded-full' : ''}`}
//                               onClick={() => {
//                                 if (myReactionType) handleRemoveReaction();
//                                 else setShowReactions(true);
//                               }}
//                             >
//                               {myReactionType && REACTIONS.find(r => r.type === myReactionType.toUpperCase())
//                                 ? REACTIONS.find(r => r.type === myReactionType.toUpperCase()).icon
//                                 : <AiOutlineHeart className="text-xl" />}
//                             </span>
//                             {/* Popup chọn cảm xúc */}
//                             <div
//                               className="relative group"
//                               onMouseEnter={() => {
//                                 if (hoverTimeout) clearTimeout(hoverTimeout);
//                                 setShowReactions(true);
//                               }}
//                               onMouseLeave={() => {
//                                 setHoverTimeout(setTimeout(() => setShowReactions(false), 200));
//                               }}
//                             >
//                               {showReactions && (
//                                 <div className="absolute top-8 left-0 flex gap-2 bg-white border px-2 py-1 rounded shadow z-20">
//                                   {REACTIONS.map((reaction) => (
//                                     <span
//                                       key={reaction.type}
//                                       className="text-2xl hover:scale-125 transition cursor-pointer"
//                                       title={reaction.title}
//                                       onClick={() => {
//                                         handleReact(reaction.id);
//                                         setShowReactions(false);
//                                       }}
//                                     >
//                                       {reaction.icon}
//                                     </span>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                             <button className="ml-2 text-blue-500 hover:underline" onClick={handleReply}>Reply</button>
//                             {canDelete && !isEditMode && (
//                                 <>
//                                     <button
//                                         className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all text-xs font-semibold shadow"
//                                         onClick={() => setIsEditMode(true)}
//                                     >
//                                         Sửa
//                                     </button>
//                                     <button
//                                         className="ml-2 px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all text-xs font-semibold shadow"
//                                         onClick={() => setIsDeleteModalOpen(true)}
//                                     >
//                                         Xóa
//                                     </button>
//                                     <ConfirmDeleteModal
//                                         isOpen={isDeleteModalOpen}
//                                         onClose={() => setIsDeleteModalOpen(false)}
//                                         onConfirm={() => onDelete && onDelete(comment.id)}
//                                         type="bình luận"
//                                         message="Bạn có chắc chắn muốn xóa bình luận này không?"
//                                     />
//                                 </>
//                             )}
//                             {canDelete && isEditMode && (
//                                 <>
//                                     <button
//                                         className="ml-2 px-2 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-all text-xs font-semibold shadow"
//                                         onClick={() => { onEdit && onEdit(comment.id, editText); setIsEditMode(false); }}
//                                     >
//                                         Lưu
//                                     </button>
//                                     <button
//                                         className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all text-xs font-semibold shadow"
//                                         onClick={() => { setIsEditMode(false); setEditText(comment.content); }}
//                                     >
//                                         Hủy
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                         {showReplyInput && (
//                             <div className="flex items-center mt-2">
//                                 <input
//                                     type="text"
//                                     className="border rounded px-2 py-1 text-sm flex-1"
//                                     placeholder="Reply..."
//                                     value={replyText}
//                                     onChange={e => setReplyText(e.target.value)}
//                                 />
//                                 <button className="ml-2 text-blue-600 font-semibold" onClick={handleSendReply}>Send</button>
//                                 <button className="ml-2 text-gray-400" onClick={() => setShowReplyInput(false)}>Cancel</button>
//                             </div>
//                         )}
//                         {isEditMode && (
//                             <div className="flex items-center mt-2">
//                                 <input
//                                     type="text"
//                                     className="border rounded px-2 py-1 text-sm flex-1"
//                                     value={editText}
//                                     onChange={e => setEditText(e.target.value)}
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 {isCommentLike ? <AiFillHeart className="text-xs hover:opacity-50 cursor-pointer text-red-600" onClick={handleLikeComment} /> : <AiOutlineHeart className="text-xs hover:opacity-50 cursor-pointer" onClick={handleLikeComment} />}
//             </div>
//             {/* Render children nếu có */}
//             {comment.children && comment.children.filter(child => !child.deleted).length > 0 && (
//                 <div className="pl-4 border-l border-gray-100">
//                     {comment.children.filter(child => !child.isDeleted).map(child => (
//                         <CommentCard key={child.id} comment={child} onReply={onReply} onDelete={onDelete} onEdit={onEdit} currentUserId={currentUserId} postOwnerId={postOwnerId} reloadComments={reloadComments} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default CommentCard

import {  useState } from "react"
import { FaThumbsUp, FaLaugh, FaSadTear, FaAngry, FaSurprise } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import ConfirmDeleteModal from "../Post/DeletedPostConfirm";
import axiosInstance from "../../AppConfig/axiosConfig";
import url from "../../AppConfig/urlApp";

const REACTIONS = [
    { id: 2, type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
    { id: 3, type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
    { id: 4, type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
    { id: 5, type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' },
    { id: 6, type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
    { id: 7, type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
];

const CommentCard = ({ comment, onReply, onDelete, onEdit, currentUserId, postOwnerId, reloadComments, img }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [showReactions, setShowReactions] = useState(false);
    const [localReaction, setLocalReaction] = useState(
        comment.reactions?.find(r => r.userId === currentUserId) || null
    );
    const [reactionCount, setReactionCount] = useState(comment?.reactions?.length)

    const canDelete = currentUserId === comment.user.id || currentUserId === postOwnerId;





   

    const handleReact = async (reactionId) => {
        try {
            await axiosInstance.post("/api/comment-reactions/react", {
                commentId: comment.id,
                reactionId,
            });
            const selected = REACTIONS.find(r => r.id === reactionId);
            setLocalReaction({ userId: currentUserId, reactionId, reactionType: selected.type });
            setShowReactions(false);
            setReactionCount(reactionCount + 1)
        } catch {
            alert("Có lỗi khi thả cảm xúc!");
        }

    };

    const handleRemoveReaction = async () => {
        try {
            await axiosInstance.delete(`/api/comment-reactions/react/${comment.id}`);
            setLocalReaction(null);
            setReactionCount(reactionCount - 1)

        } catch {
            alert("Có lỗi khi xóa cảm xúc!");
        }

    };




    return (
        <div style={{ marginLeft: comment.parent ? 24 : 0, borderLeft: comment.parent ? '1px solid #eee' : 'none', paddingLeft: comment.parent ? 12 : 0 }}>
            <div className="flex items-center justify-between py-5" onMouseLeave={() => setShowReactions(false)}>
                <div className="flex items-center">
                    <img className="w-9 h-9 rounded-full" src={img ? url + img : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"} alt="avatar" />
                    <div className="ml-3" >
                        <p>
                            <span className="font-semibold">{comment.user.firstName + " " + comment.user.lastName}</span>
                            <span className="ml-3">{comment.content}</span>
                        </p>
                        <div className="flex items-center space-x-3 text-xs opacity-60 pt-2"
                        >
                            <span>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                            <p>{reactionCount} Cảm xúc</p>

                            <div
                                className="relative group"
                                onMouseEnter={() => setShowReactions(true)}
                            >
                                <span
                                    className="text-xl cursor-pointer hover:opacity-70"
                                    onClick={() => localReaction?.reactionType ? handleRemoveReaction() : null}
                                >
                                    {localReaction?.reactionType
                                        ? REACTIONS.find(r => r.type === localReaction?.reactionType)?.icon
                                        : <AiOutlineHeart className="text-xl" />}
                                </span>

                                {showReactions && (
                                    <div className="absolute top-8 left-0 flex gap-2 bg-white border px-2 py-1 rounded shadow z-20">
                                        {REACTIONS.map((reaction) => (
                                            <span
                                                key={reaction.id}
                                                className="text-2xl hover:scale-125 transition cursor-pointer"
                                                title={reaction.title}
                                                onClick={() => handleReact(reaction.id)}
                                            >
                                                {reaction.icon}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="text-blue-500 hover:underline" onClick={() => setShowReplyInput(true)}>Reply</button>
                            {canDelete && !isEditMode && (
                                <>
                                    <button className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs" onClick={() => setIsEditMode(true)}>Sửa</button>
                                    <button className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs" onClick={() => setIsDeleteModalOpen(true)}>Xóa</button>
                                    <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => onDelete(comment.id)} type="bình luận" message="Bạn có chắc chắn muốn xóa bình luận này không?" />
                                </>
                            )}
                            {canDelete && isEditMode && (
                                <>
                                    <button className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs" onClick={() => { onEdit(comment.id, editText); setIsEditMode(false); }}>Lưu</button>
                                    <button className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" onClick={() => { setIsEditMode(false); setEditText(comment.content); }}>Hủy</button>
                                </>
                            )}
                        </div>

                        {showReplyInput && (
                            <div className="flex items-center mt-2">
                                <input
                                    type="text"
                                    className="border rounded px-2 py-1 text-sm flex-1"
                                    placeholder="Reply..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                />
                                <button className="ml-2 text-blue-600 font-semibold" onClick={() => { onReply(replyText, comment.id); setReplyText(""); setShowReplyInput(false); }}>Send</button>
                                <button className="ml-2 text-gray-400" onClick={() => setShowReplyInput(false)}>Cancel</button>
                            </div>
                        )}

                        {isEditMode && (
                            <div className="flex items-center mt-2">
                                <input
                                    type="text"
                                    className="border rounded px-2 py-1 text-sm flex-1"
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>


            </div>

            {comment.children?.filter(child => !child.isDeleted).length > 0 && (
                <div className="pl-4 border-l border-gray-100">
                    {comment.children.filter(child => !child.isDeleted).map(child => (
                        <CommentCard
                            key={child.id}
                            comment={child}
                            onReply={onReply}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            currentUserId={currentUserId}
                            postOwnerId={postOwnerId}
                            reloadComments={reloadComments}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default CommentCard;