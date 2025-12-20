import { FiArrowLeft, FiLock, FiEdit, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { setMode } from "../../Redux/Features/Auth/authSlice";
import { authService } from "../../Services/AuthService";
import { routePath } from "../../Routes/routes";
import type { ChangePasswordPayload } from "../../Types/types";

export default function ResetPassword() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const email = useSelector((state: any) => state.auth.email)

    const [showPass, setShowPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    console.log("Email:", email);

    if (authService.getAuthToken()) {
        return navigate(routePath.home, { replace: true });;
    }
    if (!email) {
        dispatch(setMode("forgotPassword"));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async () => {

        if (!formData.newPassword || !formData.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New and Confirm password do not match");
            return;
        }

        try {
            setLoader(true);
            setError("");

            const payload: ChangePasswordPayload = {
                user_email: email,
                newPassword: formData.newPassword
            };

            const data = await authService.changePassword(payload);

            if (!data.error) {
                toast.success(data.message);
                dispatch(setMode("login"));
            } else {
                setError(data.message);
            }

        } catch (err: any) {
            console.log("Error:", err.message);

            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoader(false);
        }
    };

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
                        className="text-4xl font-extrabold mb-4"
                    >
                        Change Password
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg font-light"
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
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <FiEdit className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-800">Blogify</h2>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-2xl shadow-xl border p-8">

                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiLock className="text-white w-7 h-7" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center mb-2">
                            Create New Password
                        </h2>

                        <p className="text-gray-500 text-center text-sm mb-6">
                            Make sure your password is strong and secure.
                        </p>

                        {error && (
                            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                        )}

                        {/* NEW PASSWORD */}
                        <label className="text-sm font-medium">New Password</label>
                        <div className="relative mb-4 mt-1">
                            <FiLock className="absolute left-4 top-4 text-gray-700" />
                            <input
                                type={showPass ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-3 border rounded-xl"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-4"
                            >
                                {showPass ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative mb-6 mt-1">
                            <FiLock className="absolute left-4 top-4 text-gray-700" />
                            <input
                                type={showCPass ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-3 border rounded-xl"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCPass(!showCPass)}
                                className="absolute right-4 top-4"
                            >
                                {showCPass ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        {/* BUTTON */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={loader}
                            onClick={onSubmit}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl"
                        >
                            {loader ? "Updating..." : "Reset Password"}
                        </motion.button>

                        {/* BACK */}
                        <div className="text-center pt-4">
                            <button
                                onClick={() => dispatch(setMode("login"))}
                                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
                            >
                                <FiArrowLeft className="mr-2" />
                                Back to Login
                            </button>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
