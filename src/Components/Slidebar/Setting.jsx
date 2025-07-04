import { useState } from "react"
import { IoLockClosed, IoNotifications, IoPersonRemove, IoShield, IoClose, IoCheckmark, IoChevronForward } from "react-icons/io5"

const SettingsModal = ({ isOpen, onClose }) => {
    const [activeSection, setActiveSection] = useState("general")
    const [blockedUsers, setBlockedUsers] = useState([
        { id: 1, name: "Nguyễn Văn A", username: "@nguyenvana", blockedDate: "2024-01-15" },
        { id: 2, name: "Trần Thị B", username: "@tranthib", blockedDate: "2024-02-20" },
        { id: 3, name: "Lê Minh C", username: "@leminhc", blockedDate: "2024-03-10" }
    ])

    const menuItems = [
        { id: "general", title: "Cài đặt chung", icon: <IoShield />, color: "from-blue-500 to-purple-600" },
        { id: "privacy", title: "Quyền riêng tư", icon: <IoLockClosed />, color: "from-green-500 to-teal-600" },
        { id: "notifications", title: "Thông báo", icon: <IoNotifications />, color: "from-orange-500 to-red-600" },
        { id: "blocked", title: "Người dùng bị chặn", icon: <IoPersonRemove />, color: "from-gray-500 to-gray-700" },
    ]

    const handleUnblockUser = (userId) => {
        setBlockedUsers(prev => prev.filter(user => user.id !== userId))
    }

    const renderSettingsContent = () => {
        switch (activeSection) {
            case "general":
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                                <IoShield className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Cài đặt chung</h3>
                                <p className="text-sm text-gray-500">Tùy chỉnh trải nghiệm của bạn</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Chế độ tối</h4>
                                            <p className="text-sm text-gray-500">Thay đổi giao diện của ứng dụng</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-lg"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition-colors">
                                            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">VN</div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Ngôn ngữ</h4>
                                            <p className="text-sm text-gray-500">Tiếng Việt</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                        <span className="font-medium">Thay đổi</span>
                                        <IoChevronForward className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "privacy":
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white">
                                <IoLockClosed className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Quyền riêng tư</h3>
                                <p className="text-sm text-gray-500">Kiểm soát thông tin cá nhân</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition-colors">
                                            <IoLockClosed className="text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Hồ sơ riêng tư</h4>
                                            <p className="text-sm text-gray-500">Chỉ bạn bè mới có thể xem hồ sơ</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-teal-600 shadow-lg"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition-colors">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Hiển thị trạng thái hoạt động</h4>
                                            <p className="text-sm text-gray-500">Cho phép người khác biết khi bạn online</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-teal-600 shadow-lg"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "notifications":
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
                                <IoNotifications className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Thông báo</h3>
                                <p className="text-sm text-gray-500">Quản lý cách bạn nhận thông báo</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-50 transition-colors">
                                            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Thông báo bài viết mới</h4>
                                            <p className="text-sm text-gray-500">Nhận thông báo khi có bài viết mới</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-600 shadow-lg"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-50 transition-colors">
                                            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs">💬</div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Thông báo tin nhắn</h4>
                                            <p className="text-sm text-gray-500">Nhận thông báo tin nhắn mới</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-600 shadow-lg"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "blocked":
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl text-white">
                                <IoPersonRemove className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Người dùng bị chặn</h3>
                                <p className="text-sm text-gray-500">Quản lý danh sách người dùng bị chặn</p>
                            </div>
                        </div>

                        {blockedUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IoPersonRemove className="text-3xl text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-600 mb-2">Không có người dùng bị chặn</h4>
                                <p className="text-gray-500">Bạn chưa chặn ai cả</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {blockedUsers.map((user) => (
                                    <div key={user.id} className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                        <IoPersonRemove className="text-white text-xs" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 text-lg">{user.name}</h4>
                                                    <p className="text-sm text-gray-500">{user.username}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Bị chặn: {new Date(user.blockedDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnblockUser(user.id)}
                                                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                            >
                                                <IoCheckmark className="group-hover:animate-bounce" />
                                                <span className="font-medium">Bỏ chặn</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] mx-4 overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                            <IoShield className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Cài đặt</h2>
                            <p className="text-sm text-gray-500">Tùy chỉnh trải nghiệm của bạn</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-600 hover:text-red-500"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 p-6">
                        <div className="space-y-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                                        activeSection === item.id
                                            ? 'bg-white shadow-lg transform scale-105'
                                            : 'hover:bg-white/70 hover:shadow-md hover:transform hover:scale-102'
                                    }`}
                                >
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-lg ${
                                        activeSection === item.id ? 'animate-pulse' : ''
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className={`font-semibold ${
                                            activeSection === item.id ? 'text-gray-800' : 'text-gray-600'
                                        }`}>
                                            {item.title}
                                        </h3>
                                    </div>
                                    {activeSection === item.id && (
                                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
                        {renderSettingsContent()}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(100px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default SettingsModal