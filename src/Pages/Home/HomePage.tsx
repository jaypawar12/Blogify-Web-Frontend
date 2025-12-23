import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

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
} from "react-icons/fa";
import { MdEmail, MdTrendingUp } from "react-icons/md";
import { BiCategory } from "react-icons/bi";

type ViewMode = "grid" | "list";

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allBlogs, user } = useSelector((state: RootState) => state.blog);

    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        fetchBlogs();
        fetchProfile();
    }, []);

    const fetchBlogs = async () => {
        try {
            if (allBlogs.length) return;
            setLoading(true);
            const res = await blogService.fetchAllBlogs();
            if (!res.error) {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* HERO SECTION */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                        Discover Amazing Stories
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Explore insightful articles, share your thoughts, and connect with passionate writers
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SIDEBAR - CATEGORIES & FILTERS */}
                    <div className="lg:w-1/4 space-y-6">
                        {/* SEARCH */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaSearch className="text-blue-500" />
                                Search Blogs
                            </h3>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title, topic, or author..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* CATEGORIES */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <BiCategory className="text-blue-500" />
                                Categories
                            </h3>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${selectedCategory === category
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="capitalize">
                                            {category === 'all' ? 'All Categories' : category}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <MdTrendingUp />
                                Blog Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-90">Total Blogs</span>
                                    <span className="font-bold text-lg">{allBlogs.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-90">Total Views</span>
                                    <span className="font-bold text-lg">
                                        {allBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-90">Total Likes</span>
                                    <span className="font-bold text-lg">
                                        {allBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <main className="lg:w-3/4">
                        {/* TOP BAR */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Latest Stories
                                    <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {filteredBlogs.length} articles
                                    </span>
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    Fresh perspectives and trending topics
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                                            ? "bg-white shadow-sm text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <FaThLarge className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2.5 rounded-lg transition-all ${viewMode === "list"
                                            ? "bg-white shadow-sm text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        <FaList className="text-lg" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => navigate("/create")}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    <FaPenNib className="text-sm" />
                                    Write Article
                                </button>
                            </div>
                        </div>

                        {/* GRID VIEW */}
                        {viewMode === "grid" && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {filteredBlogs.map((blog) => (
                                    <article
                                        key={blog._id}
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer overflow-hidden"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={blog.thumbnail}
                                                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                alt={blog.title}
                                            />
                                            <div className="absolute top-4 left-4">
                                                {blog.category && (
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-blue-600 rounded-full">
                                                        {blog.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                {blog.author?.profile_image ? (
                                                    <img
                                                        src={blog.author.profile_image}
                                                        className="w-8 h-8 rounded-full border-2 border-white shadow"
                                                        alt={blog.author.user_name}
                                                    />
                                                ) : (
                                                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {blog.author?.user_name || "Anonymous"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FaCalendarAlt />
                                                        {formatDate(blog.create_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {blog.subtitle}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <FaHeart className="text-red-500" />
                                                        {blog.likes || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <FaCommentDots className="text-blue-500" />
                                                        {blog.comment?.length || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <FaEye className="text-gray-500" />
                                                        {blog.views || 0}
                                                    </span>
                                                </div>
                                                <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read more
                                                    <FaArrowRight className="text-xs" />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* LIST VIEW */}
                        {viewMode === "list" && (
                            <div className="space-y-4">
                                {filteredBlogs.map((blog) => (
                                    <article
                                        key={blog._id}
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer p-6"
                                    >
                                        <div className="flex gap-6">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={blog.thumbnail}
                                                    className="w-48 h-36 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                                    alt={blog.title}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            {blog.category && (
                                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                                                                    {blog.category}
                                                                </span>
                                                            )}
                                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                                <FaCalendarAlt />
                                                                {formatDate(blog.create_at)}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                                            {blog.title}
                                                        </h3>
                                                        <p className="text-gray-600 line-clamp-2 mb-4">
                                                            {blog.subtitle}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            {blog.author?.profile_image ? (
                                                                <img
                                                                    src={blog.author.profile_image}
                                                                    className="w-8 h-8 rounded-full border"
                                                                    alt={blog.author.user_name}
                                                                />
                                                            ) : (
                                                                <FaUserCircle className="w-8 h-8 text-gray-400" />
                                                            )}
                                                            <span className="text-sm font-medium text-gray-800">
                                                                {blog.author?.user_name || "Anonymous"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-6 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <FaHeart className="text-red-500" />
                                                                {blog.likes || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <FaCommentDots className="text-blue-500" />
                                                                {blog.comment?.length || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <FaEye className="text-gray-500" />
                                                                {blog.views || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Read article
                                                        <FaArrowRight className="text-xs" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {filteredBlogs.length === 0 && (
                            <div className="text-center py-16">
                                <div className="inline-flex p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-6">
                                    <FaBookReader className="text-6xl text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                    {search || selectedCategory !== 'all'
                                        ? 'No matching articles found'
                                        : 'No articles yet'
                                    }
                                </h2>
                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    {search || selectedCategory !== 'all'
                                        ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                        : 'Be the first to share your thoughts and start the conversation!'
                                    }
                                </p>
                                <button
                                    onClick={() => navigate("/create")}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                                >
                                    <FaPenNib />
                                    Create Your First Article
                                </button>
                            </div>
                        )}

                        {/* PAGINATION (Optional) */}
                        {filteredBlogs.length > 0 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        1
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        2
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* USER PROFILE SIDEBAR */}
            {user && (
                <div className="fixed right-8 bottom-8 z-40">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-72">
                        <div className="flex items-center gap-4 mb-4">
                            {user.profile_image ? (
                                <img
                                    src={user.profile_image}
                                    className="w-14 h-14 rounded-full object-cover border-4 border-white shadow"
                                    alt={user.user_name}
                                />
                            ) : (
                                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                                    <FaUserCircle className="w-10 h-10 text-blue-600" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-gray-800">{user.user_name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MdEmail className="text-xs" />
                                    {user.user_email}
                                </p>
                            </div>
                        </div>

                        {user.about && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.about}</p>
                        )}

                        <button
                            onClick={() => navigate("/profile")}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 py-2.5 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all font-medium"
                        >
                            <FaUserEdit />
                            View Full Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}