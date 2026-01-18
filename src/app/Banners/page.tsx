"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    useGetBannersQuery,
    useAddBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} from "@/app/features/BannerSlice";
import { IBanner } from "../../../type";
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
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const BannerManagement = () => {
    const { data: banners, isLoading, isError, refetch } = useGetBannersQuery();
    const [addBanner] = useAddBannerMutation();
    const [updateBanner] = useUpdateBannerMutation();
    const [deleteBanner] = useDeleteBannerMutation();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

    const [formData, setFormData] = useState<Partial<IBanner>>({
        title: "",
        imageURL: "",
        link: "",
        isActive: true,
        type: "BANNER",
        description: "",
        role: "",
        authorName: "",
        rating: 5,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleActive = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isActive: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                await updateBanner({ id: editingBanner._id, data: formData }).unwrap();
            } else {
                await addBanner(formData).unwrap();
            }
            resetForm();
            refetch();
        } catch (error) {
            console.error("Failed to save banner:", error);
        }
    };

    const handleEdit = (banner: IBanner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            imageURL: banner.imageURL,
            link: banner.link,
            isActive: banner.isActive,
            type: banner.type || "BANNER",
            description: banner.description || "",
            role: banner.role || "",
            authorName: banner.authorName || "",
            rating: banner.rating || 5,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                await deleteBanner(id).unwrap();
                refetch();
            } catch (error) {
                console.error("Failed to delete banner:", error);
            }
        }
    };

    const handleToggleStatus = async (banner: IBanner) => {
        try {
            await updateBanner({
                id: banner._id,
                data: { isActive: !banner.isActive },
            }).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            imageURL: "",
            link: "",
            isActive: true,
            type: "BANNER",
            description: "",
            role: "",
            authorName: "",
            rating: 5,
        });
        setEditingBanner(null);
        setIsFormOpen(false);
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
                <p className="text-red-600">Error loading banners. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                >
                    <Plus className="h-5 w-5" />
                    Add Banner
                </button>
            </div>

            {/* Banner Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animated fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingBanner ? "Edit Banner" : "Add New Banner"}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter banner title"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link || ""}
                                    onChange={handleInputChange}
                                    placeholder="e.g., /products/new-arrival"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <ImageUpload
                                    value={formData.imageURL || ""}
                                    onChange={(url) =>
                                        setFormData((prev) => ({ ...prev, imageURL: url }))
                                    }
                                    label="Banner/Testimonial Image *"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                    <option value="BANNER">Banner</option>
                                    <option value="TESTIMONIAL">Testimonial</option>
                                </select>
                            </div>

                            {formData.type === "TESTIMONIAL" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Author Name
                                        </label>
                                        <input
                                            type="text"
                                            name="authorName"
                                            value={formData.authorName || ""}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role || ""}
                                            onChange={handleInputChange}
                                            placeholder="CEO, Example Corp"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Message / Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Great service..."
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rating (0-5)
                                        </label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating || 0}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                    Active Status
                                </span>
                                <Switch
                                    checked={formData.isActive || false}
                                    onCheckedChange={handleToggleActive}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-sm hover:shadow"
                                >
                                    <Save className="h-5 w-5" />
                                    {editingBanner ? "Update Banner" : "Create Banner"}
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

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners && banners.length > 0 ? (
                    banners.map((banner) => (
                        <div
                            key={banner._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {banner.imageURL ? (
                                    <Image
                                        src={banner.imageURL}
                                        alt={banner.title}
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
                                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${banner.isActive
                                            ? "bg-green-100/90 text-green-800"
                                            : "bg-gray-100/90 text-gray-800"
                                            }`}
                                    >
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute top-3 left-3">
                                {banner.type === "TESTIMONIAL" && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md bg-blue-100/90 text-blue-800">
                                        Testimonial
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                                    {banner.title}
                                </h3>
                                {banner.link && (
                                    <p className="text-sm text-gray-500 mb-4 truncate">
                                        Link:{" "}
                                        <span className="text-indigo-600 font-medium">
                                            {banner.link}
                                        </span>
                                    </p>
                                )}
                                {banner.type === "TESTIMONIAL" && (
                                    <div className="mb-4 text-sm text-gray-600">
                                        <p className="font-semibold">{banner.authorName}</p>
                                        <p className="text-xs text-gray-500 mb-1">{banner.role}</p>
                                        <p className="italic line-clamp-2">&quot;{banner.description}&quot;</p>
                                        <div className="flex items-center mt-1 text-yellow-500">
                                            <span className="font-bold mr-1">{banner.rating}</span> ★
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <Switch
                                            checked={banner.isActive}
                                            onCheckedChange={() => handleToggleStatus(banner)}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors tooltip"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
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
                            <ImageIcon className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No banners found
                        </h3>
                        <p className="text-gray-500 mb-6. text-center">
                            Start by creating a new banner to display on your app.
                        </p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium shadow-sm"
                        >
                            Create First Banner
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerManagement;
