import { useNavigate } from "react-router-dom"

const StoryCircle = ()=>{
    const navigate = useNavigate()

    const handleClickStory = ()=>{
        navigate("/story")
    }

    return (
        <div onClick={handleClickStory} className="cursor-pointer flex flex-col items-center">
            <img src="https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xinh-k8-cute.jpg" alt="Story" 
            className="w-16 h-16 rounded-full" />
            <p>user name</p>
        </div>
    )
}

export default StoryCircle