// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { blogService } from "../../Services/BlogService";
// import toast from "react-hot-toast";
// import CustomLoader from "../../Components/CustomLoader";
// import Header from "../Auth/SignIn";

// import {
//     FiCalendar as CalendarDays,
//     FiMessageSquare as MessageSquare,
//     FiHeart as Heart,
//     FiEye as Eye,
//     FiBookOpen as BookOpen,
//     FiUser as UserIcon,
//     FiMail as Mail,
//     FiUser as UserCircle,
//     FiPenTool as PenTool,
//     FiTrendingUp as TrendingUp,
//     FiGrid as Grid,
//     FiList as List,
//     FiClock as Clock,
//     FiChevronRight as ChevronRight,
//     FiSearch as Search,
//     FiFilter as Filter,
//     FiTrendingUp as TrendingUpIcon,
//     FiClock as ClockIcon,
// } from "react-icons/fi";

// import { useDispatch, useSelector } from "react-redux";
// import { setAllBlogs, setCurrentUser } from "../../Redux/Features/Blog/blogSlice";
// import type { RootState } from "../../Redux/store";

// type ViewMode = "grid" | "list";

// export default function HomePage() {
//     const [isLoader, setIsLoader] = useState(false);
//     const [viewMode, setViewMode] = useState<ViewMode>("grid");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

//     const allBlogs = useSelector((state: RootState) => state.blog.allBlogs);
//     const user = useSelector((state: RootState) => state.blog.user);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         getAllBlogs();
//         getUserProfile();
//     }, []);

//     const getAllBlogs = async () => {
//         try {
//             if (allBlogs.length > 0) return;

//             setIsLoader(true);
//             const data = await blogService.fetchAllBlogs();

//             if (!data.error) {
//                 dispatch(setAllBlogs(data.result));
//                 toast.success(data.message);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.log("HomePage Error:", error);
//             toast.error("Something went wrong!");
//         }

//         setIsLoader(false);
//     };

//     const getUserProfile = async () => {
//         try {
//             if (user) return;

//             const data = await blogService.fetchUserProfile();
//             if (!data.error) {
//                 dispatch(setCurrentUser(data.result));
//             }
//         } catch (err) {
//             console.log("Profile Error:", err);
//         }
//     };

//     if (isLoader) return <CustomLoader />;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#e0e7ff]">
//             <Header />

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//                 {/* Title */}
//                 <div className="text-center mb-12">
//                     <h1 className="text-5xl font-extrabold text-gray-900">
//                         Welcome to{" "}
//                         <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
//                             StorySphere
//                         </span>
//                     </h1>
//                     <p className="text-lg text-gray-600 mt-3 max-w-xl mx-auto">
//                         A premium place to read, write and share creativity with the world.
//                     </p>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-10">
//                     {/* USER SIDEBAR */}
//                     {user && (
//                         <div className="lg:w-1/3">
//                             <div className="backdrop-blur-xl bg-white/40 border border-white/50 shadow-2xl rounded-3xl p-6 sticky top-24">
//                                 <div className="text-center">
//                                     {/* Profile Image */}
//                                     <div className="relative w-32 h-32 mx-auto mb-4">
//                                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 shadow-xl">
//                                             <div className="w-full h-full bg-white rounded-full p-1">
//                                                 {user.profile_image ? (
//                                                     <img
//                                                         src={user.profile_image}
//                                                         alt={user.name}
//                                                         className="w-full h-full rounded-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
//                                                         <UserCircle className="w-16 h-16 text-gray-400" />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>

//                                     <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-indigo-100 text-indigo-700 text-sm">
//                                         <TrendingUp className="w-4 h-4 mr-1" /> Member
//                                     </span>

//                                     <div className="mt-6 space-y-4 text-left">
//                                         <div className="flex items-center text-gray-600">
//                                             <Mail className="w-5 h-5 mr-3 text-indigo-600" /> {user.email}
//                                         </div>

//                                         {user.gender && (
//                                             <div className="flex items-center text-gray-600">
//                                                 <UserIcon className="w-5 h-5 mr-3 text-indigo-600" />{" "}
//                                                 {user.gender}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {user.about && (
//                                         <div className="mt-8 pt-6 border-t border-white/40">
//                                             <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
//                                                 <PenTool className="w-4 h-4 mr-2 text-indigo-600" />
//                                                 About Me
//                                             </h3>
//                                             <p className="text-gray-600 text-sm">{user.about}</p>
//                                         </div>
//                                     )}

//                                     <button
//                                         onClick={() => navigate("/profile")}
//                                         className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
//                                     >
//                                         View Full Profile
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* BLOG CONTENT AREA */}
//                     <div className="lg:w-2/3">
//                         {/* Controls */}
//                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
//                             <h2 className="text-3xl font-bold text-gray-900">
//                                 Latest Stories{" "}
//                                 <span className="text-gray-500">({allBlogs.length})</span>
//                             </h2>

//                             <div className="flex items-center gap-4">
//                                 {/* Search */}
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search stories..."
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                         className="pl-10 pr-4 py-2 w-60 rounded-xl border bg-white/60 focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                 </div>

//                                 {/* Sort */}
//                                 <div className="relative">
//                                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                                     <select
//                                         value={sortBy}
//                                         onChange={(e) =>
//                                             setSortBy(e.target.value as "latest" | "popular")
//                                         }
//                                         className="pl-10 pr-10 py-2 rounded-xl border bg-white/60 focus:ring-2 focus:ring-indigo-500"
//                                     >
//                                         <option value="latest">Latest</option>
//                                         <option value="popular">Popular</option>
//                                     </select>
//                                 </div>

//                                 {/* View Toggle */}
//                                 <div className="flex bg-gray-200 p-1 rounded-xl">
//                                     <button
//                                         onClick={() => setViewMode("grid")}
//                                         className={`p-2 rounded-lg ${viewMode === "grid"
//                                             ? "bg-white shadow-md"
//                                             : "text-gray-500"
//                                             }`}
//                                     >
//                                         <Grid className="w-5 h-5" />
//                                     </button>

//                                     <button
//                                         onClick={() => setViewMode("list")}
//                                         className={`p-2 rounded-lg ${viewMode === "list"
//                                             ? "bg-white shadow-md"
//                                             : "text-gray-500"
//                                             }`}
//                                     >
//                                         <List className="w-5 h-5" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* GRID VIEW */}
//                         {viewMode === "grid" && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {allBlogs.map((blog: any) => (
//                                     <div
//                                         key={blog._id}
//                                         onClick={() => navigate(`/blog/${blog._id}`)}
//                                         className="cursor-pointer backdrop-blur-xl bg-white/40 border border-white/50 
//                           rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
//                                     >
//                                         <div className="relative h-48 overflow-hidden">
//                                             <img
//                                                 src={blog.thumbnail}
//                                                 alt={blog.title}
//                                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                                             />
//                                         </div>

//                                         <div className="p-5">
//                                             <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition">
//                                                 {blog.title}
//                                             </h3>

//                                             <p className="text-gray-600 text-sm mt-2 line-clamp-2">
//                                                 {blog.subtitle}
//                                             </p>

//                                             {/* Stats */}
//                                             <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/40">
//                                                 <div className="flex gap-4 text-gray-500">
//                                                     <span className="flex items-center gap-1">
//                                                         <Heart className="text-red-500" /> {blog.likes}
//                                                     </span>

//                                                     <span className="flex items-center gap-1">
//                                                         <MessageSquare className="text-indigo-500" />{" "}
//                                                         {blog.comment.length}
//                                                     </span>
//                                                 </div>

//                                                 <button className="text-indigo-600 font-medium flex items-center">
//                                                     Read <Eye className="ml-1" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {/* LIST VIEW */}
//                         {viewMode === "list" && (
//                             <div className="space-y-6">
//                                 {allBlogs.map((blog) => (
//                                     <div
//                                         key={blog._id}
//                                         onClick={() => navigate(`/blog/${blog._id}`)}
//                                         className="cursor-pointer flex bg-white/50 backdrop-blur-xl border border-white/40 
//                         rounded-2xl p-4 shadow-lg hover:shadow-2xl transition"
//                                     >
//                                         <img
//                                             src={blog.thumbnail}
//                                             alt={blog.title}
//                                             className="w-40 h-32 object-cover rounded-xl"
//                                         />

//                                         <div className="ml-6 flex-1">
//                                             <div className="flex justify-between items-center">
//                                                 <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs">
//                                                     {blog.category}
//                                                 </span>

//                                                 <span className="text-sm text-gray-500 flex items-center">
//                                                     <ClockIcon className="w-4 mr-1" /> {blog.create_at}
//                                                 </span>
//                                             </div>

//                                             <h3 className="text-xl font-semibold text-gray-900 mt-2">
//                                                 {blog.title}
//                                             </h3>

//                                             <p className="text-gray-600 text-sm line-clamp-2 mt-2">
//                                                 {blog.subtitle}
//                                             </p>

//                                             <div className="flex justify-between items-center pt-4 border-t border-white/40 mt-3">
//                                                 <div className="flex gap-6 text-gray-500">
//                                                     <span className="flex items-center gap-1">
//                                                         <Heart className="text-red-500" /> {blog.likes}
//                                                     </span>

//                                                     <span className="flex items-center gap-1">
//                                                         <MessageSquare className="text-indigo-500" />{" "}
//                                                         {blog.comment.length}
//                                                     </span>
//                                                 </div>

//                                                 <button className="flex items-center text-indigo-600 font-medium">
//                                                     Read Article <ChevronRight className="ml-1" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {/* EMPTY STATE */}
//                         {allBlogs.length === 0 && (
//                             <div className="text-center py-16">
//                                 <div className="w-32 h-32 mx-auto bg-white/40 backdrop-blur-xl border border-white/50 rounded-full flex items-center justify-center">
//                                     <BookOpen className="w-16 h-16 text-gray-400" />
//                                 </div>

//                                 <h3 className="text-2xl font-bold mt-6 text-gray-900">
//                                     No Stories Yet
//                                 </h3>

//                                 <p className="text-gray-600 mt-2 max-w-md mx-auto">
//                                     Create your first blog and share your story with the world.
//                                 </p>

//                                 <button
//                                     onClick={() => navigate("/create")}
//                                     className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl 
//                       shadow-lg hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
//                                 >
//                                     <PenTool className="w-5" />
//                                     Create Your First Story
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>

//             {/* FOOTER */}
//             <footer className="py-6 border-t border-gray-300 text-center text-gray-600">
//                 © {new Date().getFullYear()} StorySphere. All rights reserved.
//             </footer>
//         </div>
//     );
// }
import React from 'react'

export default function HomePage() {
    return (
        <div>HomePage</div>
    )
}
