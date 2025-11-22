import { NavLink } from "react-router";
import { FiArrowLeft, FiLock, FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMode } from "../../Redux/Features/Auth/authSlice";

export default function ResetPassword() {

    const dispatch = useDispatch()
    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* ========= LEFT SIDE ========= */}
            <div
                className="md:w-1/2 relative flex flex-col justify-center items-center text-white p-10 bg-cover bg-center"
                style={{ backgroundImage: "url('/img/Auth_bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900/60 to-blue-950 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center max-w-md">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-extrabold mb-4 tracking-wide text-shadow-xs text-shadow-white/5"
                    >
                        Change Password
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-white text-lg leading-relaxed font-light"
                    >
                        Create a strong password and keep your account secure.
                    </motion.p>
                </div>
            </div>

            {/* ========= RIGHT SIDE ========= */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center px-6 md:px-16 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* LOGO */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                            <FiEdit className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800">Blogify</h2>
                    </div>

                    {/* CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
                    >
                        {/* ICON */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiLock className="text-white w-7 h-7" />
                                </div>
                            </div>
                        </motion.div>

                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            Create New Password
                        </h2>
                        <p className="text-gray-500 text-center text-sm mb-8">
                            Make sure your password is strong and secure.
                        </p>

                        {/* ==== NEW PASSWORD ==== */}
                        <label className="text-sm text-gray-800 font-medium">New Password</label>
                        <div className="relative mb-4 mt-1">
                            <FiLock className="absolute left-4 top-4.5 text-gray-800" />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Enter new password"
                                className="w-full pl-10 pr-10 py-3 border rounded-xl border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300 hover:border-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-4.5 text-gray-800 hover:text-blue-600"
                            >
                                {showPass ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        {/* ==== CONFIRM PASSWORD ==== */}
                        <label className="text-sm text-gray-800 font-medium">Confirm Password</label>
                        <div className="relative mb-6 mt-1">
                            <FiLock className="absolute left-4 top-4.5 text-gray-800" />
                            <input
                                type={showCPass ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="w-full pl-10 pr-10 py-3 border rounded-xl border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition duration-300 hover:border-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCPass(!showCPass)}
                                className="absolute right-4 top-4.5 text-gray-800 hover:text-blue-600"
                            >
                                {showCPass ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        {/* BUTTON */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
                        >
                            Reset Password
                        </motion.button>

                        {/* BACK LINK */}
                        <div className="text-center pt-4">
                            <button
                                onClick={() => dispatch(setMode("login"))}
                                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 font-medium group"
                            >
                                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                                Back to Login
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
