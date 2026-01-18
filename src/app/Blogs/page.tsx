"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    useGetBlogsQuery,
    useAddBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} from "@/app/features/BlogSlice";
import { IBlog } from "../../../type";
import ImageUpload from "@/components/ImageUpload";
import {
    Loader2,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    AlertCircle,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Calendar,
    Clock,
    Tag,
    User,
    FileText,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const BlogManagement = () => {
    const { data: blogs, isLoading, isError, refetch } = useGetBlogsQuery();
    const [addBlog] = useAddBlogMutation();
    const [updateBlog] = useUpdateBlogMutation();
    const [deleteBlog] = useDeleteBlogMutation();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);

    const [formData, setFormData] = useState<Partial<IBlog>>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        author: "",
        tags: [],
        category: "",
        isPublished: false,
        seoTitle: "",
        seoDescription: "",
        seoKeywords: [],
        readTime: 5,
    });

    const [tagInput, setTagInput] = useState("");
    const [keywordInput, setKeywordInput] = useState("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === "title" && !editingBlog) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleTogglePublished = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isPublished: checked }));
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((_, i) => i !== index) || [],
        }));
    };

    const handleAddKeyword = () => {
        if (keywordInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                seoKeywords: [...(prev.seoKeywords || []), keywordInput.trim()],
            }));
            setKeywordInput("");
        }
    };

    const handleRemoveKeyword = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            seoKeywords: prev.seoKeywords?.filter((_, i) => i !== index) || [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBlog) {
                await updateBlog({ id: editingBlog._id, data: formData }).unwrap();
            } else {
                await addBlog(formData).unwrap();
            }
            resetForm();
            refetch();
        } catch (error) {
            console.error("Failed to save blog:", error);
        }
    };

    const handleEdit = (blog: IBlog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt,
            featuredImage: blog.featuredImage,
            author: blog.author,
            tags: blog.tags,
            category: blog.category,
            isPublished: blog.isPublished,
            seoTitle: blog.seoTitle,
            seoDescription: blog.seoDescription,
            seoKeywords: blog.seoKeywords,
            readTime: blog.readTime,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await deleteBlog(id).unwrap();
                refetch();
            } catch (error) {
                console.error("Failed to delete blog:", error);
            }
        }
    };

    const handleToggleStatus = async (blog: IBlog) => {
        try {
            await updateBlog({
                id: blog._id,
                data: { isPublished: !blog.isPublished },
            }).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            featuredImage: "",
            author: "",
            tags: [],
            category: "",
            isPublished: false,
            seoTitle: "",
            seoDescription: "",
            seoKeywords: [],
            readTime: 5,
        });
        setEditingBlog(null);
        setIsFormOpen(false);
        setTagInput("");
        setKeywordInput("");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64">
                <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
                <p className="text-red-600">Error loading blogs. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                >
                    <Plus className="h-5 w-5" />
                    Add Blog
                </button>
            </div>

            {/* Blog Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl animated fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingBlog ? "Edit Blog" : "Add New Blog"}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter blog title"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Slug */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="blog-url-slug"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Author *
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Author name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Health, Technology"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Read Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Read Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        min="1"
                                        placeholder="5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Excerpt *
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    required
                                    rows={2}
                                    placeholder="Short description (max 300 characters)"
                                    maxLength={300}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.excerpt?.length || 0}/300 characters
                                </p>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    rows={8}
                                    placeholder="Write your blog content here..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            {/* Featured Image */}
                            <div>
                                <ImageUpload
                                    value={formData.featuredImage || ""}
                                    onChange={(url) =>
                                        setFormData((prev) => ({ ...prev, featuredImage: url }))
                                    }
                                    label="Featured Image *"
                                    required
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                                        placeholder="Add a tag"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(index)}
                                                className="hover:text-indigo-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* SEO Section */}
                            <div className="border-t pt-5">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            SEO Title
                                        </label>
                                        <input
                                            type="text"
                                            name="seoTitle"
                                            value={formData.seoTitle}
                                            onChange={handleInputChange}
                                            maxLength={60}
                                            placeholder="SEO optimized title (max 60 characters)"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.seoTitle?.length || 0}/60 characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            SEO Description
                                        </label>
                                        <textarea
                                            name="seoDescription"
                                            value={formData.seoDescription}
                                            onChange={handleInputChange}
                                            maxLength={160}
                                            rows={2}
                                            placeholder="SEO meta description (max 160 characters)"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.seoDescription?.length || 0}/160 characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            SEO Keywords
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={keywordInput}
                                                onChange={(e) => setKeywordInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                                                placeholder="Add a keyword"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddKeyword}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.seoKeywords?.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-1"
                                                >
                                                    {keyword}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveKeyword(index)}
                                                        className="hover:text-gray-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Publish Status */}
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                    Publish Status
                                </span>
                                <Switch
                                    checked={formData.isPublished || false}
                                    onCheckedChange={handleTogglePublished}
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-sm hover:shadow"
                                >
                                    <Save className="h-5 w-5" />
                                    {editingBlog ? "Update Blog" : "Create Blog"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg transition-all font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {blog.featuredImage ? (
                                    <Image
                                        src={blog.featuredImage}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${blog.isPublished
                                            ? "bg-green-100/90 text-green-800"
                                            : "bg-gray-100/90 text-gray-800"
                                            }`}
                                    >
                                        {blog.isPublished ? "Published" : "Draft"}
                                    </span>
                                </div>
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md bg-indigo-100/90 text-indigo-800">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {blog.author}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {blog.readTime} min
                                    </div>
                                </div>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {blog.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                        {blog.tags.length > 3 && (
                                            <span className="px-2 py-0.5 text-gray-500 text-xs">
                                                +{blog.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <Switch
                                            checked={blog.isPublished}
                                            onCheckedChange={() => handleToggleStatus(blog)}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors tooltip"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors tooltip"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col justify-center items-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="bg-indigo-50 p-4 rounded-full mb-4">
                            <FileText className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No blogs found
                        </h3>
                        <p className="text-gray-500 mb-6 text-center">
                            Start by creating a new blog post to share your content.
                        </p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-sm"
                        >
                            Create First Blog
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogManagement;
