import { Button, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { BsBookmark, BsBookmarkFill, BsEmojiSmile, BsThreeDots } from "react-icons/bs"
import CommentCard from "../CommentCard/CommentCard.jsx"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"
import { RiSendPlaneLine } from "react-icons/ri"
import "./Comment.scss"

const CommentModal = ({ onClose, isOpen, isSaved, isPostLiked, handleClickLike, handleClickSave }) => {

    return (
        <div>

            <Modal isOpen={isOpen} onClose={onClose} size={"4xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <div className="h-[75vh] flex" >
                            <div className="w-[45%] flex flex-col h-full justify-center">
                                <img className="max-h-full w-full object-cover" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                            </div>
                            <div className="w-[55%] pl-10 relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center justify-between py-5">
                                        <div>
                                            <img className="w-9 h-9 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                                        </div>
                                        <div className="ml-2">
                                            <p>Username</p>
                                        </div>
                                    </div>
                                    <BsThreeDots />
                                </div>
                                <hr />
                                <div className="comment">
                                    {[1, 2, 3, 4].map((item) => (
                                        <CommentCard />
                                    ))}
                                </div>
                                <div className="absolute bottom-0 w-[90%]">
                                    <div className="flex justify-between items-center w-full py-4">
                                        <div className="flex items-center space-x-2">
                                            {isPostLiked ? <AiFillHeart onClick={handleClickLike} className="text-xl hover:opacity-50 cursor-pointer text-red-800" /> : <AiOutlineHeart onClick={handleClickLike} className="text-xl hover:opacity-50 cursor-pointer" />}
                                            <FaRegComment className="text-xl hover:opacity-50 cursor-pointer" />
                                            <RiSendPlaneLine className="text-xl hover:opacity-50 cursor-pointer" />
                                        </div>
                                        <div>
                                            {
                                                isSaved ? <BsBookmarkFill onClick={handleClickSave} className="text-xl hover:opacity-50 cursor-pointer text-yellow-500" /> : <BsBookmark onClick={handleClickSave} className="text-xl hover:opacity-50 cursor-pointer" />
                                            }
                                        </div>
                                    </div>
                                    <div className="w-full py-2text-left">
                                        <p>10 likes</p>
                                        <p className=" opacity-50 text-sm">1 day ago</p>
                                    </div>
                                    <div>
                                        <div className="w-full flex items-center" >
                                            <BsEmojiSmile />
                                            <input type="text" className="commentInput w-full text-left" placeholder="Add a comment..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default CommentModal
