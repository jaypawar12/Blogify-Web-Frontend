import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../../Components/Auth/AuthLayout";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiGithub, FiLogIn } from "react-icons/fi";
import { FaGoogle, FaEnvelope } from "react-icons/fa";

import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { routePath } from "../../Routes/routes";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { ErrorAlert } from "../../Components/ErrorAlert";
import type { LoginUserBody } from "../../Types/types";

export default function SignIn() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loginFailed, setLoginFailed] = useState("");
  const [loginData, setLoginData] = useState<LoginUserBody>({
    user_email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!loginData.user_email.trim() || !loginData.password.trim()) {
      const msg = "Please fill all details.";
      setLoginFailed(msg);
      toast.error(msg);
      return;
    }

    setLoader(true);
    setLoginFailed("");
    console.log("Login Data:", loginData);

    const data = await authService.loginUser(loginData);
    console.log("Data:", data);

    setLoader(false);

    if (!data?.error) {
      toast.success(data.message || "Login successful.");

      localStorage.setItem("token", data.result.token);
      navigate(routePath.home, { replace: true });

    } else {
      setLoginFailed(data.message || "Invalid credentials.");
    }
  };

  return (
    <AuthLayout title="Welcome Back!">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.form
          onSubmit={onSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Header with subtle animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600">Sign in to continue to your account</p>
          </motion.div>

          {loginFailed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorAlert message={loginFailed} />
            </motion.div>
          )}

          {/* Email Input with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div
                className="absolute left-0 top-0 h-full w-1 
               bg-gradient-to-b from-blue-500 to-indigo-600
               rounded-l-lg opacity-0 
               group-focus-within:opacity-100 transition-opacity"
              />

              <FaEnvelope
                className="absolute left-3 top-1/2 -translate-y-1/2 
               text-gray-500 text-lg 
               z-10 pointer-events-none group-focus-within:text-blue-600"
              />

              <input
                type="email"
                name="user_email"
                value={loginData.user_email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3.5 bg-white/50 
               border border-gray-300 rounded-lg
               text-gray-800 placeholder-gray-500
               focus:outline-none focus:ring-2 focus:ring-blue-500/30 
               focus:border-blue-500
               shadow-sm hover:shadow transition-shadow duration-300
               backdrop-blur-sm"
              />
            </div>

          </motion.div>

          {/* Password Input with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1">
              Password
            </label>
            <div className="relative group">
              <div
                className="absolute left-0 top-0 h-full w-1 
               bg-gradient-to-b from-blue-500 to-indigo-600
               rounded-l-lg opacity-0 
               group-focus-within:opacity-100 transition-opacity"
              />

              {/* Lock Icon */}
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 
               text-gray-400 text-lg 
               group-focus-within:text-blue-600
               z-10 pointer-events-none transition-colors"
              />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3.5 bg-white/50
               border border-gray-300 rounded-lg
               text-gray-800 placeholder-gray-500
               focus:outline-none focus:ring-2 
               focus:ring-blue-500/30 focus:border-blue-500
               shadow-sm hover:shadow transition-shadow duration-300
               backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2
               text-gray-400 hover:text-blue-600
               z-10 transition-colors
               p-1.5 rounded-md hover:bg-blue-50"
              >
                {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

          </motion.div>

          {/* Options Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-4 h-4 border-2 border-gray-400 rounded-md peer-checked:border-blue-600 
              peer-checked:bg-blue-600 transition-all duration-200 
              group-hover:border-blue-500 flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-700 select-none group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>

            <button
              onClick={() => navigate(routePath.forgotPassword)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium 
            transition-colors relative after:absolute after:bottom-0 after:left-0 
            after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              type="button"
            >
              Forgot Password?
            </button>
          </motion.div>

          {/* Submit Button with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loader}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            py-3.5 rounded-xl font-semibold text-base relative overflow-hidden
            shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40
            transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-700 before:to-indigo-700 
            before:opacity-0 hover:before:opacity-100 before:transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loader ? (
                  <>
                    <ButtonLoader message="Signing in..." />
                  </>
                ) : (
                  <>
                    Sign In
                    <FiLogIn className="w-4 h-4" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </motion.div>

          {/* Social Login Buttons with enhanced styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="grid grid-cols-2 gap-3"
          >
            <motion.button
              type="button"
              className="flex items-center justify-center gap-3 py-3.5 border border-gray-300 rounded-xl
            bg-white hover:bg-gray-50 shadow-sm hover:shadow-md hover:border-gray-400
            transition-all duration-300 group relative overflow-hidden"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FaGoogle className="w-5 h-5 text-gray-700 z-10" />
              <span className="font-medium text-gray-800 z-10">Google</span>
            </motion.button>

            <motion.button
              type="button"
              className="flex items-center justify-center gap-3 py-3.5 border border-gray-300 rounded-xl
            bg-white hover:bg-gray-50 shadow-sm hover:shadow-md hover:border-gray-400
            transition-all duration-300 group relative overflow-hidden"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FiGithub className="w-5 h-5 text-gray-800 z-10" />
              <span className="font-medium text-gray-800 z-10">GitHub</span>
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Sign Up Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="text-center mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-gray-700">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(routePath.register)}
              className="text-blue-600 hover:text-blue-700 font-semibold 
            transition-colors relative after:absolute after:bottom-0 after:left-0 
            after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              type="button"
            >
              Sign up now
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
