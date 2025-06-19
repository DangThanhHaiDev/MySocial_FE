import { useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import axiosInstance from "../../../AppConfig/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../GlobalState/auth/Action";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr]= useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {error, user} = useSelector(state => state.auth)
    
    
    useEffect(()=>{
       if(error){
        setErr(error)
       }
    }, [error])

    const handleSubmit = (e) => {
        setErr("")
        e.preventDefault();
        setLoading(true);
        handleLogin()
        setLoading(false)

    };

    const handleLogin = () => {
        dispatch(login({email, password}))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-4">
            <div className="backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white">
                <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide">Welcome Back</h2>
                <p className="text-center text-sm text-white/80 mb-8">Đăng nhập để tiếp tục kết nối bạn bè</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {
                        err && 
                        <p className="text-red-600 w-full text-xs">{err}</p>
                    }
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition duration-200"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-white/70">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-white underline hover:text-blue-200">Đăng ký</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
