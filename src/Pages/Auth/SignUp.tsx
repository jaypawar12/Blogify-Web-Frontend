import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
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
  // const navigate = useNavigate();

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
  const [error, setError] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authService.getAuthToken()) {
      dispatch(setMode("login"));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, profile_image: file }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------------
  // VALIDATION FUNCTION
  // --------------------------
  const validate = () => {
    const err: Record<string, string> = {};

    if (!formData.user_name.trim()) err.user_name = "Full name is required.";
    if (!formData.user_email.trim()) err.user_email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email))
      err.user_email = "Invalid email format.";

    if (!formData.password.trim()) err.password = "Password is required.";
    else if (formData.password.length < 6)
      err.password = "Password must be at least 6 characters.";

    if (!formData.gender) err.gender = "Please select gender.";
    if (!formData.about.trim()) err.about = "About is required.";

    setError(err);
    return Object.keys(err).length === 0;
  };

  // --------------------------
  // SUBMIT HANDLER
  // --------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix highlighted errors.");
      return;
    }

    setLoader(true);

    const data = await authService.registerUser(formData);


    if (!data.error) {
      toast.success(data.message);
      dispatch(setMode("login"));
    } else {
      toast.error(data.message);
    }

    setLoader(false);
  };

  return (
    <AuthLayout title="Create Your Account">
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center h-auto space-y-4 px-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile */}
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-300 shadow">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="w-full h-full p-6 text-gray-400" />
              )}
            </div>

            <label className="absolute bottom-1 right-1 font-bold bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow hover:scale-110 transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <FiCamera size={16} />
            </label>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Upload your profile picture
          </p>
        </div>

        {/* Full Name */}
        <InputField
          label="Full Name"
          icon={<FiUser />}
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          placeholder="John Doe"
        />
        {error.user_name && (
          <p className="text-red-500 text-xs">{error.user_name}</p>
        )}

        {/* Email */}
        <InputField
          label="Email Address"
          icon={<FiMail />}
          name="user_email"
          type="email"
          value={formData.user_email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        {error.user_email && (
          <p className="text-red-500 text-xs">{error.user_email}</p>
        )}

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm text-gray-800 font-bold">Password</label>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-700" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-700 hover:text-blue-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error.password && (
            <p className="text-red-500 text-xs">{error.password}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-sm text-gray-800 font-bold flex items-center gap-2">
            <FaTransgender /> Gender
          </label>

          <div className="flex gap-6">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  onChange={handleChange}
                  checked={formData.gender === g}
                />
                {g}
              </label>
            ))}
          </div>

          {error.gender && (
            <p className="text-red-500 text-xs">{error.gender}</p>
          )}
        </div>

        {/* About */}
        <div className="space-y-1.5">
          <label className="text-sm text-gray-800 font-bold flex items-center gap-2">
            <FiInfo /> About You
          </label>

          <textarea
            rows={2}
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />

          {error.about && (
            <p className="text-red-500 text-xs">{error.about}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loader}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 shadow hover:opacity-95"
        >
          {loader ? (
            <ButtonLoader message="Creating account..." />
          ) : (
            "Create Account"
          )}
        </motion.button>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => dispatch(setMode("login"))}
            className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

/* INPUT FIELD REUSABLE */
function InputField({ label, icon, ...props }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-1.5"
    >
      <label className="text-sm text-gray-800 font-bold">{label}</label>

      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-700">{icon}</span>

        <input
          {...props}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </motion.div>
  );
}
