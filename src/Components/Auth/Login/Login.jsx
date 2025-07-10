import { useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../GlobalState/auth/Action";
import logo from "../../../Resource/images/logo.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr]= useState("")
    const dispatch = useDispatch()
    const {error, user} = useSelector(state => state.auth)
    
    useEffect(()=>{
       if(error && error!=="Access Denied"){
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 p-4">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-white relative overflow-hidden">
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl pointer-events-none" style={{backdropFilter: 'blur(12px)'}}></div>
                <div className="relative z-10 flex flex-col items-center">
                    <img src={logo} alt="Logo" className="w-16 h-16 rounded-full shadow-lg mb-4 border-2 border-white/60" />
                    <h2 className="text-4xl font-extrabold text-center mb-2 tracking-wide drop-shadow-lg">Welcome Back</h2>
                    <p className="text-center text-base text-white/80 mb-6 font-medium">Đăng nhập để tiếp tục kết nối bạn bè</p>
                </div>
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 shadow-sm"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {
                        err && 
                        <p className="text-red-400 text-center font-semibold bg-white/20 rounded-lg py-2 px-3 shadow-md">Tên đăng nhập hoặc mật khẩu không đúng</p>
                    }
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-400 to-blue-400 text-white font-bold py-3 rounded-xl shadow-lg hover:from-indigo-500 hover:to-blue-500 transition-all duration-200 active:scale-95 disabled:opacity-60"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="mt-7 text-sm text-center text-white/80 relative z-10">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-indigo-200 underline hover:text-blue-200 font-semibold transition-all duration-150">Đăng ký</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
