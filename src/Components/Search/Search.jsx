import { CloseButton } from "@chakra-ui/react"
import { useState, useEffect, useRef, useCallback } from "react"
import SearchUserCard from "./SearchUserCard"
import axiosInstance from "../../AppConfig/axiosConfig"

const Search = ({ handleCloseSearch }) => {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [error, setError] = useState("")

    const searchTimeoutRef = useRef(null)
    const containerRef = useRef(null)
    const isInitialLoad = useRef(true)

    const pageSize = 5

    // Debounced search function
    const debouncedSearch = useCallback((term) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            resetSearch(term)
        }, 500)
    }, [])

    // Reset search khi search term thay đổi
    const resetSearch = (term) => {
        setUsers([])
        setCurrentPage(0)
        setHasNextPage(true)
        setError("")
        searchUsers(term, 0, true)
    }

    // Hàm gọi API tìm kiếm
    const searchUsers = async (term, page, isNewSearch = false) => {
        if (loading) return

        setLoading(true)
        setError("")
        console.log(term);
        

        try {
            const response = await axiosInstance.get(
                `/api/users/search?searchTerm=${encodeURIComponent(term.trim())}&page=${page}&size=${pageSize}`
            )

            const { data } = response

            if (isNewSearch) {
                setUsers(data.users)
            } else {
                setUsers(prev => [...prev, ...data.users])
            }

            setHasNextPage(data.hasNext)
            setCurrentPage(data.currentPage)
            setTotalElements(data.totalElements)

        } catch (err) {
            setError(err.message)
            console.error('Search error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Load more khi scroll đến cuối
    const loadMore = useCallback(() => {
        if (!loading && hasNextPage) {
            searchUsers(searchTerm, currentPage + 1)
        }
    }, [searchTerm, currentPage, loading, hasNextPage])

    // Infinite scroll handler - FIXED
    const handleScroll = useCallback(() => {
        const container = containerRef.current
        if (!container) return

        const { scrollTop, scrollHeight, clientHeight } = container
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50 // Reduced threshold

        if (isNearBottom && hasNextPage && !loading) {
            loadMore()
        }
    }, [hasNextPage, loading, loadMore])

    // Effect để xử lý scroll - FIXED
    useEffect(() => {
        const container = containerRef.current
        if (container) {
            // Add passive option for better performance
            container.addEventListener('scroll', handleScroll, { passive: true })
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    // Effect để tìm kiếm ban đầu và khi search term thay đổi
    useEffect(() => {
        if (isInitialLoad.current) {
            // Load dữ liệu ban đầu
            searchUsers("", 0, true)
            isInitialLoad.current = false
        }
    }, [])

    // Xử lý thay đổi search input
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        debouncedSearch(value)
    }

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    return (
        <div className="relative z-40 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
            {/* Header Section */}
            <div className="px-4 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold text-gray-800">Search</h1>
                    <CloseButton
                        onClick={handleCloseSearch}
                        className="text-gray-500 hover:text-gray-700"
                    />
                </div>
                
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                
                
            </div>

            {/* Scrollable Content */}
            <div
                ref={containerRef}
                className="px-4 pt-4 h-96 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db #f3f4f6'
                }}
            >
                {error && (
                    <div className="text-red-500 text-center py-4 bg-red-50 rounded-lg mb-4">
                        <p className="font-medium">Lỗi: {error}</p>
                    </div>
                )}

                {users.length === 0 && !loading && !error && (
                    <div className="text-gray-500 text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-lg">
                            {searchTerm ? 'Không tìm thấy người dùng nào' : 'Nhập để tìm kiếm người dùng'}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {users.map((user, index) => (
                        <div key={`${user.id}-${index}`} className="transition-all duration-200 hover:bg-gray-50 rounded-lg p-2">
                            <SearchUserCard
                                user={user}
                                searchReason={user.reason}
                                mutualFriendsCount={user.mutualFriendsCount}
                                isFriend={user.isFriend}
                            />
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="text-center py-6">
                        <div className="flex justify-center items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                            <span className="text-gray-600">Đang tải...</span>
                        </div>
                    </div>
                )}

                {!hasNextPage && users.length > 0 && (
                    <div className="text-gray-500 text-center py-4 border-t border-gray-200 mt-4">
                        <p className="text-sm">Đã hiển thị tất cả kết quả</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search