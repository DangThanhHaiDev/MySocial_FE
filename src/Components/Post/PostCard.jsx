import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsThreeDots
} from "react-icons/bs";
import {
  AiOutlineHeart,
  AiFillHeart
} from "react-icons/ai";
import { FaRegComment, FaThumbsUp, FaLaugh, FaSadTear, FaAngry, FaSurprise } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import CommentModal from "../Comment/CommentModal";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import url from "../../AppConfig/urlApp";
import "./postcard.scss"; // giữ file cũ để bạn tuỳ chỉnh tiếp
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import ConfirmDeleteModal from "./DeletedPostConfirm"
import { useOnScreen } from "../../hooks/useOnScreen";

import { useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Globe, UserCheck, UserLock } from "lucide-react";
import { getUserByJwt } from "../../GlobalState/auth/Action";

const PostCard = ({ post }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [showReactions, setShowReactions] = useState(false);
  const safeComments = Array.isArray(post.comments) ? post.comments : [];
  const [comment, setComment] = useState(safeComments);
  const [reactionCount, setReactionCount] = useState(post.reactionCount || 0);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commentTreeReloadKey, setCommentTreeReloadKey] = useState(0);
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()

  const onOpen = () => {
    setIsOpen(true)
  }
  const onClose = () => {
    setIsOpen(false)
  }
  const stompClient = useRef(null);
  const user = useSelector(state => state.auth.user)
  const [isPostLiked, setIsPostLiked] = useState(post.currentUserReactionType || null);
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

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
      const response = await axiosInstance.delete(`/api/post/${post.id}`)
      const { data } = response
      console.log(data);
      alert("đã xóa thành công")
      setIsModalOpen(false)
      dispatch(getUserByJwt(navigate))
    } catch (error) {
      alert("Vui long thử lại sau")
    }
  }

  useEffect(() => {
    setIsPostLiked(post.currentUserReactionType || null);
    setReactionCount(post.reactionCount || 0);
  }, [post.currentUserReactionType, post.reactionCount]);

  useEffect(() => {
    if (!isVisible) {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {
          console.log("❌ Disconnected (out of screen)");
        });
      }
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token for WS:", token);
    if (!token) return;
    if (stompClient.current?.connected) return;

    stompClient.current = Stomp.over(() => new SockJS(`${url}/ws?token=${token}`));
    stompClient.current.reconnect_delay = 5000; // tùy chọn: auto reconnect

    stompClient.current.connect({}, () => {
      // console.log("✅ WebSocket connected");

      // stompClient.current.subscribe(`/topic/comments/${post.id}`, (message) => {
      //   const body = JSON.parse(message.body);


      //   if (body.action === "delete" && body.commentId) {
      //     setComment(prev => prev.filter(c => c.id !== body.commentId));
      //   } else if (body.action === "update" && body.commentId && body.data) {
      //     setComment(prev => prev.map(c => c.id === body.commentId ? { ...c, ...body.data } : c));
      //   } else if (body.data) {
      //     setComment(prev => [...prev, body.data]);
      //   }
      // });
      // In your PostCard component, update the comment subscription handler:

      stompClient.current.subscribe(`/topic/comments/${post.id}`, (message) => {
        const body = JSON.parse(message.body);
        console.log("Received comment message:", body);

        if (body.action === "delete" && body.commentId) {
          setComment(prev => prev.filter(c => c.id !== body.commentId));
        } else if (body.action === "update" && body.commentId && body.data) {
          setComment(prev => prev.map(c => c.id === body.commentId ? { ...c, ...body.data } : c));
        } else if (body.data) {
          if (body.data.parentId) {
            console.log("Vào reply");

            setComment(prev => [...prev, body.data]);

          } else {
            console.log("Vào else");

            setComment(prev => [...prev, body.data]);
          }
        }
      });

      stompClient.current.subscribe(`/topic/reactions/${post.id}`, (message) => {
        const body = JSON.parse(message.body);
        console.log(body.action);

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


  const sendComment = (commentText, parentId = null) => {
    if (stompClient.current && stompClient.current.connected) {
      const request = { content: commentText };
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

  const handleNav = (userId) => {
    if (user.id == userId) {
      navigate('/username')
    }
    else {
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
      console.log(request);

      stompClient.current.send(`/app/reactions/${post.id}`, {}, JSON.stringify(request));
    } else {
      console.warn("⚠️ WebSocket chưa kết nối");
    }
  };

  useEffect(() => {
    console.log(post);

  }, [])

  return (
    <div ref={ref} className="max-w-xl mx-auto bg-white border rounded-xl shadow-md mb-8 overflow-hidden" onMouseLeave={() => setShowReactions(false)}>
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3 hover:cursor-pointer">
          <img
            src={post.user.avatarUrl ? url + post.user.avatarUrl : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"}
            alt="avatar"
            className="h-11 w-11 rounded-full object-cover border cursor-pointer"
            onClick={() => handleNav(post.user.id)}
          />
          <div>
            <p className="font-semibold text-sm text-left">{post.user.firstName + " " + post.user.lastName}</p>
            <p className="text-xs text-gray-500 text-left">{post.location}</p>
            <p className="text-xs text-gray-500 text-left">
              {new Date(post.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}{" "}
              -{" "}
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
              <span className="text-xs">
                {post.privacy === "FRIENDS" ? (
                  <UserCheck size={15} />
                ) : post.privacy === "PRIVATE" ? (
                  <UserLock size={15} />
                ) : (
                  <Globe size={15} /> 
                )}
              </span>

            </p>
            {post.avatar && (<p className="opacity-60 txt text-xs">{post.user.firstName + " " + post.user.lastName} đã cập nhật ảnh đại diện</p>)}

          </div>
        </div>
        <div className="relative">
          {
            user?.id === post.user.id && (
              <BsThreeDots className="cursor-pointer hover:opacity-60" onClick={handleClickDropDown} />
            )
          }
          {showDropDown && (
            <div className="absolute right-0 mt-2 bg-black text-white text-sm rounded-md shadow px-4 py-2 z-10">
              <p className="cursor-pointer hover:opacity-80" onClick={() => setIsModalOpen(true)}>Delete</p>
            </div>
          )}

        </div>

      </div>


      {/* Content */}
      {post.content && <p className="px-5 text-sm text-left pb-3">{post.content}</p>}


      {/* Image */}
      <div className="w-full">
        {post.image && (
          <img
            src={url + post.image}
            alt="Post"
            className="w-full object-cover cursor-pointer hover:opacity-95 transition"
            onClick={() => window.open(url + post.image)}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center px-5 py-3 relative">
        <div className="relative group" onMouseEnter={() => setShowReactions(true)}>
          <div className="flex items-center gap-3">
            {isPostLiked && fixedReactions.find(r => r.type === isPostLiked) ? (
              <span
                className="text-2xl cursor-pointer hover:opacity-70 transition"
                onClick={() => handleReaction(isPostLiked)}
              >
                {fixedReactions.find(r => r.type === isPostLiked).icon}
              </span>
            ) : (
              <AiOutlineHeart className="text-xl cursor-pointer hover:opacity-70 transition" />
            )}
            <FaRegComment onClick={handleOpenCommentModal} className="text-xl cursor-pointer hover:opacity-70 transition" />
          </div>

          {/* Reactions hover */}
          {showReactions && (
            <div className="absolute top-8 left-0 flex gap-2 bg-white border px-2 py-1 rounded shadow z-20">
              {fixedReactions.map((reaction) => (
                <span
                  key={reaction.type}
                  className="text-2xl hover:scale-125 transition cursor-pointer"
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
      <div className="px-5 pb-3 text-sm text-left">
        <p className="font-semibold">{reactionCount} cảm xúc</p>
        <p className="text-gray-500 cursor-pointer hover:underline text-sm" onClick={handleOpenCommentModal}>
          Xem tất cả {comment ? comment.length : 0} bình luận
        </p>
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
        imageUrl={post.image}
        render={setComment}
      />
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="post"
        message="Bạn có chắc chắn muốn xóa bài viết này không?"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PostCard;

