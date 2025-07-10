import { useEffect, useState } from 'react'
import HomeRight from '../../Components/HomeRight/HomeRight'
import CreatePostModal from '../../Components/Post/CreatePostModal'
import PostCard from '../../Components/Post/PostCard'
import StoryCircle from '../../Components/StoryCircle/StoryCircle'
import axiosInstance from '../../AppConfig/axiosConfig'
import { useDispatch } from 'react-redux'
import { getAllReaction } from '../../GlobalState/reaction/action'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {

    const [data, setData] = useState([])

     const dispatch = useDispatch()
    
    useEffect(()=>{
        
        dispatch(getAllReaction())
    }, [])


    useEffect(() => {
        getAllPost()
    }, [])

    const getAllPost = async () => {
        try {
            const response = await axiosInstance.get(`api/post?id=${2}`)
            setData(Array.isArray(response.data) ? response.data : []);
        } catch (error) {

        }
    }

    return (
        <div>
            <div className='mt-10 flex flex-col lg:flex-row w-full justify-center '>
                <div className='w-full lg:w-[50%] px-2 lg:px-10'>
                    <div className='space-y-10 w-full mt-10 px-3 '>
                        {(Array.isArray(data) ? data : []).map((item) => (
                            <div  key={item.id}>
                                <PostCard post={item} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-full lg:w-[35%] sticky top-10 h-fit hidden lg:block'>
                    <HomeRight />
                </div>
            </div>
            <CreatePostModal />
        </div>
    )
}

export default HomePage