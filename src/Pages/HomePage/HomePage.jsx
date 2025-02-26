import HomeRight from '../../Components/HomeRight/HomeRight'
import CreatePostModal from '../../Components/Post/CreatePostModal'
import PostCard from '../../Components/Post/PostCard'
import StoryCircle from '../../Components/StoryCircle/StoryCircle'
const HomePage = ()=>{

    return (
        <div>
            <div className='mt-10 flex w-[100%] justify-center'>
                <div className='w-[45%] px-10'>
                    <div className='storyDiv flex space-x-5 border p-4 rounded-sm justify-start w-full'>
                        {
                            [1,2,3,4,5].map((item)=>(
                                <StoryCircle />
                            ))
                        }
                    </div>
                    <div className='space-y-10 w-full mt-10'>
                        {
                            [1,2,3].map((item)=>(
                                <PostCard />
                            ))
                        }
                    </div>
                </div>
                <div className='w-[35%]'>
                    <HomeRight />
                </div>
            </div>
            <CreatePostModal />
        </div>
    )
}

export default HomePage