import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../Redux/Features/Auth/authSlice";
import type { RootState } from "../../Redux/store";

export default function AuthLayout({ children, title }: any) {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.auth.mode);

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden">

            {/* ---------- LEFT SECTION ---------- */}
            <motion.div
                className="w-full md:w-1/2 h-full relative flex flex-col justify-center items-center text-white p-10
                overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/img/Auth_bg-2.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/80 backdrop-blur-sm" />

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 text-center max-w-md"
                >
                    <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
                        Welcome Back!
                    </h1>

                    <p className="text-blue-100 text-lg mb-8">
                        Join our community and unlock amazing features tailored just for you.
                    </p>

                    <div className="flex justify-center space-x-6">
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 
                        transition transform hover:scale-110 duration-300">
                            <FaUser className="text-2xl" />
                        </div>

                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 
                        transition transform hover:scale-110 duration-300">
                            <FaEnvelope className="text-2xl" />
                        </div>

                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 
                        transition transform hover:scale-110 duration-300">
                            <FaLock className="text-2xl" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* ---------- RIGHT SECTION (SCROLLABLE) ---------- */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 
            flex flex-col justify-start items-center px-6 sm:px-10 md:px-16 py-10 
            overflow-y-auto h-full">

                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                            <FiEdit className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Blogify</h2>
                    </div>

                    {/* ---------- LOGIN / SIGNUP TABS ---------- */}
                    <div className="flex mb-8 bg-gray-200 rounded-xl p-1">

                        {/* LOGIN */}
                        <button
                            onClick={() => dispatch(setMode("login"))}
                            className={`flex-1 py-3 text-sm font-semibold rounded-lg text-center transition-all duration-300 cursor-pointer
                            ${mode === "login"
                                    ? "bg-white text-blue-600 shadow-md"
                                    : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Login
                        </button>

                        {/* SIGN UP */}
                        <button
                            onClick={() => dispatch(setMode("register"))}
                            className={`flex-1 py-3 text-sm font-semibold rounded-lg text-center transition-all duration-300 cursor-pointer
                            ${mode === "register"
                                    ? "bg-white text-blue-600 shadow-md"
                                    : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* ---------- TITLE ---------- */}
                    <h3 className="text-center text-xl font-semibold mb-6">{title}</h3>

                    {/* ---------- CONTENT ---------- */}
                    {children}
                </div>
            </div>
        </div>
    );
}
