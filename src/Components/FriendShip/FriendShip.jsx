import { useEffect, useState } from "react";
import axiosInstance from "../../AppConfig/axiosConfig";
import { FaUserFriends, FaUserPlus, FaUserTimes, FaSearch, FaUser, FaCommentDots, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const FriendShip = () => {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [tab, setTab] = useState("requests");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await axiosInstance.get("/api/friends/suggest");
            setSuggestions(res.data);
        } catch (err) {
          console.log(err);
          
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

  useEffect(() => {
    if (tab === "requests") fetchRequests();
    if (tab === "friends") fetchFriends();
  }, [tab]);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/api/friends/requests");
      setRequests(res.data);
      console.log(res.data);
      
    } catch (err) {
      setRequests([]);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axiosInstance.get("/api/friends/list");
      setFriends(res.data);
    } catch (err) {
      setFriends([]);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      await axiosInstance.post(`/api/friends/accept/${friendshipId}`);
      setRequests((prev) => prev.filter((r) => r.id !== friendshipId));
      fetchFriends();
    } catch (err) {
      alert("Lỗi khi chấp nhận lời mời!");
    }
  };

  const handleDecline = async (friendshipId) => {
    try {
      await axiosInstance.post(`/api/friends/decline/${friendshipId}`);
      setRequests((prev) => prev.filter((r) => r.id !== friendshipId));
    } catch (err) {
      alert("Lỗi khi từ chối lời mời!");
    }
  };

  const handleUnfriend = async (userId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy kết bạn với người này?")) return;
    try {
      await axiosInstance.post(`/api/friends/unfriend/${userId}`);
      setFriends(prev => prev.filter(f => f.id !== userId));
    } catch (err) {
      alert("Hủy kết bạn thất bại!");
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleChat = (userId) => {
    navigate(`/message/${userId}`);
  };

  const filteredFriends = friends.filter(friend =>
    (friend.firstName + " " + friend.lastName + " " + friend.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold flex items-center gap-2 shadow ${tab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("requests")}
        >
          <FaUserPlus /> Lời mời kết bạn
        </button>

        <button
          className={`px-4 py-2 rounded font-semibold flex items-center gap-2 shadow ${tab === "friends" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("friends")}
        >
          <FaUserFriends /> Bạn bè
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold flex items-center gap-2 shadow ${tab === "suggestion" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setTab("suggestion")}
        >
          <FaUserFriends /> Đề xuất
        </button>
      </div>
      {tab === "requests" && (
        <>
          {requests.length === 0 && <div className="text-gray-500 text-center py-8">Không có lời mời nào.</div>}
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition">
                <div className="flex items-center gap-3 cursor-pointer" >
                  <img src={req.requester?.avatarUrl || DEFAULT_AVATAR} onClick={()=>navigate(`/profile/${req.requester.id}`)} alt="avatar" className="h-12 w-12 rounded-full object-cover border-2 border-blue-200" />
                  <div>
                    <p className="font-semibold text-lg">{req.requester?.firstName} {req.requester?.lastName}</p>
                    <p className="text-xs text-gray-500">{req.requester?.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold shadow"
                    onClick={() => handleAccept(req.id)}
                  >
                    <FaUserPlus className="inline mr-1" /> Chấp nhận
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
                    onClick={() => handleDecline(req.id)}
                  >
                    <FaUserTimes className="inline mr-1" /> Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "friends" && (
        <>
          <div className="flex items-center gap-2 mb-4 bg-white rounded-lg px-3 py-2 shadow">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm bạn bè..."
              className="w-full outline-none bg-transparent text-base px-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {filteredFriends.length === 0 && <div className="text-gray-500 text-center py-8">Bạn chưa có bạn bè nào.<br />Hãy gửi lời mời kết bạn để kết nối nhiều hơn!</div>}
          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition">
                <img src={friend.avatarUrl || DEFAULT_AVATAR} alt="avatar" className="h-12 w-12 rounded-full object-cover border-2 border-blue-200" />
                <div>
                  <p className="font-semibold text-lg">{friend.firstName} {friend.lastName}</p>
                  <p className="text-xs text-gray-500">{friend.email}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button title="Xem profile" onClick={() => handleViewProfile(friend.id)} className="bg-gray-100 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded transition text-xs font-semibold flex items-center gap-1"><FaUser /> Profile</button>
                  <button title="Hủy kết bạn" onClick={() => handleUnfriend(friend.id)} className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded transition text-xs font-semibold flex items-center gap-1"><FaTrash /> Hủy</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {
        tab === "suggestion" && (
          <div className="space-y-5 mt-5">

            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-white rounded shadow">
                <div className="flex items-center gap-3">
                  <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl || "/default-image.jpg"} alt="avatar" />
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
        )
      }
    </div>
  );
};

export default FriendShip;
