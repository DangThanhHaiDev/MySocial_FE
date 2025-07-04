import { useState } from "react";
import axiosInstance from "../../../AppConfig/axiosConfig";
import { useNavigate } from "react-router-dom";
import logo from "../../../Resource/images/logo.jpg";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    password: "",
    birthDate: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const validate = () => {
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email không hợp lệ";
    if (!form.firstName || form.firstName.length < 2) return "Tên phải có ít nhất 2 ký tự";
    if (!form.lastName || form.lastName.length < 2) return "Họ phải có ít nhất 2 ký tự";
    if (form.gender === "") return "Vui lòng chọn giới tính";
    if (!form.password || !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(form.password)) return "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    if (!form.birthDate) return "Vui lòng chọn ngày sinh";
    if (!form.phone || !/^(\+84|0)(3|5|7|8|9)[0-9]{8}$/.test(form.phone)) return "Số điện thoại không hợp lệ";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        gender: form.gender === true || form.gender === "true",
        birthDate: form.birthDate + "T00:00:00", // đúng định dạng LocalDateTime
      };
      const res = await axiosInstance.post("/auth/register", payload);
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 p-4">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-white relative overflow-hidden">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/10 rounded-3xl pointer-events-none" style={{backdropFilter: 'blur(12px)'}}></div>
        <div className="relative z-10 flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-16 h-16 rounded-full shadow-lg mb-4 border-2 border-white/60" />
          <h2 className="text-4xl font-extrabold text-center mb-2 tracking-wide drop-shadow-lg">Đăng ký tài khoản</h2>
          <p className="text-center text-base text-white/80 mb-6 font-medium">Tạo tài khoản để kết nối bạn bè</p>
        </div>
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="Tên"
              className="w-1/2 py-3 px-4 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Họ"
              className="w-1/2 py-3 px-4 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full py-3 px-4 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="flex items-center gap-8 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={true}
                checked={form.gender === true || form.gender === "true"}
                onChange={handleChange}
                className="accent-indigo-400 scale-110"
              />
              <span className="font-medium">Nam</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={false}
                checked={form.gender === false || form.gender === "false"}
                onChange={handleChange}
                className="accent-pink-400 scale-110"
              />
              <span className="font-medium">Nữ</span>
            </label>
          </div>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="w-full py-3 px-4 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="birthDate"
            placeholder="Ngày sinh"
            className="w-full py-3 px-4 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
            value={form.birthDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split("T")[0]}
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            className="w-full py-3 px-4 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
            value={form.phone}
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-400 text-center font-semibold bg-white/20 rounded-lg py-2 px-3 animate-pulse shadow-md">{error}</p>}
          {success && <p className="text-green-300 text-center font-semibold bg-white/20 rounded-lg py-2 px-3 animate-bounce shadow-md">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-400 to-blue-400 text-white font-bold py-3 rounded-xl shadow-lg hover:from-indigo-500 hover:to-blue-500 transition-all duration-200 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <p className="mt-7 text-sm text-center text-white/80 relative z-10">
          Đã có tài khoản? {" "}
          <a href="/login" className="text-indigo-200 underline hover:text-blue-200 font-semibold transition-all duration-150">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
