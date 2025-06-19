import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsThreeDots
} from "react-icons/bs";
import {
  AiFillHeart,
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

const PostCard = ({ post }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const reactions = useSelector(state => state.reaction.reactions)
  const [showReactions, setShowReactions] = useState(false);


  const handleClickDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleClickLike = () => {
    setIsPostLiked(!isPostLiked);
  };

  const handleClickSave = () => {
    setIsSaved(!isSaved);
  };

  const handleOpenCommentModal = () => {
    onOpen();
  };

  useEffect(() => {
    console.log(reactions);

  }, [])

  return (

    reactions.length > 0 &&
    (
      <div className="max-w-xl mx-auto bg-white border rounded-xl shadow-md mb-8 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4">
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <img
              src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg"
              alt="avatar"
              className="h-11 w-11 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-sm">username</p>
              <p className="text-xs text-gray-500">{post.location}</p>
            </div>
          </div>
          <div className="relative">
            <BsThreeDots
              className="cursor-pointer hover:opacity-60"
              onClick={handleClickDropDown}
            />
            {showDropDown && (
              <div className="absolute right-0 mt-2 bg-black text-white text-sm rounded-md shadow px-4 py-2 z-10">
                <p className="cursor-pointer hover:opacity-80">Delete</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <p className="px-5 text-sm text-left pb-3">{post.content}</p>
        )}

        {/* Image */}
        <div className="w-full">
          <img
            src={url + post.image}
            alt="Post"
            className="w-full object-cover cursor-pointer hover:opacity-95 transition"
            onClick={() => window.open(url + post.image)}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center px-5 py-3 relative">
          {/* Wrapper chứa Like + Reactions */}
          <div
            className="relative group"
            onMouseEnter={() => setShowReactions(true)}
          >
            <div className="flex items-center gap-3">
              {isPostLiked ? (
                <AiFillHeart
                  onClick={handleClickLike}
                  className="text-xl text-red-600 cursor-pointer hover:opacity-70 transition"
                />
              ) : (
                <AiOutlineHeart
                  onClick={handleClickLike}
                  className="text-xl cursor-pointer hover:opacity-70 transition"
                />
              )}

              <FaRegComment
                onClick={handleOpenCommentModal}
                className="text-xl cursor-pointer hover:opacity-70 transition"
              />
              <RiSendPlaneLine className="text-xl cursor-pointer hover:opacity-70 transition" />
            </div>

            {/* Hiển thị reaction icons khi hover */}
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
                      setIsPostLiked(true);
                      setShowReactions(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <div>
            {isSaved ? (
              <BsBookmarkFill
                onClick={handleClickSave}
                className="text-xl text-yellow-500 cursor-pointer hover:opacity-70"
              />
            ) : (
              <BsBookmark
                onClick={handleClickSave}
                className="text-xl cursor-pointer hover:opacity-70"
              />
            )}
          </div>
        </div>

        {/* <div className="flex justify-between items-center px-5 py-3">
          <div className="flex items-center gap-3" onMouseEnter={() => setShowReactions(true)}
     onMouseLeave={() => setShowReactions(false)}
>
            {isPostLiked ? (
              <AiFillHeart
                onClick={handleClickLike}
                className="text-xl text-red-600 cursor-pointer hover:opacity-70 transition"
              />
            ) : (
              <AiOutlineHeart
              
                onClick={handleClickLike}
                className="text-xl cursor-pointer hover:opacity-70 transition"
                
              />
            )}
            <FaRegComment
              onClick={handleOpenCommentModal}
              className="text-xl cursor-pointer hover:opacity-70 transition"
            />
            <RiSendPlaneLine className="text-xl cursor-pointer hover:opacity-70 transition" />
          </div>
          <div>
            {isSaved ? (
              <BsBookmarkFill
                onClick={handleClickSave}
                className="text-xl text-yellow-500 cursor-pointer hover:opacity-70"
              />
            ) : (
              <BsBookmark
                onClick={handleClickSave}
                className="text-xl cursor-pointer hover:opacity-70"
              />
            )}
          </div>
        </div> */}

        {/* Likes & Comments */}
        <div className="px-5 pb-3 text-sm text-left">
          <p className="font-semibold">10 likes</p>
          <p className="text-gray-500 cursor-pointer hover:underline text-sm">
            View all 10 comments
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
          handleClickSave={handleClickSave}
          isPostLiked={isPostLiked}
          isSaved={isSaved}
        />
      </div>
    )


  );
};

export default PostCard;
