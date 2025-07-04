import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsThreeDots
} from "react-icons/bs";
import {
  AiOutlineHeart
} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import CommentModal from "../Comment/CommentModal";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import url from "../../AppConfig/urlApp";
import "./postcard.scss"; // giữ file cũ để bạn tuỳ chỉnh tiếp
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import ConfirmDeleteModal from "./DeletedPostConfirm"
import { useOnScreen } from "../../hooks/useOnScreen";

import { useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const reactions = useSelector(state => state.reaction.reactions);
  const [showReactions, setShowReactions] = useState(false);
  const safeComments = Array.isArray(post.comments) ? post.comments : [];
  const safeReactions = Array.isArray(post.reactions) ? post.reactions : [];
  const [comment, setComment] = useState(safeComments);
  const [reactionCount, setReactionCount] = useState(safeReactions.length);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commentTreeReloadKey, setCommentTreeReloadKey] = useState(0);
  const navigate = useNavigate()

  const stompClient = useRef(null);
  const user = useSelector(state => state.auth.user)
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/post/${post.id}`)
      const { data } = response
      console.log(data);
      alert("đã xóa thành công")
      setIsModalOpen(false)
    } catch (error) {
      alert("Vui long thử lại sau")
    }
  }

  useEffect(() => {
    if (user) {
      setIsPostLiked(safeReactions.find((reaction => reaction.user && reaction.user.id === user.id)))
    }
  }, [user])

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

    const socket = new SockJS(`${url}/ws?token=${token}`);
    const client = Stomp.over(socket);
    stompClient.current = client;

    client.connect({}, () => {
      console.log("✅ WebSocket connected");
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
    });

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => {
          console.log("❌ Disconnected (unmount)");
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
  const handleOpenCommentModal = () => onOpen();

  const handleNav = (userId) => {
    if (user.id == userId) {
      navigate('/username')
    }
    else {
      navigate(`/profile/${userId}`)
    }
  }

  return (
    <div ref={ref} className="max-w-xl mx-auto bg-white border rounded-xl shadow-md mb-8 overflow-hidden" onMouseLeave={() => setShowReactions(false)}>
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3 hover:cursor-pointer">
          <img
            src={post.user.avatarUrl ? post.user.avatarUrl : "https://i.pinimg.com/474x/27/5f/99/275f99923b080b18e7b474ed6155a17f.jpg?nii=t"}
            alt="avatar"
            className="h-11 w-11 rounded-full object-cover border cursor-pointer"
            onClick={()=>handleNav(post.user.id)}
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
            </p>
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
            {isPostLiked ? (
              <img src={url + isPostLiked.reaction.urlReaction} alt="Ảnh"
                className="w-6 h-6 object-contain inline-block cursor-pointer"
                onClick={() => { setIsPostLiked(null); setReactionCount(reactionCount - 1) }}
              />
            ) : (
              <AiOutlineHeart className="text-xl cursor-pointer hover:opacity-70 transition" />
            )}
            <FaRegComment onClick={handleOpenCommentModal} className="text-xl cursor-pointer hover:opacity-70 transition" />
            <RiSendPlaneLine className="text-xl cursor-pointer hover:opacity-70 transition" />
          </div>

          {/* Reactions hover */}
          {showReactions && (
            <div className="absolute top-8 left-0 flex gap-2 bg-white border px-2 py-1 rounded shadow z-20">
              {reactions.map((reaction) => (
                <img
                  key={reaction.id}
                  src={url + reaction.urlReaction}
                  alt={reaction.title}
                  title={reaction.reactionType}
                  className="w-7 h-7 hover:scale-125 transition cursor-pointer"
                  onClick={() => {
                    console.log("Clicked reaction:", reaction);
                    setIsPostLiked({ reaction });
                    setShowReactions(false);
                    setReactionCount(reactionCount + 1)
                  }}
                />
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

      {/* Add comment */}
      <div className="border-t px-5 py-3 flex items-center gap-3">
        <BsEmojiSmile className="text-xl text-gray-500" />
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full outline-none text-sm py-1 bg-transparent"
        />
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

