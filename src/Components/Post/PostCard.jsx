import {

  BsThreeDots
} from "react-icons/bs";
import {
  AiOutlineHeart,
  AiFillHeart
} from "react-icons/ai";
import { FaRegComment, FaThumbsUp, FaLaugh, FaSadTear, FaAngry, FaSurprise } from "react-icons/fa";
import CommentModal from "../Comment/CommentModal";
import { useEffect, useState, useRef } from "react";
import url from "../../AppConfig/urlApp";
import "./postcard.scss";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import ConfirmDeleteModal from "./DeletedPostConfirm"
import { useOnScreen } from "../../hooks/useOnScreen";

import { useNavigate } from "react-router-dom";
import { Globe, UserCheck, UserLock } from "lucide-react";
import { getUserByJwt } from "../../GlobalState/auth/Action";
import ReactionModal from "../Message/ReactionModal";
import ReportModal from "./ReportModal";
import axiosInstance from "../../AppConfig/axiosConfig";

const PostCard = ({ post }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const safeComments = Array.isArray(post.comments) ? post.comments : [];
  const [comment, setComment] = useState(safeComments);
  const [reactionCount, setReactionCount] = useState(post.reactionCount || 0);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commentTreeReloadKey, setCommentTreeReloadKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false)
  const [isOpenReactionModal, setIsOpenReactionModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const menuRef = useRef();


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stompClient = useRef(null);
  const user = useSelector(state => state.auth.user)
  const [isPostLiked, setIsPostLiked] = useState(post.currentUserReactionType || null);
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  // Reaction cố định
  const fixedReactions = [
    { type: 'LIKE', icon: <FaThumbsUp className="text-blue-500" />, title: 'Like' },
    { type: 'LOVE', icon: <AiFillHeart className="text-red-500" />, title: 'Tim' },
    { type: 'HAHA', icon: <FaLaugh className="text-yellow-400" />, title: 'Haha' },
    { type: 'WOW', icon: <FaSurprise className="text-yellow-400" />, title: 'Wow' },
    { type: 'SAD', icon: <FaSadTear className="text-blue-400" />, title: 'Buồn' },
    { type: 'ANGRY', icon: <FaAngry className="text-red-700" />, title: 'Giận' }
  ];

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/post/${post.id}`)
      alert("Đã xóa thành công")
      setIsModalOpen(false)
      dispatch(getUserByJwt(navigate))
      setIsDeleted(true)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert("Vui lòng thử lại sau")
    }
  }

  const handleNav = (userId) => {
    if (user.id === userId) {
      navigate('/username')
    } else {
      navigate(`/profile/${userId}`)
    }
  }

  const handleReaction = (reactionType) => {
    if (stompClient.current && stompClient.current.connected) {
      let action = 'add';
      // Nếu user click lại đúng cảm xúc hiện tại thì remove
      if (isPostLiked === reactionType) {
        action = 'remove';
      }
      const request = {
        action,
        reactionType: reactionType
      };
      stompClient.current.send(`/app/reactions/${post.id}`, {}, JSON.stringify(request));
    } else {
      console.warn("⚠️ WebSocket chưa kết nối");
    }
  };

  const sendComment = (commentText, parentId = null, hashtag) => {
    if (stompClient.current && stompClient.current.connected) {
      const request = { content: commentText, hashtag };
      if (parentId) request.parentId = parentId;
      stompClient.current.send(`/app/comments/${post.id}`, {}, JSON.stringify(request));
      setCommentTreeReloadKey(prev => prev + 1);
    } else {
      console.warn("⚠️ WebSocket chưa kết nối");
    }
  };

  const handleClickDropDown = () => setShowDropDown(!showDropDown);

  const handleClickLike = () => {
    if (isPostLiked) {
      setIsPostLiked(null)
      return
    }
    setIsPostLiked(!isPostLiked);
  }

  const handleOpenCommentModal = () => {
    onOpen()
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "FRIENDS":
        return <UserCheck size={12} className="inline ml-1" />;
      case "PRIVATE":
        return <UserLock size={12} className="inline ml-1" />;
      default:
        return <Globe size={12} className="inline ml-1" />;
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content || content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    setIsPostLiked(post.currentUserReactionType || null);
    setReactionCount(post.reactionCount || 0);
  }, [post.currentUserReactionType, post.reactionCount]);

  useEffect(() => {
    if (!isVisible) {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {
          // console.log("❌ Disconnected (out of screen)");
        });
      }
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;
    if (stompClient.current?.connected) return;

    stompClient.current = Stomp.over(() => new SockJS(`${url}/ws?token=${token}`));
    stompClient.current.reconnect_delay = 5000;

    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/topic/comments/${post.id}`, (message) => {
        const body = JSON.parse(message.body);

        if (body.action === "delete" && body.commentId) {
          setComment(prev => prev.filter(c => c.id !== body.commentId));
        } else if (body.action === "update" && body.commentId && body.data) {
          setComment(prev => prev.map(c => c.id === body.commentId ? { ...c, ...body.data } : c));
        } else if (body.data) {
          setComment(prev => [...prev, body.data]);
        }
      });

      stompClient.current.subscribe(`/topic/reactions/${post.id}`, (message) => {
        const body = JSON.parse(message.body);

        if (body.action === "add" && body.data) {
          if (body.data.userId === user?.id) {
            setIsPostLiked(body.data.reaction?.reactionType || null);
          }
          setReactionCount(prev => body.data.reactionCount ?? (prev + 1));
        } else if (body.action === "remove") {
          if (body.userId === user?.id) {
            setIsPostLiked(null);
          }
          setReactionCount(prev => body.reactionCount ?? Math.max(0, prev - 1));
        }
      });
    });

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {
          // console.log("❌ Disconnected (unmount)");
        });
      }
    };
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const closeReactionModal = ()=>{
    setIsOpenReactionModal(false)
  }
  if(isDeleted ){
    return null
  }
  return (
    <div
      ref={ref}
      className="max-w-xl mx-auto bg-white border rounded-xl shadow-md mb-8 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatarUrl ? url + post.user.avatarUrl : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"}
            alt="avatar"
            className="h-11 w-11 rounded-full object-cover border cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleNav(post.user.id)}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p
                className="font-semibold text-sm text-left cursor-pointer hover:underline"
                onClick={() => handleNav(post.user.id)}
              >
                {post.user.firstName + " " + post.user.lastName}
              </p>
              {getPrivacyIcon(post.privacy)}
            </div>

            {post.location && (
              <p className="text-xs text-gray-500 text-left">{post.location}</p>
            )}

            <p className="text-xs text-gray-500 text-left">
              {formatTime(post.createdAt)}
            </p>

            {post.avatar && (
              <p className="text-xs text-gray-600 italic">
                {post.user.firstName + " " + post.user.lastName} đã cập nhật ảnh đại diện
              </p>
            )}
          </div>
        </div>

        <div className="relative inline-block">
          <button onClick={() => setShowMenu(!showMenu)} className="px-2 py-1 text-xl"><BsThreeDots /></button>
          {showMenu && (
            <div ref={menuRef} className="absolute right-0 bg-white shadow rounded z-10 min-w-[150px]">
              {user?.id === post.user.id && (
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                  onClick={() => { setIsModalOpen(true); setShowMenu(false); }}
                >
                  Xóa bài viết
                </button>
              )}
              {user?.id !== post.user.id && (
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => { setShowReport(true); setShowMenu(false); }}
                >
                  Báo cáo bài viết
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-5 pb-3">
          <p className="text-sm text-left leading-relaxed">
            {showFullContent ? post.content : truncateContent(post.content)}
          </p>
          {post.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
            >
              {showFullContent ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </div>
      )}

      {/* Image */}
      {post.images && post.images.length > 0 && (
        <div className={`w-full relative ${post.images.length >1 ? "flex gap-2" :"w-full"}`}>
          {post.images.slice(0, 2).map((img, idx) => (
            <div key={idx} className="relative" >
              <img
                src={url + img}
                alt={`Post ${idx + 1}`}
                className={`${post.images.length >1 ? "w-48 h-48" :"w-full"} object-cover rounded cursor-pointer`}
                onClick={()=> window.open(url + img)}
              />
              {/* Nếu là ảnh thứ 2 và còn nhiều hơn 2 ảnh, hiển thị text 'Xem thêm ... ảnh' */}
              {idx === 1 && post.images.length > 2 && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded cursor-pointer" onClick={() => setIsOpen(true)}>
                  <span className="text-white font-semibold text-lg">Xem thêm {post.images.length - 2} ảnh</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center px-5 py-3 relative">
        <div
          className="relative group"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {isPostLiked && fixedReactions.find(r => r.type === isPostLiked) ? (
                <span
                  className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleReaction(isPostLiked)}
                >
                  {fixedReactions.find(r => r.type === isPostLiked).icon}
                </span>
              ) : (
                <AiOutlineHeart
                  className="text-2xl cursor-pointer hover:scale-110 transition-transform hover:text-red-500"
                  onClick={() => handleReaction('LIKE')}
                />
              )}
            </div>

            <FaRegComment
              onClick={handleOpenCommentModal}
              className="text-xl cursor-pointer hover:scale-110 transition-transform hover:text-blue-500"
            />
          </div>

          {/* Reactions hover */}
          {showReactions && (
            <div className="absolute bottom-full left-0 flex gap-1 bg-white border rounded-full px-3 py-2 shadow-lg z-20">
              {fixedReactions.map((reaction) => (
                <span
                  key={reaction.type}
                  className="text-2xl hover:scale-125 transition-transform cursor-pointer p-1 rounded-full hover:bg-gray-100"
                  title={reaction.title}
                  onClick={() => {
                    handleReaction(reaction.type);
                    setShowReactions(false);
                  }}
                >
                  {reaction.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Likes & Comments */}
      <div className="px-5 pb-4 text-sm">
        {reactionCount > 0 && (
          <p className="font-semibold text-gray-700 mb-1 hover:underline cursor-pointer" onClick={()=>setIsOpenReactionModal(true)}>
            {reactionCount} lượt thích
          </p>
        )}

        {comment && comment.length > 0 && (
          <p
            className="text-gray-500 cursor-pointer hover:underline"
            onClick={handleOpenCommentModal}
          >
            Xem tất cả {comment.length} bình luận
          </p>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        handleClickLike={handleClickLike}
        isOpen={isOpen}
        onClose={onClose}
        isPostLiked={isPostLiked}
        comments={comment}
        sendComment={sendComment}
        postId={post.id}
        commentTreeReloadKey={commentTreeReloadKey}
        images={post.images}
        render={setComment}
      />

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="post"
        message="Bạn có chắc chắn muốn xóa bài viết này không?"
        onConfirm={handleDelete}
      />
      <ReactionModal isOpen={isOpenReactionModal} reactions={post.reactions} onClose={closeReactionModal} postId={post.id}/>
      {showReport && (
        <ReportModal
          type="POST"
          targetId={post.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default PostCard;