import { useState } from "react";
import { NavLink } from "react-router";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiGithub
} from "react-icons/fi";

// Google icon from FontAwesome
import { FaGoogle, FaEnvelope } from "react-icons/fa";

export default function SignIn() {
  const [showPass, setShowPass] = useState(false);

  return (
    <AuthLayout title="Welcome Back!">
      <motion.form
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* === Email === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-800 mb-2">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute inset-y-0 left-3 my-auto text-gray-800 text-lg" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-500 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>
        </motion.div>

        {/* === Password === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute inset-y-0 left-3 my-auto text-gray-800 text-lg" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 border border-gray-500 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 my-auto text-gray-800 hover:text-blue-600 transition"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </motion.div>

        {/* === Remember + Forgot === */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            Remember me
          </label>

          <NavLink
            to="/forget_passWord"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot Password?
          </NavLink>
        </motion.div>

        {/* === Sign In Button === */}
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold 
          shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Sign In
        </motion.button>

        {/* === Social Buttons === */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <motion.button
            type="button"
            className="flex items-center justify-center gap-2 py-3 border border-gray-500 rounded-lg 
            hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaGoogle className="w-5 h-5 text-blamr-2" />
            Google
          </motion.button>

          <motion.button
            type="button"
            className="flex items-center justify-center gap-2 py-3 border border-gray-500 rounded-lg 
            hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiGithub className="w-5 h-5 text-gray-800 mr-2" />
            GitHub
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
