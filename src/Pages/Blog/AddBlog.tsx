import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
// import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { blogService } from "../../Services/BlogService";
import type { RootState } from "../../Redux/store.ts";

import Header from "../../Components/Header.tsx";
import CustomLoader from "../../Components/CustomLoader";

import {
    FaUpload,
    FaImage,
    FaTag,
    FaSave,
    FaTimes,
    FaEye,
    FaBold,
    FaItalic,
    FaListUl,
    FaListOl,
    FaLink,
    FaQuoteRight,
    FaCode,
    FaEdit,
} from "react-icons/fa";
import { MdTitle, MdSubtitles, MdCategory } from "react-icons/md";

type BlogFormData = {
    title: string;
    subtitle: string;
    content: string;
    thumbnail: File | null;
    thumbnailUrl: string;
    category: string;
    tags: string[];
};

export default function CreateBlogPage() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.blog.user);

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string>("");
    const [tagInput, setTagInput] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BlogFormData>({
        defaultValues: {
            title: "",
            subtitle: "",
            content: "",
            category: "General",
            tags: [],
        },
    });

    const categories = [
        "Technology",
        "Programming",
        "Web Development",
        "Mobile Development",
        "AI & Machine Learning",
        "Data Science",
        "DevOps",
        "Design",
        "Business",
        "Lifestyle",
        "Education",
        "Health",
        "Travel",
        "Food",
        "Entertainment",
        "General"
    ];

    // Quill editor modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['blockquote', 'code-block'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image',
        'blockquote', 'code-block',
        'align'
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setValue("thumbnail", file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            setValue("thumbnailUrl", result);
        };
        reader.readAsDataURL(file);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
            const newTags = [...selectedTags, tagInput.trim()];
            setSelectedTags(newTags);
            setValue("tags", newTags);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = selectedTags.filter(tag => tag !== tagToRemove);
        setSelectedTags(newTags);
        setValue("tags", newTags);
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const onSubmit = async (data: BlogFormData) => {
        if (!user) {
            toast.error("Please login to create a blog");
            navigate("/login");
            return;
        }

        if (!data.thumbnail) {
            toast.error("Please upload a thumbnail image");
            return;
        }

        if (data.content.trim().length < 100) {
            toast.error("Content should be at least 100 characters long");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("subtitle", data.subtitle);
            formData.append("content", data.content);
            formData.append("thumbnail", data.thumbnail);
            formData.append("category", data.category);
            formData.append("tags", JSON.stringify(data.tags));
            formData.append("author", user._id);
            formData.append("create_at", new Date().toISOString());

            const res = await blogService.addBlog(formData);

            if (!res.error) {
                toast.success("Blog created successfully!");
                navigate(`/blog/${res.result._id}`);
            } else {
                toast.error(res.message || "Failed to create blog");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error("Create blog error:", error);
        } finally {
            setLoading(false);
        }
    };

    const contentValue = watch("content");

    if (loading) return <CustomLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Create New Blog
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Share your thoughts and ideas with the world
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* BASIC INFO CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <MdTitle className="text-blue-500" />
                            Basic Information
                        </h2>

                        <div className="space-y-6">
                            {/* TITLE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaBold className="text-blue-500" />
                                    Blog Title *
                                </label>
                                <input
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: {
                                            value: 10,
                                            message: "Title should be at least 10 characters"
                                        },
                                        maxLength: {
                                            value: 200,
                                            message: "Title should not exceed 200 characters"
                                        }
                                    })}
                                    type="text"
                                    placeholder="Enter a catchy title for your blog"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            {/* SUBTITLE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MdSubtitles className="text-blue-500" />
                                    Subtitle *
                                </label>
                                <textarea
                                    {...register("subtitle", {
                                        required: "Subtitle is required",
                                        minLength: {
                                            value: 20,
                                            message: "Subtitle should be at least 20 characters"
                                        },
                                        maxLength: {
                                            value: 300,
                                            message: "Subtitle should not exceed 300 characters"
                                        }
                                    })}
                                    rows={3}
                                    placeholder="Brief description of your blog"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                                {errors.subtitle && (
                                    <p className="mt-2 text-sm text-red-600">{errors.subtitle.message}</p>
                                )}
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MdCategory className="text-blue-500" />
                                    Category *
                                </label>
                                <select
                                    {...register("category", {
                                        required: "Category is required"
                                    })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* THUMBNAIL UPLOAD CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <FaImage className="text-blue-500" />
                            Thumbnail Image *
                        </h2>

                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* UPLOAD AREA */}
                                <div className="lg:w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Upload Image (Max 5MB)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="thumbnail-upload"
                                        />
                                        <label
                                            htmlFor="thumbnail-upload"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                        >
                                            <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                                                <FaUpload className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                Click to upload thumbnail
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Recommended: 1200×630 pixels
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                PNG, JPG, JPEG up to 5MB
                                            </p>
                                        </label>
                                    </div>
                                    {errors.thumbnail && (
                                        <p className="mt-2 text-sm text-red-600">{errors.thumbnail.message}</p>
                                    )}
                                </div>

                                {/* PREVIEW AREA */}
                                <div className="lg:w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Preview
                                    </label>
                                    <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center p-6">
                                                <FaImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No image selected</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500">
                                <p>• Choose an eye-catching image that represents your blog content</p>
                                <p>• Use high-quality images for better engagement</p>
                                <p>• Make sure the image is relevant to your blog topic</p>
                            </div>
                        </div>
                    </div>

                    {/* TAGS CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <FaTag className="text-blue-500" />
                            Tags
                        </h2>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleTagKeyPress}
                                    placeholder="Add tags (press Enter to add)"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                                >
                                    Add Tag
                                </button>
                            </div>

                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map((tag) => (
                                        <div
                                            key={tag}
                                            className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-sm text-gray-500">
                                <p>• Add relevant tags to help readers find your blog</p>
                                <p>• Use specific keywords related to your content</p>
                                <p>• Separate tags with commas or press Enter</p>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT EDITOR CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <FaEdit className="text-blue-500" />
                                Blog Content *
                            </h2>
                            <div className="text-sm text-gray-500">
                                {contentValue?.length || 0} characters
                            </div>
                        </div>

                        {/* <Controller
                            name="content"
                            control={control}
                            rules={{
                                required: "Content is required",
                                minLength: {
                                    value: 100,
                                    message: "Content should be at least 100 characters"
                                }
                            }}
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <ReactQuill
                                        theme="snow"
                                        value={field.value}
                                        onChange={field.onChange}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Write your blog content here..."
                                        className="min-h-[400px]"
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600">{errors.content.message}</p>
                                    )}
                                </div>
                            )}
                        /> */}

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                                <p className="font-medium mb-2">Writing Tips:</p>
                                <ul className="space-y-1">
                                    <li>• Start with an engaging introduction</li>
                                    <li>• Use headings to organize content</li>
                                    <li>• Add images where relevant</li>
                                    <li>• Keep paragraphs short and focused</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium mb-2">Formatting Guide:</p>
                                <ul className="space-y-1">
                                    <li>• Use H2/H3 for section headings</li>
                                    <li>• Use bullet points for lists</li>
                                    <li>• Add code blocks for technical content</li>
                                    <li>• Include relevant links</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <FaTimes />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                // Preview functionality
                                toast.success("Preview feature coming soon!");
                            }}
                            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <FaEye />
                            Preview
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave />
                            {loading ? "Publishing..." : "Publish Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}