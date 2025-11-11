import { useState } from "react";
import { NavLink } from "react-router";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiCheckCircle, FiEye, FiEyeOff, FiMail } from "react-icons/fi";

export default function SignUp() {
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  return (
    <AuthLayout title="Create Account">
      <motion.form
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* === Full Name === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <FiUser className="absolute inset-y-0 left-3 my-auto text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 outline-none transition-all
              duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>
        </motion.div>

        {/* === Email === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <FiMail className="absolute inset-y-0 left-3 my-auto text-gray-400 text-lg" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 outline-none transition-all
              duration-300 shadow-sm hover:shadow-md"
              required
            />
          </div>
        </motion.div>

        {/* === Password === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute inset-y-0 left-3 my-auto text-gray-400 text-lg" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 outline-none transition-all
              duration-300 shadow-sm hover:shadow-md"
              required
            />
            {/* Eye Toggle */}
            <button
              type="button"
              className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-blue-600 transition"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </motion.div>

        {/* === Confirm Password === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <FiCheckCircle className="absolute inset-y-0 left-3 my-auto text-gray-400 text-lg" />
            <input
              type={showCPass ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 outline-none transition-all
              duration-300 shadow-sm hover:shadow-md"
              required
            />
            {/* Eye Toggle */}
            <button
              type="button"
              className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-blue-600 transition"
              onClick={() => setShowCPass(!showCPass)}
            >
              {showCPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </motion.div>

        {/* Checkbox */}
        <motion.div
          className="flex items-start"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded mt-1" required />
          <p className="ml-2 text-sm text-gray-600">
            I agree to the <span className="text-blue-600 font-medium">Terms</span> &{" "}
            <span className="text-blue-600 font-medium">Privacy Policy</span>
          </p>
        </motion.div>

        {/* Button */}
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg 
          font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          Create Account
        </motion.button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <NavLink to="/signIn" className="text-blue-600 hover:text-blue-700 font-medium">
            Login here
          </NavLink>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
