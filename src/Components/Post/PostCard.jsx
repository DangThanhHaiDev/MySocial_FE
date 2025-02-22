import { BsBookmark, BsBookmarkFill, BsEmojiSmile, BsThreeDots } from "react-icons/bs"
import "./postcard.scss"
import { useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import { RiSendPlaneLine } from "react-icons/ri"
import CommentModal from "../Comment/CommentModal"
import { useDisclosure } from "@chakra-ui/react"

const PostCard = () => {
    const [showDropDown, setShowDropDown] = useState(false)
    const [isPostLiked, setIsPostLiked] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const {isOpen, onOpen, onClose} = useDisclosure()

    const handleClickDropDown = () => {
        setShowDropDown(!showDropDown)
    }

    const handleClickLike = ()=>{
        setIsPostLiked(!isPostLiked)
    }

    const handleClickSave = ()=>{
        setIsSaved(!isSaved)
    }

    const handleOpenCommentModal = ()=>{
        onOpen()
    }



    return (
        <div>
            <div className="border rounded-md w-full">
                <div className="flex justify-between items-center w-full py-4 px-5">
                    <div className="flex items-center">
                        <img className="h-12 w-12 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                        <div className="pl-2">
                            <p className="text-left font-semibold text-sm">username</p>
                            <p className="text-left font-thin text-sm">location</p>
                        </div>
                    </div>
                    <div className="dropdown">
                        <BsThreeDots className="dots" onClick={handleClickDropDown} />
                        {
                            showDropDown &&
                            <div className="dropdown-content">
                                <p className="bg-black text-white py-1 px-4 rounded-md cursor-pointer">Delete</p>
                            </div>
                        }

                    </div>
                </div>
                <div className="w-full">
                    <img src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="Image" className="w-full" />
                </div>
                <div className="flex justify-between items-center w-full px-5 py-4">
                    <div className="flex items-center space-x-2">
                        {isPostLiked ? <AiFillHeart onClick={handleClickLike} className="text-xl hover:opacity-50 cursor-pointer text-red-800"/> :  <AiOutlineHeart onClick={handleClickLike} className="text-xl hover:opacity-50 cursor-pointer"/>}
                        <FaRegComment onClick={handleOpenCommentModal} className="text-xl hover:opacity-50 cursor-pointer"/>
                        <RiSendPlaneLine className="text-xl hover:opacity-50 cursor-pointer"/>
                    </div>
                    <div>
                        {
                            isSaved ? <BsBookmarkFill onClick={handleClickSave} className="text-xl hover:opacity-50 cursor-pointer text-yellow-500"/> : <BsBookmark onClick={handleClickSave} className="text-xl hover:opacity-50 cursor-pointer"/>
                        }                       
                    </div>
                </div>
                <div className="w-full py-2 px-5 text-left">
                    <p>10 likes</p>
                    <p className="opacity-50">View all 10 comments</p>
                </div>
                <div className="border border-t w-full">
                    <div className="w-full flex items-center px-5" >
                        <BsEmojiSmile />
                        <input type="text" className="commentInput" placeholder="Add a comment..."  />
                    </div>
                </div>
            </div>
            <CommentModal handleClickLike={handleClickLike} isOpen={isOpen} onClose={onClose} handleClickSave={handleClickSave} isPostLiked={isPostLiked} isSaved={isSaved} />
        </div>
    )
}

export default PostCard