import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { blogService } from "../../Services/BlogService";
import { setCurrentUser } from "../../Redux/Features/Blog/blogSlice.ts";
import type { RootState } from "../../Redux/store.ts";

import Header from "../../Components/Header.tsx";
import CustomLoader from "../../Components/CustomLoader";

import {
    FaEdit,
    FaSave,
    FaTimes,
    FaUserCircle,
    FaBook,
    FaHeart,
    FaCommentDots,
    FaEye,
    FaCalendarAlt,
    FaPenNib,
    FaChartLine,
    FaLinkedin,
    FaTwitter,
    FaGithub,
    FaGlobe,
    FaCamera,
    FaShareAlt,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdWork } from "react-icons/md";
import type { Blog } from "../../Types/types.ts";
import { routePath } from "../../Routes/routes.ts";
// import { BiCategory } from "react-icons/bi";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.blog.user);

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("blogs");
    const [userBlogs, setUserBlogs] = useState<Blog>([]);
    const [stats, setStats] = useState({
        totalBlogs: 0,
        totalLikes: 0,
        totalComments: 0,
        totalViews: 0,
    });

    const [formData, setFormData] = useState({
        user_name: "",
        about: "",
        location: "",
        profession: "",
        website: "",
        linkedin: "",
        twitter: "",
        github: "",
    });

    useEffect(() => {
        fetchProfile();
        fetchUserBlogs();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await blogService.fetchUserProfile();
            if (!res.error) {
                dispatch(setCurrentUser(res.result));
            }
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBlogs = async () => {
        try {
            const res = await blogService.fetchAllBlogs();
            if (!res.error) {
                console.log("Blog", res.result);

                setUserBlogs(res.result);
            }
        } catch {
            toast.error("Failed to load your blogs");
        }
    };

    const calculateStats = () => {
        if (!userBlogs.length) return;

        const totalStats = userBlogs.reduce((acc, blog) => ({
            totalBlogs: acc.totalBlogs + 1,
            totalLikes: acc.totalLikes + (blog.likes || 0),
            totalComments: acc.totalComments + (blog.comment?.length || 0),
            totalViews: acc.totalViews + (blog.views || 0),
        }), {
            totalBlogs: 0,
            totalLikes: 0,
            totalComments: 0,
            totalViews: 0,
        });

        setStats(totalStats);
    };

    // const handleSaveProfile = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await blogService.updateUserProfile(formData);
    //         if (!res.error) {
    //             dispatch(setCurrentUser(res.result));
    //             setEditing(false);
    //             toast.success("Profile updated successfully!");
    //         }
    //     } catch {
    //         toast.error("Failed to update profile");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleImageUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     try {
    //         setLoading(true);
    //         const formData = new FormData();
    //         formData.append("profile_image", file);

    //         const res = await blogService.(formData);
    //         if (!res.error) {
    //             dispatch(setCurrentUser(res.result));
    //             toast.success("Profile picture updated!");
    //         }
    //     } catch {
    //         toast.error("Failed to upload image");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        console.log("date", date);

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* PROFILE HEADER */}
                <div className="relative mb-10">
                    {/* COVER PHOTO */}
                    <div className="h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        {/* PROFILE IMAGE */}
                        <div className="absolute bottom-5 left-8 flex items-end gap-6">
                            <div className="relative group">
                                {user?.profile_image ? (
                                    <img
                                        src={user.profile_image}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                                        alt={user.user_name}
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                        <FaUserCircle className="w-24 h-24 text-blue-600" />
                                    </div>
                                )}

                                <label className="absolute bottom-2 right-2 p-3 bg-white rounded-full shadow cursor-pointer hover:bg-gray-50">
                                    <FaCamera className="text-blue-600" />
                                </label>
                            </div>

                            {/* USER INFO */}
                            <div>
                                {editing ? (
                                    <input
                                        value={formData.user_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, user_name: e.target.value })
                                        }
                                        className="text-3xl font-bold bg-transparent border-b border-white text-white focus:outline-none"
                                    />
                                ) : (
                                    <h1 className="text-3xl font-bold text-white">
                                        {user?.user_name || "Anonymous"}
                                    </h1>
                                )}

                                <div className="flex items-center gap-4 mt-2 text-white/90">
                                    <span className="flex items-center gap-2">
                                        <MdEmail />
                                        {user?.user_email}
                                    </span>

                                    {user?.create_at && (
                                        <span className="flex items-center gap-2 text-sm">
                                            <FaCalendarAlt />
                                            Joined {formatDate(user.create_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* EDIT BUTTON */}
                        <div className="absolute top-6 right-6">
                            {editing ? (
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 flex items-center gap-2"
                                >
                                    <FaTimes /> Cancel
                                </button>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-white text-blue-600 rounded-xl hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <FaEdit /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* PROFILE INFO */}
                    <div className="mt-10">
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(routePath.addBlog)}
                                className="mt-1 lg:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <FaPenNib />
                                Write New Blog
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDEBAR */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* ABOUT SECTION */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaUserCircle className="text-blue-500" />
                                About
                            </h3>

                            {editing ? (
                                <textarea
                                    value={formData.about}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-600">
                                    {user?.about || "No bio yet. Tell us about yourself!"}
                                </p>
                            )}
                        </div>

                        {/* PERSONAL INFO */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                {editing ? (
                                    <>
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">Location</label>
                                            <input
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">Profession</label>
                                            <input
                                                value={formData.profession}
                                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Your profession"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {user && (
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <MdLocationOn className="text-blue-500" />
                                                Surat, India
                                            </div>
                                        )}
                                        {user?.about && (
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <MdWork className="text-blue-500" />
                                                <span>{user.about}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Social Links
                            </h3>

                            <div className="space-y-3">
                                {editing ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <FaGlobe className="text-gray-400" />
                                            <input
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Website URL"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaLinkedin className="text-blue-700" />
                                            <input
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="LinkedIn URL"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaTwitter className="text-blue-400" />
                                            <input
                                                value={formData.twitter}
                                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Twitter URL"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaGithub className="text-gray-800" />
                                            <input
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="GitHub URL"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex gap-4">
                                        {/* {user?.website && (
                                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors">
                                                <FaGlobe className="text-gray-600 hover:text-blue-600" />
                                            </a>
                                        )}
                                        {user?.linkedin && (
                                            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors">
                                                <FaLinkedin className="text-gray-600 hover:text-blue-700" />
                                            </a>
                                        )}
                                        {user?.twitter && (
                                            <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors">
                                                <FaTwitter className="text-gray-600 hover:text-blue-400" />
                                            </a>
                                        )}
                                        {user?.github && (
                                            <a href={user.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                                <FaGithub className="text-gray-600 hover:text-gray-800" />
                                            </a>
                                        )}
                                        {!user?.website && !user?.linkedin && !user?.twitter && !user?.github && (
                                            <p className="text-gray-500 text-sm">No social links added</p>
                                        )} */}Hello
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-6 flex items-center gap-2">
                                <FaChartLine />
                                Your Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="text-2xl font-bold">{stats.totalBlogs}</div>
                                    <div className="text-sm opacity-90">Blogs</div>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="text-2xl font-bold">{stats.totalLikes}</div>
                                    <div className="text-sm opacity-90">Likes</div>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="text-2xl font-bold">{stats.totalComments}</div>
                                    <div className="text-sm opacity-90">Comments</div>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="text-2xl font-bold">{stats.totalViews}</div>
                                    <div className="text-sm opacity-90">Views</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2">
                        {/* TABS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab("blogs")}
                                    className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === "blogs"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FaBook />
                                        My Blogs ({userBlogs.length})
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("liked")}
                                    className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === "liked"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FaHeart />
                                        Liked Blogs
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("drafts")}
                                    className={`flex-1 py-4 font-medium text-center transition-colors ${activeTab === "drafts"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FaPenNib />
                                        Drafts
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* BLOG LIST */}
                        <div className="space-y-6">
                            {activeTab === "blogs" && (
                                <>
                                    {userBlogs.length > 0 ? (
                                        userBlogs.map((blog) => (
                                            <div
                                                key={blog}
                                                onClick={() => navigate(`/blog/${blog._id}`)}
                                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer p-6"
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
                                                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${blog.status === 'published'
                                                                        ? 'bg-green-50 text-green-600'
                                                                        : 'bg-yellow-50 text-yellow-600'
                                                                        }`}>
                                                                        {blog.status}
                                                                    </span>
                                                                </div>
                                                                <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                                                    {blog.title}
                                                                </h3>
                                                                <p className="text-gray-600 line-clamp-2 mb-4">
                                                                    {blog.subtitle}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                    <FaEdit className="text-gray-400 hover:text-blue-600" />
                                                                </button>
                                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                    <FaShareAlt className="text-gray-400 hover:text-green-600" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1.5">
                                                                    <FaCalendarAlt />
                                                                    {formatDate(blog.create_at)}
                                                                </span>
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
                                                            <span className="text-blue-600 text-sm font-medium">
                                                                Read →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                No Blogs Yet
                                            </h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                Start sharing your thoughts and experiences with the world
                                            </p>
                                            <button
                                                onClick={() => navigate("/create")}
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                                            >
                                                <FaPenNib />
                                                Create Your First Blog
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === "liked" && (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                    <FaHeart className="text-6xl text-red-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        No Liked Blogs Yet
                                    </h3>
                                    <p className="text-gray-600">
                                        Blogs you like will appear here
                                    </p>
                                </div>
                            )}

                            {activeTab === "drafts" && (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                    <FaPenNib className="text-6xl text-yellow-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        No Drafts
                                    </h3>
                                    <p className="text-gray-600">
                                        Your saved drafts will appear here
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* RECENT ACTIVITY */}
                        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-6">
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FaPenNib className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">You published "Getting Started with React"</p>
                                        <p className="text-sm text-gray-500">2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FaHeart className="text-red-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">You liked "Modern Web Development Trends"</p>
                                        <p className="text-sm text-gray-500">1 week ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FaCommentDots className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">You commented on "TypeScript Best Practices"</p>
                                        <p className="text-sm text-gray-500">2 weeks ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}