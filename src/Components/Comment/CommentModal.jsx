import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsThreeDots,
} from "react-icons/bs";
import CommentCard from "../CommentCard/CommentCard.jsx";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import "./Comment.scss";
import { useState, useEffect } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import url from "../../AppConfig/urlApp.js";

const CommentModal = ({
  onClose,
  isOpen,
  
  comments,
  sendComment,
  postId,
  commentTreeReloadKey,
  imageUrl,
  render
}) => {
  const [commentText, setCommentText] = useState("");
  const [commentTree, setCommentTree] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const postOwnerId =
    commentTree.length > 0 && commentTree[0].postOwnerId
      ? commentTree[0].postOwnerId
      : comments && comments[0] && comments[0].postOwnerId
      ? comments[0].postOwnerId
      : null;

  useEffect(() => {
    if ( postId) {
      axiosInstance
        .get(`/api/comment/posts/${postId}`)
        .then((res) => setCommentTree(Array.isArray(res.data) ? res.data : []))
        .catch(() => setCommentTree([]));
    }
  }, [isOpen, postId, commentTreeReloadKey, comments]);

  useEffect(() => {
    console.log(commentTree);
  }, [commentTree]);
  const handleSendComment = () => {
    sendComment(commentText, null);
    setCommentText("");
  };

  const handleReply = (replyText, parentId) => {
    sendComment(replyText, parentId);
  };

  const handleDeleteComment = (commentId) => {
    const token = localStorage.getItem("token");
    const socket = new SockJS(
      `${window.location.origin.replace("3000", "2208")}/ws?token=${token}`
    );
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.send(`/app/comments/delete/${commentId}`, {}, "");
      setTimeout(() => client.disconnect(), 500);
    });
  };

  const handleEditComment = (commentId, newContent) => {
    const token = localStorage.getItem("token");
    const socket = new SockJS(
      `${window.location.origin.replace("3000", "2208")}/ws?token=${token}`
    );
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.send(
        `/app/comments/update/${postId}`,
        {},
        JSON.stringify({ id: commentId, content: newContent })
      );
      setTimeout(() => client.disconnect(), 500);
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <div className="h-[75vh] flex">
              <div className="w-[45%] flex flex-col h-full justify-center">
                <img
                  className="max-h-full w-full object-cover"
                  src={url + imageUrl}
                  alt=""
                />
              </div>
              <div className="w-[55%] pl-10 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between py-5">
                    <p>Tất cả Bình luận</p>
                  </div>
                </div>
                <hr />
                <div className="comment overflow-scroll">
                  {commentTree.length > 0 &&
                    commentTree
                      .filter((item) => !item.deleted)
                      .map((item) => (
                        <CommentCard
                          key={item.id}
                          comment={item}
                          onReply={handleReply}
                          onDelete={handleDeleteComment}
                          onEdit={handleEditComment}
                          currentUserId={user?.id}
                          postOwnerId={postOwnerId}
                          img={item.user.avatarUrl}
                        />
                      ))}
                </div>
                <div className="absolute bottom-0 w-[90%]">
                  <div>
                    <div className="w-full flex items-center py-4">
                      {/* <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        type="text"
                        className="commentInput w-full text-left"
                        placeholder="Add a comment..."
                        
                      /> */}
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="commentInput w-full text-left resize-none overflow-hidden"
                        placeholder="Add a comment..."
                        rows={1}
                      />

                      <Button onClick={handleSendComment}>Gửi </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommentModal;
