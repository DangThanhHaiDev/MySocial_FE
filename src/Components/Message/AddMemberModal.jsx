import { useState, useEffect } from 'react';
import { Search, UserPlus, X, Check, Users, Sparkles, Crown, Shield, Star } from 'lucide-react';
import axiosInstance from '../../AppConfig/axiosConfig';

const AddMemberModal = ({ isOpen, onClose, onAddMembers, currentMembers = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState([])

    useEffect(() => {
        getFriends()
    }, [])

    const getFriends = async()=>{
        try {
            const response = await axiosInstance.get(`/api/friends/list`)
            setFriends(response.data)
            console.log(response.data);        
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(friends.length !== 0){
            setSearchResults(friends)
        }
    }, [friends])

    useEffect(() => {
        if (searchTerm) {
            setIsLoading(true);
            setTimeout(() => {
                const filtered = friends.filter(user =>
                    user.firstName+" "+user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSearchResults(filtered);
                setIsLoading(false);
            }, 500);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleUserSelect = (user) => {
        setSelectedUsers(prev => {
            const isSelected = prev.find(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };


    const handleAddMembers = () => {
        const userIds = selectedUsers.map((user)=>user.id)
        onAddMembers(userIds)
        setSelectedUsers([]);
        setSearchTerm('');
        onClose();
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Crown className="w-3 h-3 text-yellow-500" />;
            case 'moderator': return <Shield className="w-3 h-3 text-blue-500" />;
            default: return <Star className="w-3 h-3 text-gray-400" />;
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Thêm thành viên</h2>
                                <p className="text-white/80 text-sm">Mời bạn bè tham gia cuộc trò chuyện</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-2 right-20 w-2 h-2 bg-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 right-8 w-1 h-1 bg-white/40 rounded-full"></div>
                    <Sparkles className="absolute top-1/2 right-12 w-4 h-4 text-white/30" />
                </div>



                {/* Content */}
                <div className="p-4 max-h-96 overflow-y-auto">
                    <>
                        {/* Search Input */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên hoặc username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                            />
                        </div>

                        {/* Search Results */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-2">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user)}
                                        className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${selectedUsers.find(u => u.id === user.id) ? 'bg-blue-50 border-2 border-blue-200' : 'border border-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {getInitials(user.firstName+" "+user.lastName)}
                                                </div>

                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-gray-900">{user.firstName+" "+user.lastName}</h3>
                                                    {getRoleIcon(user.role)}
                                                </div>
                                                <p className="text-sm text-gray-500 text-left">{user.email}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedUsers.find(u => u.id === user.id)
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'border-gray-300'
                                                }`}>
                                                {selectedUsers.find(u => u.id === user.id) && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : searchTerm ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Nhập tên hoặc username để tìm kiếm</p>
                            </div>
                        )}
                    </>



                </div>

                {/* Selected Users Preview */}
                {selectedUsers.length > 0 && (
                    <div className="border-t border-gray-200 p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Đã chọn ({selectedUsers.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center space-x-2 bg-blue-100 rounded-full px-3 py-1"
                                >
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                        {getInitials(user.firstName+" "+user.lastName)}
                                    </div>
                                    <span className="text-sm text-blue-800">{user.firstName+" "+user.lastName}</span>
                                    <button
                                        onClick={() => handleUserSelect(user)}
                                        className="w-4 h-4 text-blue-600 hover:text-blue-800"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAddMembers}
                            disabled={selectedUsers.length === 0}
                            className={`flex-1 py-3 px-4 font-medium rounded-xl transition-all ${selectedUsers.length > 0
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Thêm {selectedUsers.length > 0 && `(${selectedUsers.length})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Demo Component


export default AddMemberModal;