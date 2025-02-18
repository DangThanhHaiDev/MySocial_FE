import { AiFillHeart } from "react-icons/ai"
import { FaComment } from "react-icons/fa"
import "./profile.scss"

const ReqUserPostCard = () => {
    return (
        <div>
            <div className="post w-60 h-60">
                <div >
                    <img src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="" className="cursor-pointer" />
                </div>
                <div className="overlay">
                    <div className="overlay-text flex justify-between">
                        <div>
                            <AiFillHeart></AiFillHeart> <span>10</span>
                        </div>
                        <div>
                            <FaComment /> <span>30</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ReqUserPostCard