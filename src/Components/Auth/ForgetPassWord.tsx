import { useState } from "react";
import { NavLink } from "react-router";
import { FaEnvelope } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password reset link sent to:", email);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Section */}
            <div
                className="md:w-1/2 relative flex flex-col justify-center items-center text-black p-10 overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/img/Auth_bg.png')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800/10 to-blue-950 backdrop-blur-[2px]" />

                <div className="relative z-10 text-center max-w-md">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold mb-6 text-shadow-xs text-shadow-white"
                    >
                        Reset Your Password
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-blue-100 text-lg leading-relaxed"
                    >
                        Enter your email address and we'll send you a one-time password to reset your password and secure your account.
                    </motion.p>
                </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center items-center px-6 sm:px-10 md:px-16 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* App Title */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiEdit className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Blogify</h2>
                    </div>

                    {/* Forget Password Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        {/* Header Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                            Forgot Password?
                        </h2>
                        <p className="text-gray-600 text-center text-sm mb-10">
                            No worries! Enter your email and we'll send you a reset OTP
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-800">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-800 group-focus-within:text-blue-500 transition-colors duration-300">
                                        <FaEnvelope className="text-lg" />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 border border-gray-500 rounded-xl text-gray-800 
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
                                        transition-all duration-300 hover:border-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 
                                rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 
                                transition-all duration-300 shadow-lg shadow-blue-500/25 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Send Reset OTP
                            </motion.button>

                            {/* Back to Login */}
                            <div className="text-center pt-4">
                                <NavLink
                                    to="/signIn"
                                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300 group"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                    Back to Login
                                </NavLink>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}