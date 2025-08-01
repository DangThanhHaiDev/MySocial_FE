import { useRef, useState } from "react";
import { 
  X, 
  ImageIcon, 
  Video, 
  MapPin, 
  Users, 
  UserCheck,
  ChevronDown,
  Upload,
  UserLock
} from "lucide-react";
import axios from "axios";
import url from "../../AppConfig/urlApp";
import { useSelector } from "react-redux";


const CreatePostModal = ({ onClose, isOpen }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const user = useSelector(state => state.auth.user)
  const fileInputRef = useRef();

 

  const privacyOptions = [
    {
      value: "PUBLIC",
      label: "Mọi người",
      icon: Users,
      description: "Bài viết sẽ hiển thị công khai"
    },
    {
      value: "FRIENDS",
      label: "Bạn bè",
      icon: UserCheck,
      description: "Chỉ bạn bè mới có thể xem"
    },
    {
      value: "PRIVATE",
      label: "Chỉ mình tôi",
      icon: UserLock,
      description: "Chỉ bạn có thể xem"
    }
  ];

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const extensions = droppedFiles.map(f => f.type);
    if (extensions.some(ext => ext.startsWith("image/") || ext.startsWith("video/"))) {
      setFiles(droppedFiles);
    } else {
      alert("Vui lòng chọn hình ảnh hoặc video");
    }
  };

  const handleOnChangeFile = (event) => {
    event.preventDefault();
    const selectedFiles = Array.from(event.target.files);
    // Thêm file mới vào danh sách đã chọn, không ghi đè
    setFiles(prev => [...prev, ...selectedFiles]);
    // Reset input để lần sau chọn lại file cũ vẫn trigger được
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };
  const handleReset = ()=>{
    setCaption("")
    setLocation("")
    setFiles([])
  }

  const handleSharePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("privacy", privacy);
    files.forEach(f => formData.append("files", f));

   
    

    try {
     const response = await axios.post(`${url}/api/post`, formData, {
        headers:{
            "Authorization": "Bearer "+localStorage.getItem("token")
        }
     })
      alert("Đã đăng bài viết thành công!");
      onClose();
      handleReset()
    } catch (error) {
      console.log(error);
      handleReset()
      if (error.response && error.response.data && typeof error.response.data === 'string' && error.response.data.includes('không phù hợp')) {
        alert(error.response.data);
      } else if (error.response && error.response.data && error.response.data.message && error.response.data.message.includes('không phù hợp')) {
        alert(error.response.data.message);
      } else {
        alert("Có lỗi xảy ra khi đăng bài viết");
      }
    }
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Tạo bài viết mới</h2>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!files.length && !caption.trim()}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                onClick={handleSharePost}
              >
                Chia sẻ
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Side - Media Upload */}
            <div className="w-1/2 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              {files.length > 0 ? (
                <div className="relative h-full rounded-xl overflow-hidden shadow-lg">
                  {/* Preview nhiều ảnh + ô thêm ảnh mới + input file luôn render */}
                  {(
                    <div className="flex gap-2 flex-wrap mb-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative inline-block">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-1 right-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow p-1 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {/* Ô thêm ảnh mới */}
                      <label
                        htmlFor="file-upload"
                        className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded cursor-pointer hover:bg-gray-100"
                        style={{ minWidth: 96, minHeight: 96 }}
                      >
                        <span className="text-3xl text-gray-400">+</span>
                      </label>
                      {/* Input file luôn luôn render ở đây */}
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleOnChangeFile}
                        ref={fileInputRef}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-8 h-8 text-blue-600" />
                        <Video className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700 mb-2">
                        Kéo ảnh hoặc video vào đây
                      </p>
                      <p className="text-gray-500 text-sm">
                        Hỗ trợ định dạng JPG, PNG, MP4, MOV
                      </p>
                    </div>
                    <div className="pt-4">
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Chọn từ máy tính
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleOnChangeFile}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-200"></div>

            {/* Right Side - Post Details */}
            <div className="w-1/2 flex flex-col min-h-0">
              {/* User Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                      src={user.avatarUrl}
                      alt={user.firstName +" "+ user.lastName}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{user.firstName}</p>
                    <p className="text-sm text-gray-500">{user.firstName +" "+ user.lastName}</p>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-6 flex-1 min-h-0 overflow-y-auto">
                <div className="mb-4">
                  <textarea
                    placeholder="Viết mô tả cho bài viết của bạn..."
                    name="caption"
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    onChange={handleCaptionChange}
                    value={caption}
                    maxLength={2200}
                  />
                  <div className="flex justify-between items-center mt-2 px-2">
                   
                    <span className={`text-sm ${caption.length > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
                      {caption.length}/2,200
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      type="text"
                      placeholder="Thêm vị trí"
                      name="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="mb-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                      className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center">
                        {(() => {
                          const currentOption = privacyOptions.find(opt => opt.value === privacy);
                          const IconComponent = currentOption?.icon;
                          return IconComponent ? (
                            <IconComponent className="w-5 h-5 text-gray-600 mr-3" />
                          ) : null;
                        })()}
                        <div>
                          <p className="font-medium text-gray-800">
                            {privacyOptions.find(opt => opt.value === privacy)?.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {privacyOptions.find(opt => opt.value === privacy)?.description}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showPrivacyDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showPrivacyDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                        {privacyOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setPrivacy(option.value);
                              setShowPrivacyDropdown(false);
                            }}
                            className={`w-full p-4 flex items-center text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                              privacy === option.value ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <option.icon className="w-5 h-5 text-gray-600 mr-3" />
                            <div>
                              <p className="font-medium text-gray-800">{option.label}</p>
                              <p className="text-sm text-gray-500">{option.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;