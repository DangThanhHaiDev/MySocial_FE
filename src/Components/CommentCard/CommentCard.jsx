import { useState } from "react"
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import ConfirmDeleteModal from "../Post/DeletedPostConfirm"

const CommentCard = ({ comment, onReply, onDelete, onEdit, currentUserId, postOwnerId }) => {
    const [isCommentLike, setIsCommentLike] = useState(false)
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const handleLikeComment = () => {
        setIsCommentLike(!isCommentLike)
    }

    const handleReply = () => {
        setShowReplyInput(true)
    }

    const handleSendReply = () => {
        if (onReply && replyText.trim()) {
            onReply(replyText, comment.id)
            setReplyText("")
            setShowReplyInput(false)
        }
    }

    const canDelete = currentUserId === comment.user.id || currentUserId === postOwnerId;

    return (
        <div style={{ marginLeft: comment.parent ? 24 : 0, borderLeft: comment.parent ? '1px solid #eee' : 'none', paddingLeft: comment.parent ? 12 : 0 }}>
            <div className="flex items-center justify-between py-5">
                <div className="flex items-center">
                    <div>
                        <img className="w-9 h-9 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                    </div>
                    <div className="ml-3">
                        <p>
                            <span className="font-semibold">{comment.user.firstName + " " + comment.user.lastName}</span>
                            <span className="ml-3">{comment.content}</span>
                        </p>
                        <div className="flex items-center space-x-3 text-xs opacity-60 pt-2">
                            <span>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                            <span>23 likes</span>
                            <button className="ml-2 text-blue-500 hover:underline" onClick={handleReply}>Reply</button>
                            {canDelete && !isEditMode && (
                                <>
                                    <button
                                        className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all text-xs font-semibold shadow"
                                        onClick={() => setIsEditMode(true)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="ml-2 px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all text-xs font-semibold shadow"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                    >
                                        Xóa
                                    </button>
                                    <ConfirmDeleteModal
                                        isOpen={isDeleteModalOpen}
                                        onClose={() => setIsDeleteModalOpen(false)}
                                        onConfirm={() => onDelete && onDelete(comment.id)}
                                        type="bình luận"
                                        message="Bạn có chắc chắn muốn xóa bình luận này không?"
                                    />
                                </>
                            )}
                            {canDelete && isEditMode && (
                                <>
                                    <button
                                        className="ml-2 px-2 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200 transition-all text-xs font-semibold shadow"
                                        onClick={() => { onEdit && onEdit(comment.id, editText); setIsEditMode(false); }}
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all text-xs font-semibold shadow"
                                        onClick={() => { setIsEditMode(false); setEditText(comment.content); }}
                                    >
                                        Hủy
                                    </button>
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
                                <button className="ml-2 text-blue-600 font-semibold" onClick={handleSendReply}>Send</button>
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
                {isCommentLike ? <AiFillHeart className="text-xs hover:opacity-50 cursor-pointer text-red-600" onClick={handleLikeComment} /> : <AiOutlineHeart className="text-xs hover:opacity-50 cursor-pointer" onClick={handleLikeComment} />}
            </div>
            {/* Render children nếu có */}
            {comment.children && comment.children.filter(child => !child.isDeleted).length > 0 && (
                <div className="pl-4 border-l border-gray-100">
                    {comment.children.filter(child => !child.isDeleted).map(child => (
                        <CommentCard key={child.id} comment={child} onReply={onReply} onDelete={onDelete} onEdit={onEdit} currentUserId={currentUserId} postOwnerId={postOwnerId} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentCard