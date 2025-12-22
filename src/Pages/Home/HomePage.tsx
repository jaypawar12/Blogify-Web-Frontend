import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { blogService } from "../../Services/BlogService";
import { setAllBlogs, setCurrentUser } from "../../Redux/Features/Blog/blogSlice";
import type { RootState, AppDispatch } from "../../Redux/store";

import CustomLoader from "../../Components/CustomLoader";
import Header from "../Auth/SignIn";

// Icons
import {
    FiMessageSquare,
    FiHeart,
    FiEye,
    FiBookOpen,
    FiUser,
    FiMail,
    FiPenTool,
    FiTrendingUp,
    FiGrid,
    FiList,
    FiChevronRight,
    FiSearch,
    FiFilter,
    FiClock,
} from "react-icons/fi";

type ViewMode = "grid" | "list";

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Redux state
    const allBlogs = useSelector((state: RootState) => state.blog.allBlogs);
    const user = useSelector((state: RootState) => state.blog.user);

    // UI State
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

    // ===================== FETCH DATA =====================
    useEffect(() => {
        fetchBlogs();
        fetchProfile();
    }, []);

    const fetchBlogs = async () => {
        try {
            if (allBlogs.length > 0) return;

            setLoading(true);
            const res = await blogService.fetchAllBlogs();

            if (!res?.error) {
                dispatch(setAllBlogs(res.result));
            } else {
                toast.error(res.message || "Failed to load blogs");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            if (user) return;

            const res = await blogService.fetchUserProfile();
            if (!res?.error) {
                dispatch(setCurrentUser(res.result));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ===================== SEARCH + SORT =====================
    const filteredBlogs = useMemo(() => {
        let blogs = [...allBlogs];

        if (searchQuery) {
            blogs = blogs.filter((b) =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === "latest") {
            blogs.sort(
                (a, b) =>
                    new Date(b.create_at).getTime() -
                    new Date(a.create_at).getTime()
            );
        } else {
            blogs.sort((a, b) => b.likes - a.likes);
        }

        return blogs;
    }, [allBlogs, searchQuery, sortBy]);

    if (loading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#e0e7ff]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-10">
                {/* TITLE */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900">
                        Welcome to{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            StorySphere
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 mt-3">
                        Read, write and share creativity with the world.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* ================= USER SIDEBAR ================= */}
                    {user && (
                        <aside className="lg:w-1/3">
                            <div className="backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl rounded-3xl p-6 sticky top-24">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 overflow-hidden">
                                        {user.profile_image ? (
                                            <img
                                                src={user.profile_image}
                                                alt={user.user_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="w-full h-full p-8 text-gray-400" />
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold mt-4">{user.user_name}</h2>

                                    <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                                        <FiTrendingUp className="mr-1" /> Member
                                    </span>

                                    <div className="mt-6 text-left space-y-3 text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <FiMail /> {user.user_email}
                                        </p>
                                        {user.gender && (
                                            <p className="flex items-center gap-2">
                                                <FiUser /> {user.gender}
                                            </p>
                                        )}
                                    </div>

                                    {user.about && (
                                        <div className="mt-6 pt-4 border-t">
                                            <h3 className="font-semibold mb-1 flex items-center">
                                                <FiPenTool className="mr-2" /> About Me
                                            </h3>
                                            <p className="text-sm text-gray-600">{user.about}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => navigate("/profile")}
                                        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* ================= BLOG SECTION ================= */}
                    <section className="lg:w-2/3">
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                            <h2 className="text-3xl font-bold">
                                Latest Stories{" "}
                                <span className="text-gray-500">({filteredBlogs.length})</span>
                            </h2>

                            <div className="flex items-center gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 rounded-xl border bg-white/60"
                                    />
                                </div>

                                {/* Sort */}
                                <div className="relative">
                                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value as "latest" | "popular")
                                        }
                                        className="pl-10 pr-8 py-2 rounded-xl border bg-white/60"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="popular">Popular</option>
                                    </select>
                                </div>

                                {/* View Toggle */}
                                <div className="flex bg-gray-200 p-1 rounded-xl">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow" : ""
                                            }`}
                                    >
                                        <FiGrid />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white shadow" : ""
                                            }`}
                                    >
                                        <FiList />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ================= GRID VIEW ================= */}
                        {filteredBlogs.length === 0 && (
                            <div className="text-center py-20">
                                <FiBookOpen className="w-16 h-16 mx-auto text-gray-400" />
                                <h3 className="text-2xl font-bold mt-4">No Stories Yet</h3>
                                <p className="text-gray-600 mt-2">
                                    Create your first blog and share your story.
                                </p>
                                <button
                                    onClick={() => navigate("/create")}
                                    className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow"
                                >
                                    Create Story
                                </button>
                            </div>
                        )}

                        {viewMode === "grid" && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredBlogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="cursor-pointer bg-white/50 backdrop-blur-xl border rounded-2xl shadow hover:shadow-2xl transition"
                                    >
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="h-48 w-full object-cover rounded-t-2xl"
                                        />
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg">{blog.title}</h3>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {blog.subtitle}
                                            </p>

                                            <div className="flex justify-between items-center mt-4 text-gray-500">
                                                <div className="flex gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <FiHeart className="text-red-500" /> {blog.likes}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiMessageSquare /> {blog.comment.length}
                                                    </span>
                                                </div>
                                                <FiEye />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ================= LIST VIEW ================= */}
                        {viewMode === "list" && (
                            <div className="space-y-6">
                                {filteredBlogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                        className="flex gap-4 bg-white/50 border rounded-2xl p-4 cursor-pointer hover:shadow-xl"
                                    >
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="w-40 h-28 object-cover rounded-xl"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>{blog.category}</span>
                                                <span className="flex items-center gap-1">
                                                    <FiClock /> {blog.create_at}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold mt-2">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                {blog.subtitle}
                                            </p>
                                            <div className="flex justify-between mt-4 text-gray-500">
                                                <div className="flex gap-6">
                                                    <span className="flex items-center gap-1">
                                                        <FiHeart className="text-red-500" /> {blog.likes}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiMessageSquare /> {blog.comment.length}
                                                    </span>
                                                </div>
                                                <FiChevronRight />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="py-6 text-center text-gray-600 border-t">
                © {new Date().getFullYear()} StorySphere. All rights reserved.
            </footer>
        </div>
    );
}
