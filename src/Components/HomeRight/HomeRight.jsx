import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { useNavigate } from "react-router-dom";

const HomeRight = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get("/api/friends/suggest");
            setSuggestions(res.data);
        } catch (err) {
            setError("Không thể tải danh sách gợi ý kết bạn");
        } finally {
            setLoading(false);
        }
    };

   

    const handleAddFriend = async(userId) => {
        try {
            const resposne = await axiosInstance.post(`/api/friends/request/${userId}`)
            const {data} = resposne
            if(data.id){
                console.log(data);
                
            }
        } catch (error) {
            console.log(error);
        }
        setSuggestions(prev => prev.filter(u => u.id !== userId));
    };

    return (
        <div>
            <div>
                <div>
                    
                    <div className="flex items-center mt-5 justify-between">
                        <p className="text-sm font-semibold opacity-70">Suggestions for you</p>
                        <p className="text-sm font-semibold ">See All</p>
                    </div>
                    <div className="space-y-5 mt-5">
                        {loading && <p>Đang tải...</p>}
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        {suggestions.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded shadow" >
                                <div className="flex items-center gap-3">
                                    <img className="h-10 w-10 rounded-full object-cover cursor-pointer" src={user.avatarUrl || "/default-image.jpg"} alt="avatar"onClick={()=>navigate(`/profile/${user.id}`)} />
                                    <div>
                                        <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                    onClick={() => handleAddFriend(user.id)}
                                >
                                    Add Friend
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeRight;