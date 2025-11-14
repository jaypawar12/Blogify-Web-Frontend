import { NavLink } from "react-router";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AuthLayout({ children, title }: any) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* Left Section */}
            <motion.div
                className="w-full md:w-1/2 relative flex flex-col justify-center items-center text-white p-10 
                overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/img/Auth_bg-1.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}

            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/80 backdrop-blur-sm" />

                {/* Content */}
                <motion.div

                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 text-center max-w-md">
                    <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight text-shadow-2xs text-shadow-black">
                        Welcome Back!
                    </h1>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join our community and unlock amazing features tailored just for you.
                    </p>

                    <div className="flex justify-center space-x-6">
                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-full 
                        hover:bg-white/30 transition transform hover:scale-110 duration-300">
                            <FaUser className="text-2xl" />
                        </div>

                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-full 
                        hover:bg-white/30 transition transform hover:scale-110 duration-300">
                            <FaEnvelope className="text-2xl" />
                        </div>

                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-full 
                        hover:bg-white/30 transition transform hover:scale-110 duration-300">
                            <FaLock className="text-2xl" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center 
            items-center px-6 sm:px-10 md:px-16 py-10">

                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                            <FiEdit className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Blogify</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-8 bg-gray-200 rounded-xl p-1">
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `flex-1 py-3 text-sm font-semibold rounded-lg text-center transition-all duration-300 ${isActive
                                    ? "bg-white text-blue-600 shadow-md"
                                    : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                `flex-1 py-3 text-sm font-semibold rounded-lg text-center transition-all duration-300 ${isActive
                                    ? "bg-white text-blue-600 shadow-md"
                                    : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            Sign Up
                        </NavLink>
                    </div>

                    {/* Page Title */}
                    <h3 className="text-center text-xl font-semibold mb-6">{title}</h3>

                    {/* Page Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
