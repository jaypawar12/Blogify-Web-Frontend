import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FiArrowLeft, FiShield, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { routePath } from "../../Routes/routes";
import { useDispatch } from "react-redux";
import { setMode } from "../../Redux/Features/Auth/authSlice";

// Alerts
const ErrorAlert = ({ message }: { message: string }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-3">
        <strong className="font-bold">Oops! </strong>
        <span>{message}</span>
    </div>
);

export default function OTPVerification() {
    const dispatch = useDispatch()
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");

    const [timer, setTimer] = useState(20);
    const [email, setEmail] = useState("");

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    // === Validate state email ===
    useEffect(() => {
        if (!location.state?.email) {
            navigate(routePath.login, { replace: true });
            return;
        }
        setEmail(location.state.email);
    }, []);

    // === Timer start ===
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // Format timer
    const formatTimer = () => {
        const m = Math.floor(timer / 60);
        const s = timer % 60;
        return `0${m}:${s < 10 ? "0" : ""}${s}`;
    };

    // === OTP Input Handlers ===
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(data)) return;

        const digits = data.split("");
        const newOtp = [...otp];

        digits.forEach((d, idx) => {
            if (idx < 6) newOtp[idx] = d;
        });

        setOtp(newOtp);

        const nextIndex = digits.length < 6 ? digits.length : 5;
        inputRefs.current[nextIndex]?.focus();
    };

    // === Submit OTP ===
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join("");

        if (otpString.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setLoader(true);

        try {
            const data = await authService.verifyOtp({ email, otp: otpString });

            if (!data.error) {
                toast.success(data.message);

                navigate(routePath.resetPassword, {
                    replace: true,
                    state: { email },
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        }

        setLoader(false);
    };

    // === Resend OTP ===
    const handleResend = async () => {
        try {
            setLoader(true);

            const res = await authService.forgotPassword({ email });

            if (!res.error) {
                toast.success("OTP resent successfully!");
                setTimer(20);
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Failed to resend OTP.");
        }

        setLoader(false);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* Left Section */}
            <div
                className="md:w-1/2 relative flex flex-col justify-center items-center text-white p-10 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DCpurMwMraLTEgM-6it5U2B0BqNIXKOkrQ&s')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/65 to-gray-900/80 backdrop-blur-sm" />

                <div className="relative z-10 text-center max-w-md font-bold">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl mb-6"
                    >
                        Verify OTP
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-blue-100 text-lg"
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
                        <p className="text-gray-600 text-center mb-4 text-sm">
                            Please enter the 6-digit code sent to your email
                        </p>

                        {/* Error Alert */}
                        {error && <ErrorAlert message={error} />}

                        {/* OTP Input */}
                        <div className="flex justify-center gap-3 mb-8">
                            {otp.map((digit, i) => (
                                <motion.input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    type="text"
                                    maxLength={1}
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={i === 0 ? handlePaste : undefined}
                                    className="w-14 h-14 text-center text-xl font-bold rounded-xl 
                             border-2 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 
                             outline-none shadow-sm"
                                    whileFocus={{ scale: 1.12 }}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <motion.button
                            onClick={handleSubmit}
                            disabled={loader}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-3.5 rounded-xl font-semibold text-white 
                         bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                         hover:to-indigo-700 shadow-lg disabled:opacity-60"
                        >
                            {loader ? <ButtonLoader message="Verifying..." /> : "Verify & Continue"}
                        </motion.button>

                        {/* Resend OTP */}
                        <div className="text-center mt-5">
                            {timer === 0 ? (
                                <button
                                    onClick={handleResend}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-gray-600 text-sm">{formatTimer()}</p>
                            )}
                        </div>

                        {/* Back to Login */}
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
