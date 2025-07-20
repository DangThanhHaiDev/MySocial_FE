

import { use, useEffect, useState } from "react"
import { FaThumbsUp, FaLaugh, FaSadTear, FaAngry, FaSurprise } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import ConfirmDeleteModal from "../Post/DeletedPostConfirm";
import axiosInstance from "../../AppConfig/axiosConfig";
import url from "../../AppConfig/urlApp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const REACTIONS = [
    { id: 1, type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
    { id: 2, type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
    { id: 3, type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
    { id: 4, type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' },
    { id: 5, type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
    { id: 6, type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
];

const CommentCard = ({ comment, onReply, onDelete, onEdit, currentUserId, postOwnerId, reloadComments, img, isOpen, parentUserId = null }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const userId = useSelector(state=>state.auth.user.id)
    const [showReactions, setShowReactions] = useState(false);
    const navigate = useNavigate()
    const [localReaction, setLocalReaction] = useState(
        comment.reactions?.find(r => r.userId === currentUserId) || null

    );
    const [isHastag, setIsHastag] = useState(false)

    const [reactionCount, setReactionCount] = useState(comment?.reactions?.length)

    const canDelete = currentUserId === comment.user.id || currentUserId === postOwnerId;


    useEffect(() => {
        console.log(comment);

    }, [comment.reactions, currentUserId]);

    useEffect(() => {
        setIsHastag(false)
    }, [isOpen])





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

    const handleChangeReply = (text) => {
        setReplyText(text)
        if (text.length < (comment.user.firstName + " " + comment.user.lastName).length + 1) {
            setIsHastag(false)
        }
    }


    useEffect(() => {
        console.log(comment);

    }, [])

    return (
        <div style={{ marginLeft: comment.parent ? 24 : 0, borderLeft: comment.parent ? '1px solid #eee' : 'none', paddingLeft: comment.parent ? 12 : 0 }}>
            <div className="flex items-center justify-between py-5" onMouseLeave={() => setShowReactions(false)}>
                <div className="flex items-center">
                    <img className="w-9 h-9 rounded-full" src={img ? url + img : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"} alt="avatar" />
                    <div className="ml-3" >
                        <p>
                            <span className="font-semibold">{comment.user.firstName + " " + comment.user.lastName}</span>
                            {comment.hashtag ? (
                                (() => {
                                    return (
                                        <div>
                                            <span  className="text-blue-600 cursor-pointer hover:opacity-70" onClick={()=>(!parentUserId === userId) ? navigate(`/profile/${parentUserId}`) : navigate("/username")}>{"@" + comment.user.firstName + " " + comment.user.lastName}</span>
                                            <span>{comment.content}</span>
                                        </div>
                                    )
                                })()
                            ) : (
                                <span className="ml-3">{comment.content}</span>
                            )}
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

                            <button className="text-blue-500 hover:underline" onClick={() => { setShowReplyInput(true); setReplyText("@" + comment.user.firstName + " " + comment.user.lastName); setIsHastag(true) }}>Trả lời</button>
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
                                    onChange={e => handleChangeReply(e.target.value)}
                                />
                                <button className="ml-2 text-blue-600 font-semibold" onClick={() => { onReply((isHastag) ? replyText.substring((comment.user.firstName + " " + comment.user.lastName).length + 1) : replyText, comment.id, isHastag); setReplyText(""); setIsHastag(false); setShowReplyInput(false); }}>Send</button>
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

            {comment.children?.filter(child => !child.deleted).length > 0 && (
                <div className="pl-4 border-l border-gray-100">
                    {comment.children.filter(child => !child.deleted).map(child => (
                        <CommentCard
                            key={child.id}
                            comment={child}
                            onReply={onReply}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            currentUserId={currentUserId}
                            postOwnerId={postOwnerId}
                            reloadComments={reloadComments}
                            img={comment.user.avatarUrl}
                            parentUserId={comment.user.id}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default CommentCard;