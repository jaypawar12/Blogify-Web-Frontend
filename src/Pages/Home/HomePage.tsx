import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { blogService } from "../../Services/BlogService";
import { setAllBlogs, setCurrentUser } from "../../Redux/Features/Blog/blogSlice.ts";
import type { RootState } from "../../Redux/store.ts";

import Header from "../../Components/Header.tsx";
import CustomLoader from "../../Components/CustomLoader";

import {
    FaHeart,
    FaCommentDots,
    FaEye,
    FaSearch,
    FaThLarge,
    FaList,
    FaUserCircle,
    FaPenNib,
    FaBookReader,
    FaCalendarAlt,
    FaUserEdit,
    FaArrowRight,
    FaFire,
    FaStar,
    FaBookmark,
    FaShare,
} from "react-icons/fa";
import { MdEmail, MdTrendingUp, MdFilterList, MdTrendingFlat } from "react-icons/md";
import { BiCategory, BiTimeFive } from "react-icons/bi";

type ViewMode = "grid" | "list";

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const allBlogs = useSelector((state: RootState) => state.blog.allBlogs);
    const user = useSelector((state: RootState) => state.blog.user);

    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        } else {
            navigate("/login");
        }
        fetchBlogs();
        fetchProfile();
    }, []);

    const fetchBlogs = async () => {
        try {
            if (allBlogs.length) return;
            setLoading(true);
            const res = await blogService.fetchAllBlogs();
            if (!res.error) {
                // Debug: Check author data
                if (res.result && res.result.length > 0) {
                    console.log("First blog from API:", res.result[0]);
                    console.log("Author data:", res.result[0].author);
                }
                dispatch(setAllBlogs(res.result));
            }
        } catch {
            toast.error("Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            if (user) return;
            const res = await blogService.fetchUserProfile();
            console.log("user", res);

            if (!res.error) {
                dispatch(setCurrentUser(res.result));
            }
        } catch {
            toast.error("Failed to load profile");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content?.split(/\s+/).length || 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    // Get featured/trending blogs (top 3 by likes or views)
    const featuredBlogs = [...allBlogs]
        .sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)))
        .slice(0, 3);

    const filteredBlogs = allBlogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.subtitle.toLowerCase().includes(search.toLowerCase()) ||
            blog.content?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Extract unique categories
    const categories = ["all", ...new Set(allBlogs.map(blog => blog.category).filter(Boolean))];

    if (loading) return <CustomLoader />;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold mb-8 shadow-lg"
                        >
                            <FaFire className="text-orange-400 animate-pulse" />
                            <span>Discover Trending Stories</span>
                            <MdTrendingFlat className="text-lg" />
                        </motion.div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                            <span className="block">Explore</span>
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Amazing Stories
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                            Dive into insightful articles, share your thoughts, and connect with passionate writers from around the world
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="p-2 bg-blue-500/30 rounded-lg">
                                    <FaBookReader className="text-2xl" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold">{allBlogs.length}+</div>
                                    <div className="text-sm opacity-80">Articles</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="p-2 bg-yellow-500/30 rounded-lg">
                                    <FaStar className="text-2xl text-yellow-300" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold">Premium</div>
                                    <div className="text-sm opacity-80">Content</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="p-2 bg-purple-500/30 rounded-lg">
                                    <FaUserCircle className="text-2xl" />
                                </div>
                                <div className="text-left">
                                    <div className="text-2xl font-bold">Expert</div>
                                    <div className="text-sm opacity-80">Writers</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured/Trending Blogs Section */}
            {featuredBlogs.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <FaFire className="text-white text-lg" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                            </div>
                            <p className="text-gray-600">Most popular articles this week</p>
                        </div>

                        {/* Blog Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {featuredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="relative h-96 rounded-xl overflow-hidden cursor-pointer"
                                    >
                                        {/* Background Image */}
                                        <img
                                            src={blog.thumbnail}
                                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            alt={blog.title}
                                        />

                                        {/* Dark Overlay that appears on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300"></div>

                                        {/* Default Content (Always Visible) */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                            {/* Top - Trending Badge */}
                                            <div className="flex items-start justify-between">
                                                <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                                                    #{index + 1} Trending
                                                </span>
                                                {blog.category && (
                                                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full">
                                                        {blog.category}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Middle - Title (Always Visible) */}
                                            <div>
                                                <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">

                                                </h3>
                                            </div>

                                            {/* Bottom - Default Stats */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1 text-white text-sm">
                                                        {blog.title}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Content - Hidden by default */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

                                            {/* Hover Content Container */}
                                            <div className="relative h-full p-6 flex flex-col justify-end">
                                                {/* Author Info - Appears on hover */}
                                                <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="relative">
                                                            {blog.author?.profile_image ? (
                                                                <img
                                                                    src={blog.author.profile_image}
                                                                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                                                                    alt={blog.author.user_name}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                                                                    <FaUserCircle className="text-white" />
                                                                </div>
                                                            )}
                                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-bold text-sm">
                                                                {blog.author?.user_name || "Anonymous"}
                                                            </h4>
                                                            <p className="text-white/80 text-xs flex items-center gap-1">
                                                                <BiTimeFive /> {calculateReadingTime(blog.content)} min read
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Subtitle - Appears on hover */}
                                                <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                    <p className="text-white/90 text-sm line-clamp-2">
                                                        {blog.title}
                                                    </p>
                                                </div>

                                                {/* Stats - Enhanced on hover */}
                                                <div className="flex items-center justify-between pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-center">
                                                            <div className="text-white font-bold text-lg">{blog.likes || 0}</div>
                                                            <div className="text-white/80 text-xs">Likes</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-white font-bold text-lg">{blog.comment?.length || 0}</div>
                                                            <div className="text-white/80 text-xs">Comments</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-white font-bold text-lg">{blog.views || 0}</div>
                                                            <div className="text-white/80 text-xs">Views</div>
                                                        </div>
                                                    </div>

                                                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
                                                        Read Full
                                                        <FaArrowRight />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SIDEBAR - CATEGORIES & FILTERS */}
                    <aside className="lg:w-1/4 space-y-6">
                        {/* SEARCH */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                        >
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-gray-400 text-sm"
                                />
                            </div>
                        </motion.div>

                        {/* CATEGORIES */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                        >
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                                <BiCategory className="text-blue-600 text-lg" />
                                Categories
                            </h3>
                            <div className="space-y-1.5">
                                {categories.map((category, index) => (
                                    <motion.button
                                        key={category}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.03 }}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${selectedCategory === category
                                            ? 'bg-blue-600 text-white font-semibold shadow-md'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="capitalize flex items-center justify-between">
                                            {category === 'all' ? 'All Categories' : category}
                                            {selectedCategory === category && (
                                                <FaArrowRight className="text-xs" />
                                            )}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* STATS */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-base">
                                    <MdTrendingUp className="text-xl" />
                                    Statistics
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <span className="text-xs font-medium opacity-90">Blogs</span>
                                        <span className="font-bold text-lg">{allBlogs.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <span className="text-xs font-medium opacity-90">Views</span>
                                        <span className="font-bold text-lg">
                                            {allBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <span className="text-xs font-medium opacity-90">Likes</span>
                                        <span className="font-bold text-lg">
                                            {allBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="lg:w-3/4">
                        {/* TOP BAR */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
                        >
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Latest Stories
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">
                                        {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <MdFilterList className="text-blue-500" />
                                        Fresh perspectives
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2.5 rounded-md transition-all duration-200 ${viewMode === "grid"
                                            ? "bg-white shadow-sm text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <FaThLarge className="text-base" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2.5 rounded-md transition-all duration-200 ${viewMode === "list"
                                            ? "bg-white shadow-sm text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <FaList className="text-base" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* GRID VIEW */}
                        {viewMode === "grid" && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                            >
                                {filteredBlogs.map((blog) => (
                                    <motion.article
                                        key={blog._id}
                                        variants={itemVariants}
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
                                    >
                                        {/* Image Section */}
                                        <div className="relative overflow-hidden h-64">
                                            <img
                                                src={blog.thumbnail}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={blog.title}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Category Badge */}
                                            {blog.category && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-lg shadow-lg">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors">
                                                    <FaBookmark className="text-gray-700 text-sm" />
                                                </button>
                                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors">
                                                    <FaShare className="text-gray-700 text-sm" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6">
                                            {/* Author & Date */}
                                            <div className="flex items-center gap-3 mb-4">
                                                {blog.author?.profile_image ? (
                                                    <img
                                                        src={blog.author.profile_image}
                                                        className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm ring-2 ring-blue-50"
                                                        alt={blog.author.user_name}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                                        <FaUserCircle className="text-white text-lg" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {blog.author?.user_name || "Anonymous"}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <FaCalendarAlt className="text-blue-500" />
                                                        <span>{formatDate(blog.create_at)}</span>
                                                        <span>•</span>
                                                        <BiTimeFive className="text-purple-500" />
                                                        <span>{calculateReadingTime(blog.content)} min</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                                                {blog.title}
                                            </h3>

                                            {/* Subtitle */}
                                            <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                                                {blog.subtitle}
                                            </p>

                                            {/* Tags */}
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {blog.tags.slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Stats Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4 text-xs">
                                                    <span className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors">
                                                        <FaHeart className="text-red-500" />
                                                        <span className="font-semibold">{blog.likes || 0}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                                                        <FaCommentDots className="text-blue-500" />
                                                        <span className="font-semibold">{blog.comment?.length || 0}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-gray-600">
                                                        <FaEye className="text-gray-500" />
                                                        <span className="font-semibold">{blog.views || 0}</span>
                                                    </span>
                                                </div>
                                                <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read
                                                    <FaArrowRight className="text-xs" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </motion.div>
                        )}

                        {/* LIST VIEW */}
                        {viewMode === "list" && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                {filteredBlogs.map((blog) => (
                                    <motion.article
                                        key={blog._id}
                                        variants={itemVariants}
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-500 cursor-pointer p-6 transform hover:-translate-y-0.5"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Image */}
                                            <div className="lg:w-80 flex-shrink-0">
                                                <div className="relative overflow-hidden rounded-lg h-56 lg:h-full">
                                                    <img
                                                        src={blog.thumbnail}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        alt={blog.title}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    {blog.category && (
                                                        <div className="absolute top-4 left-4">
                                                            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-lg shadow-lg">
                                                                {blog.category}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    {/* Author & Meta */}
                                                    <div className="flex items-center gap-3 mb-4">
                                                        {blog.author?.profile_image ? (
                                                            <img
                                                                src={blog.author.profile_image}
                                                                className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm"
                                                                alt={blog.author.user_name}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                                <FaUserCircle className="text-white text-lg" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {blog.author?.user_name || "Anonymous"}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <FaCalendarAlt className="text-blue-500" />
                                                                <span>{formatDate(blog.create_at)}</span>
                                                                <span>•</span>
                                                                <BiTimeFive className="text-purple-500" />
                                                                <span>{calculateReadingTime(blog.content)} min read</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
                                                        {blog.title}
                                                    </h3>

                                                    {/* Subtitle */}
                                                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                                                        {blog.subtitle}
                                                    </p>

                                                    {/* Tags */}
                                                    {blog.tags && blog.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {blog.tags.slice(0, 3).map((tag, idx) => (
                                                                <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors">
                                                                <FaHeart className="text-red-500" />
                                                                <span className="font-semibold">{blog.likes || 0}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                                                                <FaCommentDots className="text-blue-500" />
                                                                <span className="font-semibold">{blog.comment?.length || 0}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-gray-600">
                                                                <FaEye className="text-gray-500" />
                                                                <span className="font-semibold">{blog.views || 0}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm px-4 py-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 group-hover:gap-3 transition-all">
                                                        Read article
                                                        <FaArrowRight className="text-xs" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </motion.div>
                        )}

                        {/* EMPTY STATE */}
                        {filteredBlogs.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-20"
                            >
                                <div className="inline-flex p-8 bg-gradient-to-br from-blue-100 via-blue-100 to-purple-100 rounded-3xl mb-8 shadow-lg">
                                    <FaBookReader className="text-7xl text-blue-500" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                                    {search || selectedCategory !== 'all'
                                        ? 'No matching articles found'
                                        : 'No articles yet'
                                    }
                                </h2>
                                <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg">
                                    {search || selectedCategory !== 'all'
                                        ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                        : 'Be the first to share your thoughts and start the conversation!'
                                    }
                                </p>
                                <button
                                    onClick={() => navigate("/create")}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold text-lg transform hover:scale-105"
                                >
                                    <FaPenNib />
                                    Create Your First Article
                                </button>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>

            {/* USER PROFILE SIDEBAR */}
            {user && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="fixed right-6 bottom-6 z-40 hidden lg:block"
                >
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-6 w-80 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                            {user?.profile_image ? (
                                <div className="relative">
                                    <img
                                        src={user.profile_image}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-blue-100"
                                        alt={user?.user_name || 'User'}
                                    />
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                                </div>
                            ) : (
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
                                    <FaUserCircle className="w-10 h-10 text-white" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{user?.user_name || 'User'}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                    <MdEmail className="text-blue-500" />
                                    <span className="truncate">{user?.user_email || ''}</span>
                                </p>
                            </div>
                        </div>

                        {user?.about && (
                            <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {user.about}
                            </p>
                        )}

                        <button
                            onClick={() => navigate("/profile")}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            <FaUserEdit />
                            View Full Profile
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}