import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { authService } from "../Services/AuthService";

import {
    FaPenNib,
    FaUserCircle,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaHome,
    FaBookOpen,
    FaSearch,
} from "react-icons/fa";
import type { RootState } from "../Redux/store";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.blog.user);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* LOGO */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg group-hover:scale-105 transition-transform">
                            <FaPenNib className="text-white text-lg" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                Blogify
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                Share your thoughts
                            </span>
                        </div>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                        >
                            <FaHome className="text-base" />
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/blogs")}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                        >
                            <FaBookOpen className="text-base" />
                            Explore
                        </button>

                        {user ? (
                            <>
                                <button
                                    onClick={() => navigate("/create")}
                                    className="flex items-center gap-2 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    <FaPenNib className="text-sm" />
                                    Create Post
                                </button>

                                {/* PROFILE DROPDOWN */}
                                <div className="relative ml-4">
                                    <div className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all duration-200">
                                        {user.profile_image ? (
                                            <img
                                                src={user.profile_image}
                                                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                                                alt="Profile"
                                            />
                                        ) : (
                                            <div className="p-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                                                <FaUserCircle className="text-2xl text-blue-600" />
                                            </div>
                                        )}
                                        <div className="hidden lg:block pr-2">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {user.user_name?.split(' ')[0]}
                                            </p>
                                            <p className="text-xs text-gray-500">Author</p>
                                        </div>
                                    </div>

                                    {/* DROPDOWN MENU */}
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-800">{user.user_name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.user_email}</p>
                                        </div>

                                        <button
                                            onClick={() => navigate("/profile")}
                                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                                        >
                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                <FaUserCircle className="text-blue-600" />
                                            </div>
                                            <span className="font-medium">My Profile</span>
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                        >
                                            <div className="p-1.5 bg-red-100 rounded-lg">
                                                <FaSignOutAlt className="text-red-500" />
                                            </div>
                                            <span className="font-medium">Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                            >
                                Sign In
                            </button>
                        )}
                    </nav>

                    {/* MOBILE MENU ICON */}
                    <button
                        className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <FaTimes className="text-xl text-gray-700" />
                        ) : (
                            <FaBars className="text-xl text-gray-700" />
                        )}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 shadow-lg rounded-b-2xl">
                        <div className="py-3">
                            <button
                                onClick={() => {
                                    navigate("/");
                                    setMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-6 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <FaHome />
                                <span className="font-medium">Home</span>
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/blogs");
                                    setMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-6 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                <FaBookOpen />
                                <span className="font-medium">Explore Blogs</span>
                            </button>

                            {user && (
                                <>
                                    <button
                                        onClick={() => {
                                            navigate("/create");
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-6 py-3.5 text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <FaPenNib />
                                        <span className="font-medium">Create Post</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-6 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <FaUserCircle />
                                        <span className="font-medium">My Profile</span>
                                    </button>
                                </>
                            )}

                            <div className="border-t border-gray-100 mx-6 my-2"></div>

                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-6 py-3.5 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt />
                                    <span className="font-medium">Log Out</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate("/login");
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-6 py-3.5 text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <FaUserCircle />
                                    <span className="font-medium">Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}