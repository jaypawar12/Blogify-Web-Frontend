import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../../Components/Auth/AuthLayout";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiGithub } from "react-icons/fi";
import { FaGoogle, FaEnvelope } from "react-icons/fa";

import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { routePath } from "../../Routes/routes";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { ErrorAlert } from "../../Components/ErrorAlert";
import type { LoginUserBody } from "../../Types/types";
import { useDispatch } from "react-redux";
import { setMode } from "../../Redux/Features/Auth/authSlice";

export default function SignIn() {
  const dispatch = useDispatch()
  const [showPass, setShowPass] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loginFailed, setLoginFailed] = useState("");
  const [loginData, setLoginData] = useState<LoginUserBody>({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    console.log(loginData);


    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all details...");
      setLoginFailed("Please fill all details...");
      return;
    }

    setLoader(true);
    setLoginFailed("");

    const data = await authService.loginUser(loginData);
    setLoader(false);

    if (!data.error) {
      toast.success(data.message);
      localStorage.setItem("token", data.result.token);
      navigate(routePath.home, { replace: true });
    } else {
      setLoginFailed(data.message);
    }
  };

  return (
    <AuthLayout title="Welcome Back!">
      <motion.form
        onSubmit={onSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {loginFailed && <ErrorAlert message={loginFailed} />}

        {/* === Email === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute inset-y-0 left-3 my-auto text-gray-800 text-lg" />
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-500 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
            <div className="text-red-600">{loginFailed}</div>
          </div>
        </motion.div>

        {/* === Password === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute inset-y-0 left-3 my-auto text-gray-800 text-lg" />

            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 border border-gray-500 rounded-lg
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute inset-y-0 right-3 my-auto text-gray-800 hover:text-blue-600 transition"
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </motion.div>

        {/* === Forgot Password === */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            Remember me
          </label>

          <button
            onClick={() => dispatch(setMode('forgotPassword'))}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            Forgot Password?
          </button>
        </motion.div>

        {/* === Submit Button === */}
        <motion.button
          type="submit"
          disabled={loader}
          onClick={() => navigate(routePath.home)}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold 
          shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]
          disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {loader ? <ButtonLoader message="Signing in..." /> : "Sign In"}
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
            <FaGoogle className="w-5 h-5 text-gray-800" />
            Google
          </motion.button>

          <motion.button
            type="button"
            className="flex items-center justify-center gap-2 py-3 border border-gray-500 rounded-lg 
            hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiGithub className="w-5 h-5 text-gray-800" />
            GitHub
          </motion.button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
