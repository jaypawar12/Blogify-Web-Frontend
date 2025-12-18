import { useEffect, useState } from "react";
import AuthLayout from "../../Components/Auth/AuthLayout";
import { motion } from "framer-motion";

import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMail,
  FiCamera,
  FiInfo,
  FiArrowRight,
  FiUpload,
} from "react-icons/fi";
import { FaTransgender } from "react-icons/fa";

import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { ButtonLoader } from "../../Components/ButtonLoader";
import type { RegisterUserBody } from "../../Types/types";
import { useDispatch } from "react-redux";
import { setMode } from "../../Redux/Features/Auth/authSlice";

export default function SignUp() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<RegisterUserBody>({
    user_name: "",
    user_email: "",
    password: "",
    gender: "",
    about: "",
    profile_image: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (authService.getAuthToken()) {
      dispatch(setMode("login"));
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, profile_image: file }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    if (errors.gender) {
      setErrors(prev => ({ ...prev, gender: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_name.trim()) newErrors.user_name = "Full name is required";
    else if (formData.user_name.length < 2) newErrors.user_name = "Name must be at least 2 characters";

    if (!formData.user_email.trim()) newErrors.user_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email))
      newErrors.user_email = "Invalid email format";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/(?=.*[A-Z])/.test(formData.password))
      newErrors.password = "Include at least one uppercase letter";

    if (!formData.gender) newErrors.gender = "Please select your gender";

    if (!formData.about.trim()) newErrors.about = "Tell us about yourself";
    else if (formData.about.length < 10) newErrors.about = "Please write a bit more (min. 10 characters)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please check the form for errors");
      return;
    }

    setLoader(true);

    const data = await authService.registerUser(formData);

    if (!data.error) {
      toast.success("Account created successfully! 🎉");
      setTimeout(() => {
        dispatch(setMode("login"));
      }, 1500);
    } else {
      toast.error(data.message || "Registration failed. Please try again.");
    }

    setLoader(false);
  };

  return (
    <AuthLayout title="Join Our Community">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            <p className="text-gray-600 mt-1">Start your journey with us</p>
          </motion.div>

          {/* Profile Image Upload */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div
              className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? 'scale-105 ring-4 ring-blue-500/30' : ''
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors bg-gradient-to-br from-gray-50 to-gray-100">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FiCamera className="w-10 h-10 mb-2" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                </div>
              </div>

              <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <FiCamera size={18} className="group-hover:rotate-12 transition-transform" />
              </label>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Drag & drop or click to upload
            </p>
          </motion.div>

          {/* Two Column Layout for Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <InputField
              label="Full Name"
              icon={<FiUser className="text-gray-500" />}
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.user_name}
              required
            />

            {/* Email */}
            <InputField
              label="Email Address"
              icon={<FiMail className="text-gray-500" />}
              name="user_email"
              type="email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.user_email}
              required
            />
          </div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <FiLock className="absolute inset-y-0 left-3 my-auto text-gray-500 text-lg transition-colors group-focus-within:text-blue-600" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full pl-10 pr-12 py-3.5 bg-white/50 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm hover:shadow transition-shadow duration-300 backdrop-blur-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 my-auto text-gray-500 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.password}
              </motion.p>
            )}
            <p className="text-xs text-gray-500 mt-1.5 ml-1">
              Must be at least 6 characters with one uppercase letter
            </p>
          </motion.div>

          {/* Gender Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="space-y-3"
          >
            <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1 flex items-center gap-2">
              <FaTransgender className="text-gray-600" /> Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Male", "Female", "Other"].map((gender) => (
                <motion.label
                  key={gender}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.gender === gender
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={() => handleGenderChange(gender)}
                    className="hidden"
                  />
                  <span className="font-medium">{gender}</span>
                </motion.label>
              ))}
            </div>
            {errors.gender && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
              >
                ⚠️ {errors.gender}
              </motion.p>
            )}
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="space-y-3"
          >
            <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1 flex items-center gap-2">
              <FiInfo className="text-gray-600" /> About You
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-tl-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <textarea
                rows={3}
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell us about yourself, your interests, or what brings you here..."
                className={`w-full px-4 py-3.5 bg-white/50 border ${errors.about ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm hover:shadow transition-shadow duration-300 backdrop-blur-sm resize-none`}
              />
            </div>
            <div className="flex justify-between items-center">
              {errors.about && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1"
                >
                  ⚠️ {errors.about}
                </motion.p>
              )}
              <span className={`text-xs ml-auto ${formData.about.length < 10 ? 'text-gray-500' : 'text-green-600'}`}>
                {formData.about.length}/10
              </span>
            </div>
          </motion.div>

          {/* Terms & Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="space-y-4"
          >
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  required
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-gray-400 rounded-md peer-checked:border-blue-600 
                  peer-checked:bg-blue-600 transition-all duration-200 
                  group-hover:border-blue-500 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-700 select-none group-hover:text-gray-900 transition-colors">
                I agree to the <span className="text-blue-600 font-medium">Terms of Service</span> and <span className="text-blue-600 font-medium">Privacy Policy</span>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loader}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                py-4 rounded-xl font-semibold text-base relative overflow-hidden
                shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40
                transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-700 before:to-indigo-700 
                before:opacity-0 hover:before:opacity-100 before:transition-opacity group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loader ? (
                  <ButtonLoader message="Creating account..." />
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          {/* Login Redirect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-center pt-4 border-t border-gray-200"
          >
            <p className="text-gray-700">
              Already have an account?{" "}
              <button
                onClick={() => dispatch(setMode("login"))}
                className="text-blue-600 hover:text-blue-700 font-semibold 
                  transition-colors relative after:absolute after:bottom-0 after:left-0 
                  after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
                type="button"
              >
                Sign in here
              </button>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </AuthLayout>
  );
}

/* Enhanced InputField Component */
function InputField({ label, icon, error, ...props }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5"
    >
      <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="absolute inset-y-0 left-3 my-auto text-gray-500 transition-colors group-focus-within:text-blue-600">
          {icon}
        </div>
        <input
          {...props}
          className={`w-full pl-10 pr-4 py-3.5 bg-white/50 border ${error ? 'border-red-300' : 'border-gray-300'
            } rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm hover:shadow transition-shadow duration-300 backdrop-blur-sm`}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
        >
          ⚠️ {error}
        </motion.p>
      )}
    </motion.div>
  );
}