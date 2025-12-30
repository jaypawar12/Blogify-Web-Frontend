import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../../Components/Header";
import toast from "react-hot-toast";
import { blogService } from "../../Services/BlogService";
import type { AddBlog } from "../../Types/types";

import {
    FaArrowLeft,
    FaBold,
    FaBookOpen,
    FaChevronDown,
    FaEye,
    FaFileAlt,
    FaHashtag,
    FaHeading,
    FaImage,
    FaItalic,
    FaLink,
    FaListUl,
    FaSave,
    FaTag,
    FaTimes,
    FaUpload,
    FaUser
} from "react-icons/fa";

const CATEGORIES = [
    "Technology", "Lifestyle", "Travel", "Food", "Health", "Business",
    "Entertainment", "Sports", "Education", "Science", "Art", "Music",
    "Fashion", "Finance", "Personal Development"
];

export default function AddBlogPage() {
    const navigate = useNavigate();

    const [previewMode, setPreviewMode] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Partial<AddBlog>>({
        title: "",
        subtitle: "",
        content: "",
        author: "",
        category: "",
        tags: [],
        thumbnail: ""
    });

    /* ---------------- USER PROFILE ---------------- */
    useEffect(() => {
        blogService.fetchUserProfile().then((res: any) => {
            if (!res?.error) {
                setFormData(p => ({
                    ...p,
                    author: res.result?.name || res.result?.email
                }));
            }
        });
    }, []);

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
            toast.error("Only image files allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Max image size is 5MB");
            return;
        }

        setFormData(p => ({
            ...p,
            thumbnail: URL.createObjectURL(file)
        }));
    };

    const handleFormat = (type: "bold" | "italic" | "list" | "link") => {
        const textarea = document.getElementById("content") as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content?.slice(start, end) || "";

        let formatted = text;
        if (type === "bold") formatted = `**${text}**`;
        if (type === "italic") formatted = `*${text}*`;
        if (type === "list") formatted = `\n- ${text}`;
        if (type === "link") formatted = `[${text}](https://example.com)`;

        setFormData(p => ({
            ...p,
            content:
                p.content!.slice(0, start) +
                formatted +
                p.content!.slice(end)
        }));
    };

    /* ---------------- PREVIEW ---------------- */
    const Preview = () => (
        <div className="bg-white rounded-2xl shadow p-8">
            {formData.thumbnail && (
                <img
                    src={formData.thumbnail}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                />
            )}

            <h1 className="text-3xl font-bold mb-2">{formData.title}</h1>
            <p className="text-gray-600 mb-4">{formData.subtitle}</p>

            <div className="flex items-center gap-2 text-gray-500 mb-6">
                <FaUser /> {formData.author}
            </div>

            <p className="whitespace-pre-line text-gray-700">
                {formData.content}
            </p>
        </div>
    );

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 mb-4"
                    >
                        <FaArrowLeft /> Back
                    </button>

                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Create New Blog
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Share your thoughts and ideas with the world
                    </p>
                </div>

                {/* PREVIEW TOGGLE */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50"
                    >
                        <FaEye /> {previewMode ? "Edit" : "Preview"}
                    </button>
                </div>

                {previewMode ? (
                    <Preview />
                ) : (
                    <div className="space-y-8">

                        {/* BASIC INFO */}
                        <div className="bg-white rounded-2xl border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FaHeading className="text-blue-500" />
                                Basic Information
                            </h2>

                            <div className="space-y-6">
                                <input
                                    name="title"
                                    placeholder="Blog title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                                />

                                <textarea
                                    name="subtitle"
                                    rows={3}
                                    placeholder="Subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                                />

                                {/* CATEGORY */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategories(!showCategories)}
                                        className="w-full px-4 py-3 bg-gray-50 border rounded-xl flex justify-between"
                                    >
                                        {formData.category || "Select category"}
                                        <FaChevronDown />
                                    </button>

                                    {showCategories && (
                                        <div className="absolute z-10 w-full bg-white shadow rounded-xl mt-1">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setFormData(p => ({ ...p, category: cat }));
                                                        setShowCategories(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="bg-white rounded-2xl border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FaBookOpen className="text-blue-500" />
                                Content
                            </h2>

                            <div className="flex gap-3 mb-3 text-gray-600">
                                <FaBold onClick={() => handleFormat("bold")} />
                                <FaItalic onClick={() => handleFormat("italic")} />
                                <FaListUl onClick={() => handleFormat("list")} />
                                <FaLink onClick={() => handleFormat("link")} />
                            </div>

                            <textarea
                                id="content"
                                name="content"
                                rows={10}
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                            />
                        </div>

                        {/* THUMBNAIL */}
                        <div className="bg-white rounded-2xl border p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FaImage className="text-blue-500" />
                                Thumbnail
                            </h2>

                            <label className="flex flex-col items-center justify-center h-52 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
                                <FaUpload className="text-3xl text-blue-500 mb-2" />
                                <span>Click to upload image</span>
                                <input type="file" hidden onChange={handleImageUpload} />
                            </label>
                        </div>

                        {/* ACTION */}
                        <button
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2"
                        >
                            <FaSave />
                            Publish Blog
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}
