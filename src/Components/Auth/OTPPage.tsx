import { NavLink } from "react-router";
import { FiArrowLeft, FiShield, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

export default function OTPVerification() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* Left Section */}
            <div
                className="md:w-1/2 relative flex flex-col justify-center items-center text-white p-10 bg-cover bg-center"
                style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DCpurMwMraLTEgM-6it5U2B0BqNIXKOkrQ&s')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/65 to-gray-900/80 backdrop-blur-sm" />

                <div className="relative z-10 text-center max-w-md font-bold text-shadow-xs text-shadow-white">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold mb-6"
                    >
                        Verify OTP
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-blue-100 text-lg text-shadow-2xs text-shadow-black"
                    >
                        We sent a 6-digit code to your email. Enter it below.
                    </motion.p>
                </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center items-center p-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >

                    {/* Header */}
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiEdit className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Blogify</h2>
                    </div>

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                    >

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiShield className="text-white w-7 h-7" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center mb-2">
                            Enter Verification Code
                        </h2>
                        <p className="text-gray-600 text-center mb-8 text-sm">
                            Please enter the 6-digit code sent to your email
                        </p>

                        {/* OTP Input Boxes */}
                        <div className="flex justify-center gap-3 mb-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <motion.input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                    whileFocus={{ scale: 1.12 }}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                        >
                            Verify & Continue
                        </motion.button>

                        {/* Back to Login */}
                        <div className="text-center pt-4">
                            <NavLink
                                to="/signIn"
                                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 font-medium group"
                            >
                                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </NavLink>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
