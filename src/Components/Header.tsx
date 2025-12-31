import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaPenNib,
    FaUserCircle,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaHome,
    FaBookOpen,
    FaSearch,
    FaBell,
    FaCog,
    FaUser,
    FaBookmark,
    FaEdit,
} from "react-icons/fa";
import type { RootState } from "../Redux/store";
import { routePath } from "../Routes/routes";
import { FiEdit } from "react-icons/fi";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = useSelector((state: RootState) => state.blog?.user);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
            setDropdownOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* LOGO */}
                    <motion.div
                        onClick={() => navigate(routePath.home)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative p-2.5 bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-md">
                                <FiEdit className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                                Blogify
                            </span>
                            <p className="text-xs text-gray-500 font-medium">Share your thoughts</p>
                        </div>
                    </motion.div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(routePath.home)}
                            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${isActive("/")
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FaHome className="inline mr-2" />
                            Home
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/blogs")}
                            className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${isActive("/blogs")
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FaBookOpen className="inline mr-2" />
                            Explore
                        </motion.button>

                        {user ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(routePath.addBlog)}
                                    className="ml-2 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                >
                                    <FaPenNib />
                                    <span>Write</span>
                                </motion.button>

                                {/* Search Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/home")}
                                    className="ml-2 p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FaSearch className="text-lg" />
                                </motion.button>

                                {/* Notifications */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="ml-2 p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
                                >
                                    <FaBell className="text-lg" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </motion.button>

                                {/* User Dropdown */}
                                <div className="relative ml-2" ref={dropdownRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {user?.profile_image ? (
                                            <img
                                                src={user.profile_image}
                                                className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm"
                                                alt={user?.user_name || 'User'}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                                <FaUserCircle className="text-white text-xl" />
                                            </div>
                                        )}
                                    </motion.button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                                            >
                                                {/* User Info */}
                                                <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-50 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        {user?.profile_image ? (
                                                            <img
                                                                src={user.profile_image}
                                                                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                                                alt={user?.user_name || 'User'}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                                                <FaUserCircle className="text-white text-2xl" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">{user?.user_name || 'User'}</p>
                                                            <p className="text-sm text-gray-500 truncate">{user?.user_email || ''}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            navigate("/profile");
                                                            setDropdownOpen(false);
                                                        }}
                                                        className="w-full px-5 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FaUser className="text-gray-500" />
                                                        <span className="font-medium">My Profile</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate("/create");
                                                            setDropdownOpen(false);
                                                        }}
                                                        className="w-full px-5 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FaEdit className="text-gray-500" />
                                                        <span className="font-medium">Write Article</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate("/bookmarks");
                                                            setDropdownOpen(false);
                                                        }}
                                                        className="w-full px-5 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FaBookmark className="text-gray-500" />
                                                        <span className="font-medium">Bookmarks</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            navigate("/settings");
                                                            setDropdownOpen(false);
                                                        }}
                                                        className="w-full px-5 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FaCog className="text-gray-500" />
                                                        <span className="font-medium">Settings</span>
                                                    </button>
                                                </div>

                                                {/* Logout */}
                                                <div className="border-t border-gray-200 py-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full px-5 py-3 flex items-center gap-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <FaSignOutAlt />
                                                        <span className="font-medium">Logout</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/login")}
                                className="ml-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Sign In
                            </motion.button>
                        )}
                    </nav>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden border-t border-gray-200 py-4"
                        >
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        navigate("/home");
                                        setMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-lg font-semibold text-left transition-colors ${isActive("/home")
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaHome className="inline mr-3" />
                                    Home
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/blogs");
                                        setMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-lg font-semibold text-left transition-colors ${isActive("/blogs")
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaBookOpen className="inline mr-3" />
                                    Explore
                                </button>
                                {user ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate("/create");
                                                setMenuOpen(false);
                                            }}
                                            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-lg font-semibold text-left"
                                        >
                                            <FaPenNib className="inline mr-3" />
                                            Write Article
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/profile");
                                                setMenuOpen(false);
                                            }}
                                            className="px-4 py-3 rounded-lg font-semibold text-left text-gray-700 hover:bg-gray-100"
                                        >
                                            <FaUser className="inline mr-3" />
                                            My Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-3 rounded-lg font-semibold text-left text-red-600 hover:bg-red-50"
                                        >
                                            <FaSignOutAlt className="inline mr-3" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            navigate("/login");
                                            setMenuOpen(false);
                                        }}
                                        className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-lg font-semibold text-left"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
