import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, User, FileText, Camera, Save, Shield, Mail, Phone, Hash } from 'lucide-react';

const UpdateModal = ({ isOpen, onClose, user, onSave, editType = 'profile' }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: false,
        avatarUrl: '',
        birthDay: '',
        address: '',
        bio: ''
    });


    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                gender: user.gender || false,
                birthDay: user.birthDate ? user.birthDate.split('T')[0] : '', // bạn có thể sửa lại format cho đúng
                address: user.address || '',
                bio: user.biography || ''
            });
        }
    }, [isOpen, user]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            alert('Vui lòng nhập đầy đủ họ và tên!');
            return;
        }

        const dataToSave = {
            ...formData,
            birthDay: new Date(formData.birthDay).toISOString() // LocalDateTime từ client → ISO
        };

        onSave(dataToSave);
    };

    const renderBasicInfoForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        Họ
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:border-slate-300"
                        placeholder="Nhập họ của bạn"
                        required
                    />
                </div>
                <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        Tên
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:border-slate-300"
                        placeholder="Nhập tên của bạn"
                        required
                    />
                </div>
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Giới tính
                </label>
                <div className="flex gap-4">
                    <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all duration-200 flex-1">
                        <input
                            type="radio"
                            name="gender"
                            checked={formData.gender === true}
                            onChange={() => setFormData(prev => ({ ...prev, gender: true }))}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.gender === true ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                            {formData.gender === true && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`font-medium ${formData.gender === true ? 'text-blue-600' : 'text-slate-600'}`}>Nam</span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all duration-200 flex-1">
                        <input
                            type="radio"
                            name="gender"
                            checked={formData.gender === false}
                            onChange={() => setFormData(prev => ({ ...prev, gender: false }))}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.gender === false ? 'border-pink-500 bg-pink-500' : 'border-slate-300'}`}>
                            {formData.gender === false && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`font-medium ${formData.gender === false ? 'text-pink-600' : 'text-slate-600'}`}>Nữ</span>
                    </label>
                </div>
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    Ngày sinh
                </label>
                <input
                    type="date"
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-slate-300"
                />
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    Địa chỉ
                </label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 bg-white hover:border-slate-300"
                    placeholder="Nhập địa chỉ của bạn"
                />
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                        <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    Tiểu sử
                </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 bg-white hover:border-slate-300 resize-none"
                    placeholder="Hãy chia sẻ vài điều thú vị về bản thân bạn..."
                />
            </div>
        </div>
    );

    const renderAvatarForm = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="relative inline-block mb-6">
                    <div className="w-40 h-40 rounded-2xl mx-auto overflow-hidden border-4 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
                        <img
                            src={formData.avatarUrl || '/api/placeholder/160/160'}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-3 bg-blue-500 rounded-xl shadow-lg">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="max-w-md mx-auto">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2 justify-center">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Camera className="w-4 h-4 text-blue-600" />
                        </div>
                        URL ảnh đại diện
                    </label>
                    <input
                        type="url"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white hover:border-slate-300"
                        placeholder="https://example.com/avatar.jpg"
                    />
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-600">
                            💡 Dán URL hình ảnh từ internet hoặc upload lên dịch vụ lưu trữ ảnh
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPasswordForm = () => (
        <div className="space-y-6">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Bảo mật tài khoản</h3>
                    <p className="text-slate-500 text-sm mt-1">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                </div>

                <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 bg-white hover:border-slate-300"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        minLength="6"
                    />
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-700">
                            ⚠️ Để trống nếu không muốn thay đổi mật khẩu hiện tại
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const getModalConfig = () => {
        switch (editType) {
            case 'avatar':
                return {
                    title: 'Cập nhật ảnh đại diện',
                    icon: <Camera className="w-5 h-5" />,
                    gradient: 'from-blue-500 to-indigo-600'
                };
            case 'password':
                return {
                    title: 'Đổi mật khẩu',
                    icon: <Shield className="w-5 h-5" />,
                    gradient: 'from-red-500 to-pink-600'
                };
            default:
                return {
                    title: 'Cập nhật thông tin cá nhân',
                    icon: <User className="w-5 h-5" />,
                    gradient: 'from-emerald-500 to-teal-600'
                };
        }
    };

    const getModalContent = () => {
        switch (editType) {
            case 'avatar': return renderAvatarForm();
            case 'password': return renderPasswordForm();
            default: return renderBasicInfoForm();
        }
    };

    if (!isOpen) return null;

    const modalConfig = getModalConfig();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[100vh] overflow-hidden shadow-2xl">
                {/* Header với gradient */}
                <div className={`bg-gradient-to-r ${modalConfig.gradient} px-8 py-6 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                {modalConfig.icon}
                            </div>
                            <h2 className="text-xl font-bold">
                                {modalConfig.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(95vh-140px)] overflow-y-auto">
                    <div className="p-8">
                        {/* Thông tin không thể sửa - chỉ hiển thị với profile */}
                        {editType === 'profile' && (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-8 border border-slate-200">
                                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-slate-200 rounded-lg">
                                        <Shield className="w-4 h-4 text-slate-600" />
                                    </div>
                                    Thông tin cố định
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                        <Hash className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="text-xs text-slate-500 block">ID</span>
                                            <span className="font-semibold text-slate-700">#{user?.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="text-xs text-slate-500 block">Email</span>
                                            <span className="font-semibold text-slate-700">{user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="text-xs text-slate-500 block">Số điện thoại</span>
                                            <span className="font-semibold text-slate-700">{user?.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                        <Shield className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <span className="text-xs text-slate-500 block">Vai trò</span>
                                            <span className={`font-semibold px-2 py-1 rounded-lg text-xs ${user?.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Content */}
                        {getModalContent()}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`px-8 py-3 bg-gradient-to-r ${modalConfig.gradient} text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2`}
                        >
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;