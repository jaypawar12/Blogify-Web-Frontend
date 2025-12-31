import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { blogService } from '../../Services/BlogService';
import toast from 'react-hot-toast';
import type { Blog } from '../../Types/types';
import {
    FaCalendarAlt,
    FaClock,
    FaEye,
    FaHeart,
    FaShareAlt,
    FaBookmark,
    FaComment,
    FaUserCircle,
    FaTag,
    FaArrowLeft,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaWhatsapp,
    FaCopy,
    FaRocket,
    FaNewspaper,
    FaPenNib,
    FaBookReader,
} from 'react-icons/fa';
import {
    BiTimeFive,
    BiCategory,
    BiLike,
    BiDislike
} from 'react-icons/bi';
import {
    MdTrendingUp,
    MdFilterList
} from 'react-icons/md';

const SingleBlogPage = () => {
    const navigate = useNavigate();
    const { blogId } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [activeTab, setActiveTab] = useState<'comments' | 'related'>('comments');

    useEffect(() => {
        getBlog();
    }, [blogId]);

    const getBlog = async () => {
        try {
            setLoading(true);
            const data = await blogService.fetchSinglBlog(blogId || "");

            if (!data.error) {
                setBlog(data.result);
                setComments(data.result.comment || []);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("Fetch Single Blog: ", err);
            toast.error("Something went wrong !!");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // API call for like
        // await blogService.likeBlog(blogId);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // API call for bookmark
        // await blogService.bookmarkBlog(blogId);
    };

    const handleShare = async (platform?: string) => {
        if (platform) {
            const url = window.location.href;
            const title = blog?.title;

            switch (platform) {
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || '')}`, '_blank');
                    break;
                case 'linkedin':
                    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}`, '_blank');
                    break;
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${encodeURIComponent((title || '') + ' ' + url)}`, '_blank');
                    break;
                case 'copy':
                    navigator.clipboard.writeText(url);
                    toast.success('Link copied to clipboard!');
                    break;
            }
            setShowShareOptions(false);
        } else {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: blog?.title,
                        text: blog?.subtitle,
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        }
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // API call to submit comment
        // await blogService.addComment(blogId, newComment);
        const newCommentObj = {
            id: comments.length + 1,
            userId: {
                name: "You",
                profile_image: "",
            },
            create_at: "Just now",
            msg: newComment,
        };
        setComments([...comments, newCommentObj]);
        setNewComment("");
        toast.success('Comment posted successfully!');
    };

    const formatDate = (dateString: string) => {
        try {
            // Handle different date formats
            const date = dateString.includes(',') ? dateString.split(',')[0] : dateString;
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="animate-pulse space-y-8 w-full max-w-6xl">
                    <div className="h-[400px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl"></div>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaBookReader className="text-gray-400 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Blog Not Found</h2>
                    <p className="text-gray-500 text-lg">The article you're looking for has been moved or doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all inline-flex items-center gap-2"
                    >
                        Browse Articles
                        <FaArrowLeft className="rotate-180" />
                    </button>
                </div>
            </div>
        );
    }

    const readingTime = calculateReadingTime(blog.content);
    const relatedBlogs = [
        {
            _id: "2",
            title: "Mastering React Hooks in 2024",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            category: blog.category,
            reading_time: 6,
            views: 1200
        },
        {
            _id: "3",
            title: "Building Scalable Backends with Node.js",
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            category: "Backend",
            reading_time: 10,
            views: 890
        },
        {
            _id: "4",
            title: "CSS Grid vs Flexbox: When to Use Which",
            thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            category: "CSS",
            reading_time: 5,
            views: 1560
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Back Button */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Articles
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    {/* Category */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {blog.category}
                        </span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            >
                                <FaShareAlt />
                            </button>
                            <button
                                onClick={handleBookmark}
                                className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'}`}
                            >
                                <FaBookmark />
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {blog.subtitle}
                    </p>

                    {/* Author & Meta Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={blog.author?.profile_image || "https://randomuser.me/api/portraits/men/22.jpg"}
                                    alt={blog.author?.user_name || "Anonymous"}
                                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                                />
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{blog.author?.user_name || "Anonymous"}</h3>
                                <p className="text-gray-600 text-sm">{blog.author?.bio || "Writer"}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaCalendarAlt />
                                <span className="text-sm font-medium">{formatDate(blog.create_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <BiTimeFive />
                                <span className="text-sm font-medium">{readingTime} min read</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaEye />
                                <span className="text-sm font-medium">{blog.views?.toLocaleString() || "0"} views</span>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12 rounded-2xl overflow-hidden shadow-xl"
                >
                    <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-[500px] object-cover"
                    />
                </motion.div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {blog.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    <FaTag className="text-xs" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Stats Bar */}
                        <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{blog.likes || 0}</div>
                                    <div className="text-sm text-gray-600">Likes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{blog.comment?.length || 0}</div>
                                    <div className="text-sm text-gray-600">Comments</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{blog.views?.toLocaleString() || "0"}</div>
                                    <div className="text-sm text-gray-600">Views</div>
                                </div>
                            </div>
                            <MdTrendingUp className="text-blue-600 text-2xl" />
                        </div>

                        {/* Article Content */}
                        <motion.article
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="prose prose-lg max-w-none bg-white rounded-2xl p-8 shadow-lg mb-8"
                        >
                            <div
                                className="text-gray-800 leading-relaxed text-lg"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </motion.article>

                        {/* Actions Bar */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between relative">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {isLiked ? <BiLike className="text-xl" /> : <FaHeart />}
                                        <span className="font-semibold">{isLiked ? (blog.likes || 0) + 1 : blog.likes || 0}</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                                        <FaComment />
                                        <span className="font-semibold">{blog.comment?.length || 0}</span>
                                    </button>
                                </div>

                                {/* Share Options */}
                                {showShareOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4"
                                    >
                                        <div className="grid grid-cols-5 gap-3">
                                            <button onClick={() => handleShare('facebook')} className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                                <FaFacebook className="text-xl" />
                                            </button>
                                            <button onClick={() => handleShare('twitter')} className="p-3 bg-blue-100 text-blue-500 rounded-lg hover:bg-blue-200 transition-colors">
                                                <FaTwitter className="text-xl" />
                                            </button>
                                            <button onClick={() => handleShare('linkedin')} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                <FaLinkedin className="text-xl" />
                                            </button>
                                            <button onClick={() => handleShare('whatsapp')} className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                                <FaWhatsapp className="text-xl" />
                                            </button>
                                            <button onClick={() => handleShare('copy')} className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                                <FaCopy className="text-xl" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Interaction Tabs */}
                        <div className="mt-16">
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`flex items-center gap-3 px-6 py-4 text-lg font-medium border-b-2 transition-all ${activeTab === 'comments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FaComment size={22} />
                                    Comments ({blog.comment?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('related')}
                                    className={`flex items-center gap-3 px-6 py-4 text-lg font-medium border-b-2 transition-all ${activeTab === 'related' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FaNewspaper size={22} />
                                    Related Articles
                                </button>
                            </div>

                            {/* Comments Tab Content */}
                            {activeTab === 'comments' && (
                                <div className="pt-8">
                                    {/* Add Comment Form */}
                                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 mb-10 border border-blue-100">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Join the conversation</h3>
                                        <form onSubmit={handleSubmitComment} className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                                                        <FaUserCircle size={28} className="text-gray-600" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        className="w-full h-32 p-5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400"
                                                        placeholder="What are your thoughts on this article? Share your insights..."
                                                        maxLength={500}
                                                    />
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="text-sm text-gray-500">
                                                            {newComment.length}/500 characters
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={!newComment.trim()}
                                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            <FaShareAlt size={18} />
                                                            Post Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Comments List */}
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-bold text-gray-900">
                                                All Comments ({blog.comment?.length || 0})
                                            </h4>
                                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white">
                                                <option>Sort by: Newest</option>
                                                <option>Sort by: Most Liked</option>
                                            </select>
                                        </div>

                                        {comments.length > 0 ? (
                                            comments.map((com, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="relative">
                                                                <img
                                                                    src={com.userId?.profile_image}
                                                                    alt={com.userId?.name || "User"}
                                                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                                                />
                                                                {index === 0 && (
                                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.117c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h5 className="font-bold text-gray-900">{com.userId?.name || "User"}</h5>
                                                                        {index === 0 && (
                                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                                                Author
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-sm text-gray-500">
                                                                        {com.create_at}
                                                                    </span>
                                                                </div>
                                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                                    <MdFilterList size={18} className="text-gray-400" />
                                                                </button>
                                                            </div>
                                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                                {com.msg}
                                                            </p>
                                                            <div className="flex items-center gap-4">
                                                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                                                                    <BiLike size={18} />
                                                                    <span className="text-sm">12</span>
                                                                </button>
                                                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors">
                                                                    <FaHeart size={18} />
                                                                    <span className="text-sm">5</span>
                                                                </button>
                                                                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                                    Reply
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <FaComment size={32} className="text-gray-400" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-700 mb-3">No comments yet</h3>
                                                <p className="text-gray-500 text-lg mb-8">Be the first to share your thoughts!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Related Articles Tab Content */}
                            {activeTab === 'related' && (
                                <div className="pt-8">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {relatedBlogs.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => navigate(`/blog/${item._id}`)}
                                                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-gray-200"
                                            >
                                                <div className="h-48 relative overflow-hidden">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 rounded-full text-sm font-medium">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                        <FaClock size={14} />
                                                        {item.reading_time} min read
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                                            <span className="text-sm text-gray-600">Author</span>
                                                        </div>
                                                        <FaRocket size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Author Card */}
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                                <h3 className="font-bold text-gray-900 text-lg mb-4">About the Author</h3>
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={blog.author?.profile_image || "https://randomuser.me/api/portraits/men/22.jpg"}
                                        alt={blog.author?.user_name || "Anonymous"}
                                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4"
                                    />
                                    <h4 className="font-bold text-gray-900 text-xl">{blog.author?.user_name || "Anonymous"}</h4>
                                    <p className="text-gray-600 text-sm mt-2 mb-4">{blog.author?.bio || "Writer"}</p>
                                    <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                        Follow
                                    </button>
                                </div>
                            </div>

                            {/* Related Articles */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 text-lg mb-6">Related Articles</h3>
                                <div className="space-y-6">
                                    {relatedBlogs.map((related) => (
                                        <div
                                            key={related._id}
                                            onClick={() => navigate(`/blog/${related._id}`)}
                                            className="group cursor-pointer"
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                                    <img
                                                        src={related.thumbnail}
                                                        alt={related.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {related.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                            {related.category}
                                                        </span>
                                                        <span>{related.reading_time} min</span>
                                                        <span>•</span>
                                                        <span>{related.views.toLocaleString()} views</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Table of Contents */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-6 mt-8">
                                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                    <BiCategory />
                                    Table of Contents
                                </h3>
                                <nav className="space-y-2">
                                    {['Introduction', 'Artificial Intelligence Integration', 'Web3 and Decentralized Applications',
                                        'Progressive Web Apps', 'Serverless Architecture', 'WebAssembly', 'Conclusion'].map((item, index) => (
                                            <a
                                                key={index}
                                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-colors"
                                            >
                                                {item}
                                            </a>
                                        ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 mt-16">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Enjoyed this article?</h2>
                    <p className="text-blue-100 mb-8">Subscribe to get notified when we publish new content</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition-shadow">
                            Subscribe Now
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        >
                            Browse More Articles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBlogPage;