import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Header from "../../Components/Header";
import toast from "react-hot-toast";
import { blogService } from "../../Services/BlogService";
import { motion, AnimatePresence } from "framer-motion";
import type { AddBlog } from "../../Types/types";

import {
    FaArrowLeft,
    FaBold,
    FaBookOpen,
    FaChevronDown,
    FaHashtag,
    FaItalic,
    FaLink,
    FaListUl,
    FaSave,
    FaTimes,
    FaUpload,
    FaUser,
    FaSpinner,
    FaExclamationCircle,
    FaQuoteLeft,
    FaCode,
} from "react-icons/fa";
import { MdPreview, MdEdit, MdImage, MdTitle } from "react-icons/md";

const CATEGORIES = [
    "Technology", "Lifestyle", "Travel", "Food", "Health", "Business",
    "Entertainment", "Sports", "Education", "Science", "Art", "Music",
    "Fashion", "Finance", "Personal Development"
];

export default function AddBlogPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

    const [previewMode, setPreviewMode] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<Partial<AddBlog>>({
        title: "",
        subtitle: "",
        content: "",
        category: "",
        tags: [],
        thumbnail: ""
    });

    /* ---------------- VALIDATION ---------------- */
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title?.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }

        if (!formData.subtitle?.trim()) {
            newErrors.subtitle = "Subtitle is required";
        } else if (formData.subtitle.length < 10) {
            newErrors.subtitle = "Subtitle must be at least 10 characters";
        }

        if (!formData.content?.trim()) {
            newErrors.content = "Content is required";
        } else if (formData.content.length < 50) {
            newErrors.content = "Content must be at least 50 characters";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (!thumbnailFile && !formData.thumbnail) {
            newErrors.thumbnail = "Thumbnail image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- SUBMIT HANDLER ---------------- */
    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }

        setIsSubmitting(true);
        try {
            const submitFormData = new FormData();

            submitFormData.append("title", formData.title || "");
            submitFormData.append("subtitle", formData.subtitle || "");
            submitFormData.append("content", formData.content || "");
            submitFormData.append("category", formData.category || "");
            submitFormData.append("tags", JSON.stringify(formData.tags || []));

            if (thumbnailFile) {
                submitFormData.append("thumbnail", thumbnailFile);
            }

            const res = await blogService.addBlog(submitFormData);

            if (!res.error) {
                toast.success("Blog published successfully!");
                navigate("/");
            } else {
                toast.error(res.message || "Failed to publish blog");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("An error occurred while publishing your blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------------- HANDLERS ---------------- */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    };


    const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags?.includes(tagInput)) {
                setFormData(p => ({
                    ...p,
                    tags: [...(p.tags || []), tagInput.toLowerCase()]
                }));
                setTagInput("");
            }
        }
    };

    const removeTag = (tag: string) => {
        setFormData(p => ({
            ...p,
            tags: p.tags?.filter(t => t !== tag)
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            setErrors(prev => ({ ...prev, thumbnail: "Only image files are allowed" }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            setErrors(prev => ({ ...prev, thumbnail: "Image size must be less than 5MB" }));
            return;
        }

        setThumbnailFile(file);
        setFormData(p => ({
            ...p,
            thumbnail: URL.createObjectURL(file)
        }));
        setErrors(prev => ({ ...prev, thumbnail: "" }));
    };

    const handleFormat = (type: "bold" | "italic" | "list" | "link" | "quote" | "code") => {
        const textarea = contentTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content?.slice(start, end) || "";
        const beforeText = formData.content?.slice(0, start) || "";
        const afterText = formData.content?.slice(end) || "";

        let formatted = text;
        if (type === "bold") formatted = `**${text || "bold text"}**`;
        else if (type === "italic") formatted = `*${text || "italic text"}*`;
        else if (type === "list") formatted = text ? `\n- ${text}` : `\n- List item`;
        else if (type === "link") formatted = `[${text || "link text"}](https://example.com)`;
        else if (type === "quote") formatted = `> ${text || "Quote text"}`;
        else if (type === "code") formatted = `\`${text || "code"}\``;

        const newContent = beforeText + formatted + afterText;
        setFormData(p => ({ ...p, content: newContent }));

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + formatted.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const getWordCount = () => {
        return formData.content?.split(/\s+/).filter(word => word.length > 0).length || 0;
    };

    const getCharCount = () => {
        return formData.content?.length || 0;
    };

    /* ---------------- PREVIEW ---------------- */
    const Preview = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
            {formData.thumbnail && (
                <div className="relative h-80 overflow-hidden">
                    <img
                        src={formData.thumbnail}
                        className="w-full h-full object-cover"
                        alt="Blog thumbnail"
                    />
                    {formData.category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg">
                                {formData.category}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {formData.title || "Your Blog Title"}
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {formData.subtitle || "Your blog subtitle"}
                </p>

                <div className="flex items-center gap-4 text-gray-500 mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-blue-500" />
                        <span className="font-semibold">You</span>
                    </div>
                    {formData.category && (
                        <>
                            <span>•</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                                {formData.category}
                            </span>
                        </>
                    )}
                </div>

                <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
                        {formData.content || "Your blog content will appear here..."}
                    </p>
                </div>

                {formData.tags && formData.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                Create New Blog
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Share your thoughts and ideas with the world
                            </p>
                        </div>

                        {/* PREVIEW TOGGLE */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPreviewMode(!previewMode)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${previewMode
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                                }`}
                        >
                            {previewMode ? (
                                <>
                                    <MdEdit />
                                    Edit
                                </>
                            ) : (
                                <>
                                    <MdPreview />
                                    Preview
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {previewMode ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Preview />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* BASIC INFO */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <MdTitle className="text-blue-600 text-xl" />
                                    </div>
                                    Basic Information
                                </h2>

                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Blog Title *
                                        </label>
                                        <input
                                            name="title"
                                            placeholder="Enter an engaging title..."
                                            value={formData.title}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setErrors(prev => ({ ...prev, title: "" }));
                                            }}
                                            className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg ${errors.title ? "border-red-300" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Subtitle *
                                        </label>
                                        <textarea
                                            name="subtitle"
                                            rows={3}
                                            placeholder="Write a compelling subtitle that summarizes your blog..."
                                            value={formData.subtitle}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setErrors(prev => ({ ...prev, subtitle: "" }));
                                            }}
                                            className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${errors.subtitle ? "border-red-300" : "border-gray-200"
                                                }`}
                                        />
                                        {errors.subtitle && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.subtitle}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowCategories(!showCategories)}
                                                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl flex justify-between items-center transition-all ${errors.category
                                                    ? "border-red-300"
                                                    : formData.category
                                                        ? "border-blue-300 bg-blue-50"
                                                        : "border-gray-200"
                                                    }`}
                                            >
                                                <span className={formData.category ? "text-gray-900 font-medium" : "text-gray-400"}>
                                                    {formData.category || "Select a category"}
                                                </span>
                                                <FaChevronDown className={`text-gray-400 transition-transform ${showCategories ? "rotate-180" : ""}`} />
                                            </button>

                                            <AnimatePresence>
                                                {showCategories && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute z-20 w-full bg-white shadow-2xl rounded-xl mt-2 border border-gray-200 max-h-64 overflow-y-auto"
                                                    >
                                                        {CATEGORIES.map(cat => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => {
                                                                    setFormData(p => ({ ...p, category: cat }));
                                                                    setShowCategories(false);
                                                                    setErrors(prev => ({ ...prev, category: "" }));
                                                                }}
                                                                className="block w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                                                            >
                                                                {cat}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <FaExclamationCircle />
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FaBookOpen className="text-purple-600 text-xl" />
                                        </div>
                                        Content
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{getWordCount()} words</span>
                                        <span>•</span>
                                        <span>{getCharCount()} characters</span>
                                    </div>
                                </div>

                                {/* Formatting Toolbar */}
                                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <button
                                        onClick={() => handleFormat("bold")}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                        title="Bold"
                                    >
                                        <FaBold className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleFormat("italic")}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                        title="Italic"
                                    >
                                        <FaItalic className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleFormat("list")}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                        title="List"
                                    >
                                        <FaListUl className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleFormat("link")}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                        title="Link"
                                    >
                                        <FaLink className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleFormat("quote")}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                        title="Quote"
                                    >
                                        <FaQuoteLeft className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => handleFormat("code")}
                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                        title="Code"
                                    >
                                        <FaCode className="text-gray-700" />
                                    </button>
                                </div>

                                <textarea
                                    ref={contentTextareaRef}
                                    name="content"
                                    rows={15}
                                    placeholder="Start writing your blog content here... You can use markdown formatting!"
                                    value={formData.content}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setErrors(prev => ({ ...prev, content: "" }));
                                    }}
                                    className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-base leading-relaxed resize-none ${errors.content ? "border-red-300" : "border-gray-200"
                                        }`}
                                />
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <FaExclamationCircle />
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            {/* TAGS */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-900">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FaHashtag className="text-green-600 text-xl" />
                                    </div>
                                    Tags
                                </h2>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.tags?.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                                        >
                                            #{tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-blue-900"
                                            >
                                                <FaTimes className="text-xs" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagAdd}
                                    placeholder="Type a tag and press Enter..."
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                                <p className="mt-2 text-sm text-gray-500">Press Enter to add a tag</p>
                            </div>

                            {/* THUMBNAIL */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-900">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <MdImage className="text-pink-600 text-xl" />
                                    </div>
                                    Thumbnail Image *
                                </h2>

                                {formData.thumbnail ? (
                                    <div className="relative group">
                                        <img
                                            src={formData.thumbnail}
                                            className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                                            alt="Thumbnail preview"
                                        />
                                        <button
                                            onClick={() => {
                                                setFormData(p => ({ ...p, thumbnail: "" }));
                                                setThumbnailFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-400 ${errors.thumbnail ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageUpload}
                                        />
                                        <FaUpload className="text-4xl text-blue-500 mb-3" />
                                        <span className="text-gray-700 font-medium mb-1">Click to upload image</span>
                                        <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
                                    </label>
                                )}
                                {errors.thumbnail && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FaExclamationCircle />
                                        {errors.thumbnail}
                                    </p>
                                )}
                            </div>

                            {/* SUBMIT BUTTON */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Publish Blog
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
