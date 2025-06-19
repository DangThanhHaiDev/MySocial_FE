import { useEffect, useState } from 'react'
import HomeRight from '../../Components/HomeRight/HomeRight'
import CreatePostModal from '../../Components/Post/CreatePostModal'
import PostCard from '../../Components/Post/PostCard'
import StoryCircle from '../../Components/StoryCircle/StoryCircle'
import axiosInstance from '../../AppConfig/axiosConfig'
import { useDispatch } from 'react-redux'
import { getAllReaction } from '../../GlobalState/reaction/action'
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
            const response = await axiosInstance.get(`api/post?id=${1}`)
            setData(response.data)
            console.log(response);

        } catch (error) {

        }
    }

    return (
        <div>
            <div className='mt-10 flex w-[100%] justify-center'>
                <div className='w-[50%] px-10'>
                    <div className='storyDiv flex space-x-5 border p-4 rounded-sm justify-start w-full'>
                        {
                            [1, 2, 3, 4, 5].map((item) => (
                                <StoryCircle />
                            ))
                        }
                    </div>
                    
                    <div className='space-y-10 w-full mt-10 px-3'>
                        {
                            data.length > 0 && data.map((item) => (
                                <div  key={item.id}>
                                    <PostCard post={item} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='w-[35%] sticky top-10 h-fit'>
                    <HomeRight />
                </div>
            </div>
            <CreatePostModal />
        </div>
    )
}

export default HomePage