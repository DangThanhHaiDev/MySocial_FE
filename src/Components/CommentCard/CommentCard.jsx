import { useState } from "react"
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai'

const CommentCard = ()=>{
    const [isCommentLike, setIsCommentLike] = useState(false)

    const handleLikeComment = ()=>{
        setIsCommentLike(!isCommentLike)
    }

    return (
        <div>
            <div className="flex items-center justify-between py-5">
                <div className="flex items-center">
                    <div>
                        <img className="w-9 h-9 rounded-full" src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" />
                    </div>
                    <div className="ml-3">
                        <p>
                            <span className="font-semibold">Username</span>
                            <span className="ml-3">nice post</span>
                        </p>
                        <div className="flex items-center space-x-3 text-xs opacity-60 pt-2">
                            <span>1 min ago</span>
                            <span>23 likes</span>
                        </div>
                    </div>
                </div>
                {isCommentLike ? <AiFillHeart className="text-xs hover:opacity-50 cursor-pointer text-red-600" onClick={handleLikeComment}/> : <AiOutlineHeart className="text-xs hover:opacity-50 cursor-pointer" onClick={handleLikeComment}/>}
            </div>
        </div>
    )
}

export default CommentCard