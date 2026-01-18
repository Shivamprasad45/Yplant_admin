"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    useGetAllProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "@/app/features/ProductAdd";
import { Product } from "../../../type";
import { Loader2, AlertCircle, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const ProductManagement = () => {
    const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        id: "",
        commonName: "",
        scientificName: "",
        description: "",
        growthRequirements: "",
        benefits: [],
        region: "",
        imageURL: "",
        prise: 0,
        seoTitle: "",
        seoDescription: "",
        growthTips: "",
        seoKeywords: [],
        isPublished: true,
        metadata: {},
        privateMetadata: {},
        tags: [],
        AffiliateLink: "",
        AffiliateImage: "",
        AffiliateName: "",
        AffiliateDescription: "",
        AffiliatePrise: 0,
        AffiliateDiscount: 0,
        AffiliatePriseAfterDiscount: 0,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayInput = (name: string, value: string) => {
        const arrayValue = value.split(",").map((item) => item.trim());
        setFormData((prev) => ({ ...prev, [name]: arrayValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, data: formData }).unwrap();
            } else {
                await createProduct(formData).unwrap();
            }
            resetForm();
            refetch();
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
                refetch();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            commonName: "",
            scientificName: "",
            description: "",
            growthRequirements: "",
            benefits: [],
            region: "",
            imageURL: "",
            prise: 0,
            seoTitle: "",
            seoDescription: "",
            growthTips: "",
            seoKeywords: [],
            isPublished: true,
            metadata: {},
            privateMetadata: {},
            tags: [],
            AffiliateLink: "",
            AffiliateImage: "",
            AffiliateName: "",
            AffiliateDescription: "",
            AffiliatePrise: 0,
            AffiliateDiscount: 0,
            AffiliatePriseAfterDiscount: 0,
        });
        setEditingProduct(null);
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
                <p className="text-red-600">Error loading products. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Product
                </button>
            </div>

            {/* Product Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Product ID *</label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={formData.id}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!editingProduct}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Common Name *</label>
                                    <input
                                        type="text"
                                        name="commonName"
                                        value={formData.commonName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Scientific Name *</label>
                                    <input
                                        type="text"
                                        name="scientificName"
                                        value={formData.scientificName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Region *</label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Price *</label>
                                    <input
                                        type="number"
                                        name="prise"
                                        value={formData.prise}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Product Image */}
                            <ImageUpload
                                value={formData.imageURL || ""}
                                onChange={(url) =>
                                    setFormData((prev) => ({ ...prev, imageURL: url }))
                                }
                                label="Product Image"
                                required
                            />

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tags (comma-separated) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags?.join(", ")}
                                    onChange={(e) => handleArrayInput("tags", e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>

                            {/* Description Fields */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Growth Requirements *</label>
                                <textarea
                                    name="growthRequirements"
                                    value={formData.growthRequirements}
                                    onChange={handleInputChange}
                                    required
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Growth Tips *</label>
                                <textarea
                                    name="growthTips"
                                    value={formData.growthTips}
                                    onChange={handleInputChange}
                                    required
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Benefits */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Benefits (comma-separated) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.benefits?.join(", ")}
                                    onChange={(e) => handleArrayInput("benefits", e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Benefit 1, Benefit 2, Benefit 3"
                                />
                            </div>

                            {/* SEO Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SEO Title *</label>
                                    <input
                                        type="text"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        SEO Keywords (comma-separated) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.seoKeywords?.join(", ")}
                                        onChange={(e) => handleArrayInput("seoKeywords", e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">SEO Description *</label>
                                <textarea
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleInputChange}
                                    required
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Affiliate Section */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-4">Affiliate Information (Optional)</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Affiliate Name</label>
                                        <input
                                            type="text"
                                            name="AffiliateName"
                                            value={formData.AffiliateName || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Affiliate Link</label>
                                        <input
                                            type="url"
                                            name="AffiliateLink"
                                            value={formData.AffiliateLink || ""}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Affiliate Price</label>
                                        <input
                                            type="number"
                                            name="AffiliatePrise"
                                            value={formData.AffiliatePrise || 0}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Affiliate Discount (%)</label>
                                        <input
                                            type="number"
                                            name="AffiliateDiscount"
                                            value={formData.AffiliateDiscount || 0}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price After Discount</label>
                                        <input
                                            type="number"
                                            name="AffiliatePriseAfterDiscount"
                                            value={formData.AffiliatePriseAfterDiscount || 0}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">Affiliate Description</label>
                                    <textarea
                                        name="AffiliateDescription"
                                        value={formData.AffiliateDescription || ""}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Affiliate Image */}
                                <div className="mt-4">
                                    <ImageUpload
                                        value={formData.AffiliateImage || ""}
                                        onChange={(url) =>
                                            setFormData((prev) => ({ ...prev, AffiliateImage: url }))
                                        }
                                        label="Affiliate Image"
                                        required={false}
                                    />
                                </div>
                            </div>

                            {/* Published Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                                    }
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm font-medium">Published</label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Save className="h-5 w-5" />
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Scientific Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Region
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products && products.length > 0 ? (
                                products.map((product: Product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Image
                                                src={product.imageURL}
                                                alt={product.commonName}
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.commonName}
                                            </div>
                                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.scientificName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.region}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{product.prise}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isPublished
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {product.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                                                >
                                                    <Edit2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No products found. Click &quot;Add Product&quot; to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
