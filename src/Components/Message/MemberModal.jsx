import React, { useEffect, useState } from 'react';
import { X, User, Shield, Trash2, Search } from 'lucide-react';
import axiosInstance from '../../AppConfig/axiosConfig';
import url from '../../AppConfig/urlApp';
import { useSelector } from 'react-redux';

const GroupMembersModal = ({isOpen, onClose, id}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector(state => state.auth.user)
  const [currentUserRole, setCurrentUserRole] = useState()
  
  // Dữ liệu mẫu thành viên
  const [members, setMembers] = useState([]);

  useEffect(()=>{
    getMembers()
  }, [])

  const getMembers = async()=>{
    try {
        const response = await axiosInstance.get(`/api/groups/${id}`)
        console.log(response.data);
        setMembers(response.data)
        const u = response.data.find((item)=>item.id === user.id)
        console.log(u);
        console.log("Hair");
        
        
        setCurrentUserRole(u.role)
    } catch (error) {
        
    }
  }

  // Lọc thành viên theo tìm kiếm
  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Xóa thành viên (chỉ admin mới được phép)
  const handleDeleteMember = (memberId) => {
    if (currentUserRole !== 'ADMIN') {
      alert('Bạn không có quyền xóa thành viên!');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      setMembers(members.filter(member => member.id !== memberId));
    }
  };

  
  return (
    <div className={`${isOpen && "p-6 bg-gray-50 min-h-screen"}`}>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Thành viên nhóm
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Members List */}
            <div className="overflow-y-auto max-h-96">
              {filteredMembers.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={url+member.avatar}
                          alt={member.fullName}
                          className="w-10 h-10 rounded-full bg-gray-300"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{member.fullName}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-xs text-gray-400">
                            Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Role Badge */}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                            member.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {member.role === 'ADMIN' && <Shield size={12} />}
                          {member.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                        </span>

                        {/* Delete Button - chỉ hiển thị nếu user hiện tại là admin */}
                        {currentUserRole === 'ADMIN' && member.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Xóa thành viên"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${isOpen ? "p-8" : ""} text-center text-gray-500`}>
                  <User size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Không tìm thấy thành viên nào</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`${isOpen ? "p-6":""} border-t bg-gray-50`}>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Tổng cộng: {filteredMembers.length} thành viên</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-purple-500" />
                    <span>{members.filter(m => m.role === 'ADMIN').length} Quản trị viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} className="text-gray-500" />
                    <span>{members.filter(m => m.role === 'MEMBER').length} Thành viên</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMembersModal;