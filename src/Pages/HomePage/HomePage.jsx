import { useEffect, useRef, useState } from 'react'
import HomeRight from '../../Components/HomeRight/HomeRight'
import CreatePostModal from '../../Components/Post/CreatePostModal'
import PostCard from '../../Components/Post/PostCard'
import axiosInstance from '../../AppConfig/axiosConfig'
import { useDispatch } from 'react-redux'
import { getAllReaction } from '../../GlobalState/reaction/action'

const HomePage = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)

    const observer = useRef()

    const lastPostRef = (node) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                console.log('Intersection detected, loading next page')
                setPage(prev => prev + 1)
            }
        }, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        })

        if (node) observer.current.observe(node)
    }

    // Refresh data
    const refreshData = async () => {
        setRefreshing(true)
        try {
            const response = await axiosInstance.get(`/api/post?page=0&size=5`)
            const newPosts = response.data

            setData(newPosts)
            setPage(0)
            setHasMore(newPosts.length === 5)

            // Show success message
            console.log('Data refreshed successfully!')
        } catch (err) {
            console.error('Error refreshing data:', err)
        }
        setRefreshing(false)
    }

    // Scroll to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllReaction())
    }, [])

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [])

    // Handle scroll for showing scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            console.log(`Fetching page ${page}`)
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/api/post?page=${page}&size=5`)
                const newPosts = response.data

                console.log(`Received ${newPosts.length} posts for page ${page}`)

                if (page === 0) {
                    setData(newPosts)
                } else {
                    setData(prev => [...prev, ...newPosts])
                }

                // Kiểm tra hasMore - có thể API trả về ít hơn 5 nhưng vẫn còn data
                // Nên kiểm tra chính xác hơn
                if (newPosts.length < 5) {
                    console.log('No more posts available')
                    setHasMore(false)
                } else {
                    setHasMore(true)
                }
            } catch (err) {
                console.error('Error fetching posts:', err)
                setHasMore(false) // Dừng load khi có lỗi
            }
            setLoading(false)
        }

        fetchPosts()

    }, [page])

    // Debug: Log state changes
    useEffect(() => {
        console.log('State updated:', {
            dataLength: data.length,
            page,
            hasMore,
            loading
        })
    }, [data, page, hasMore, loading])

    return (
        <div>
            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-16 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                </button>
            )}

            <div className='mt-10 flex flex-col lg:flex-row w-full justify-center'>
                <div className='w-full lg:w-[50%] px-2 lg:px-10'>
                    {/* Nút làm mới ở đầu trang */}
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={refreshData}
                            disabled={refreshing}
                            className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <div className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}>
                                {refreshing ? (
                                    <div className="rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                        <path d="M21 3v5h-5" />
                                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                        <path d="M3 21v-5h5" />
                                    </svg>
                                )}
                            </div>
                            <span className="font-medium">
                                {refreshing ? 'Đang làm mới...' : 'Làm mới'}
                            </span>
                        </button>
                    </div>

                    <div className='space-y-10 w-full mt-10 px-3 '>
                        {(Array.isArray(data) ? data : []).map((post, idx) => {
                            if (idx === data.length - 1) {
                                return (
                                    <div key={post.id} ref={lastPostRef}>
                                        <PostCard post={post} />
                                    </div>
                                )
                            }
                            return <PostCard key={post.id} post={post} />
                        })}

                        {loading && (
                            <div className="text-center py-4">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="mt-2">Đang tải...</p>
                            </div>
                        )}

                        {!hasMore && data.length > 0 && (
                            <div className="text-center py-4 text-gray-500">
                                <p>Hết bài viết</p>
                                <p className="text-sm">Tổng cộng: {data.length} bài</p>
                                <button
                                    onClick={refreshData}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Làm mới
                                </button>
                            </div>
                        )}

                        {!hasMore && data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-lg font-medium">Không có bài viết nào</p>
                                <p className="text-sm mt-1">Hãy thêm bạn bè để xem nhiều bài viết hơn</p>
                                <button
                                    onClick={refreshData}
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Làm mới
                                </button>
                            </div>
                        )}
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