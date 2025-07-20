// import { useEffect, useState, useRef } from "react";
// import axiosInstance from "../../AppConfig/axiosConfig";
// import { useNavigate } from "react-router-dom";

// const HomeRight = () => {
//     const [suggestions, setSuggestions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const navigate = useNavigate()

//     useEffect(() => {
//         fetchSuggestions();
//     }, []);

//     const fetchSuggestions = async () => {
//         setLoading(true);
//         setError("");
//         try {
//             const res = await axiosInstance.get("/api/friends/suggest");
//             setSuggestions(Array.isArray(res.data) ? res.data : []);
//         } catch (err) {
//             setError("Không thể tải danh sách gợi ý kết bạn");
//             setSuggestions([]);
//         } finally {
//             setLoading(false);
//         }
//     };

   

//     const handleAddFriend = async(userId) => {
//         try {
//             const resposne = await axiosInstance.post(`/api/friends/request/${userId}`)
//             const {data} = resposne
//             if(data.id){
//                 console.log(data);
                
//             }
//         } catch (error) {
//             console.log(error);
//         }
//         setSuggestions(prev => prev.filter(u => u.id !== userId));
//     };

//     return (
//         <div>
//             <div>
//                 <div>
                    
//                     <div className="flex items-center mt-5 justify-between">
//                         <p className="text-sm font-semibold opacity-70">Suggestions for you</p>
//                         <p className="text-sm font-semibold ">See All</p>
//                     </div>
//                     <div className="space-y-5 mt-5">
//                         {loading && <p>Đang tải...</p>}
//                         {error && <p className="text-red-500 text-xs">{error}</p>}
//                         {(Array.isArray(suggestions) ? suggestions : []).map((user) => (
//                             <div key={user?.id} className="flex items-center justify-between p-2 bg-white rounded shadow" >
//                                 <div className="flex items-center gap-3">
//                                     <img className="h-10 w-10 rounded-full object-cover cursor-pointer" src={user?.avatarUrl || "/default-image.jpg"} alt="avatar"onClick={()=>navigate(`/profile/${user.id}`)} />
//                                     <div>
//                                         <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
//                                         <p className="text-xs text-gray-500">{user?.email}</p>
//                                     </div>
//                                 </div>
//                                 <button
//                                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
//                                     onClick={() => handleAddFriend(user.id)}
//                                 >
//                                     Add Friend
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default HomeRight;

import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useNavigate } from "react-router-dom";

const HomeRight = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuggestions();
    }, [currentPage]);

    const fetchSuggestions = async (page = currentPage) => {
        setLoading(true);
        setError("");
        try {
            // Lấy userId từ localStorage hoặc context
            
            const res = await axiosInstance.get(`/api/friends/suggestions`, {
                params: {
                    page: page,
                    size: pageSize
                }
            });
            
            const data = res.data;
            setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
            setHasNext(data.hasNext || false);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.currentPage || 0);
        } catch (err) {
            setError("Không thể tải danh sách gợi ý kết bạn");
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy userId hiện tại (bạn có thể thay đổi theo cách lưu trữ của mình)
    const getCurrentUserId = () => {
        // Thay đổi logic này theo cách bạn lưu trữ user info
        return 1; // Hoặc lấy từ Redux/Context
    };

    const handleAddFriend = async (userId) => {
        try {
            const response = await axiosInstance.post(`/api/friends/request/${userId}`);
            const { data } = response;
            if (data.id) {
                console.log("Friend request sent:", data);
                // Xóa user khỏi danh sách suggestions
                setSuggestions(prev => prev.filter(u => u.id !== userId));
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
            setError("Không thể gửi lời mời kết bạn");
        }
    };

    

    const handleSeeAll = () => {
        navigate('/friendship');
    };

    const getSuggestionReasonColor = (reason) => {
        switch (reason) {
            case 'Bạn chung':
                return 'bg-blue-100 text-blue-600';
            case 'Cùng tỉnh':
                return 'bg-green-100 text-green-600';
            case 'Đề xuất':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">Suggestions for you</p>
                <button 
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    onClick={handleSeeAll}
                >
                    Xem tất cả
                </button>
            </div>

            <div className="space-y-3">
                {loading && currentPage === 0 && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-xs bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {(Array.isArray(suggestions) ? suggestions : []).map((user) => (
                    <div key={user?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative">
                                <img 
                                    className="h-12 w-12 rounded-full object-cover cursor-pointer ring-2 ring-white shadow-sm" 
                                    src={user?.avatarUrl || "/default-image.jpg"} 
                                    alt="avatar"
                                    onClick={() => navigate(`/profile/${user.id}`)} 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getSuggestionReasonColor(user?.suggestionReason)}`}>
                                        {user?.suggestionReason}
                                    </span>
                                    {user?.mutualFriendsCount > 0 && (
                                        <span className="text-xs text-gray-500">
                                            {user.mutualFriendsCount} bạn chung
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium shadow-sm"
                            onClick={() => handleAddFriend(user.id)}
                        >
                            Kết bạn
                        </button>
                    </div>
                ))}

                {suggestions.length === 0 && !loading && !error && (
                    <div className="text-center py-6 text-gray-500">
                        <p className="text-sm">Không có gợi ý kết bạn nào</p>
                    </div>
                )}

             

            
            </div>
        </div>
    );
};

export default HomeRight;