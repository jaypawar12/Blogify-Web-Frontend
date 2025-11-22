import { useState } from "react";
import { useNavigate } from "react-router";
import { FaEnvelope } from "react-icons/fa";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { ErrorAlert } from "../../Components/ErrorAlert";
import { routePath } from "../../Routes/routes";
import { setMode } from "../../Redux/Features/Auth/authSlice";
import { useDispatch } from "react-redux";

export default function ForgetPassword() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [loader, setLoader] = useState(false);
    const [loginFailed, setLoginFailed] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Empty email
        if (!email) {
            setLoginFailed("Email is required.");
            return;
        }

        // Invalid email format check
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setLoginFailed("Please enter a valid email address.");
            return;
        }

        try {
            setLoader(true);
            setLoginFailed("");

            const data = await authService.forgotPassword({ email });

            if (!data.error) {
                toast.success(data.message);

                navigate(routePath.otpVerify, {
                    replace: true,
                    state: { email },
                });
            } else {
                setLoginFailed(data.message);
            }

            setLoader(false);
        } catch (err) {
            console.log("Forgot Password Error:", err);
            toast.error("Something went wrong. Please try again.");
            setLoader(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Section */}
            <div
                className="md:w-1/2 relative flex flex-col justify-center items-center text-white p-10 overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/img/Auth_bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900/60 to-blue-950 backdrop-blur-[2px]" />

                <div className="relative z-10 text-center max-w-md">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold mb-6"
                    >
                        Reset Your Password
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-blue-100 text-lg leading-relaxed"
                    >
                        Enter your email address and we'll send you a one-time
                        password to reset your account.
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

                        <h2 className="text-3xl font-bold text-gray-800">
                            Blogify
                        </h2>
                    </div>

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                        }}
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
                        <p className="text-gray-600 text-center text-sm mb-6">
                            Enter your email and we'll send you a reset OTP
                        </p>

                        {/* Error Alert */}
                        {loginFailed && (
                            <ErrorAlert message={loginFailed} />
                        )}

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
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3.5 border border-gray-500 rounded-xl text-gray-800 
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
                                            transition-all duration-300 hover:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 
                                    rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 
                                    transition-all duration-300 shadow-lg shadow-blue-500/25 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {loader ? (
                                    <ButtonLoader message="Sending OTP..." />
                                ) : (
                                    "Send Reset OTP"
                                )}
                            </motion.button>

                            {/* Back to Login */}
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => dispatch(setMode("login"))}
                                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 font-medium group cursor-pointer"
                                >
                                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
