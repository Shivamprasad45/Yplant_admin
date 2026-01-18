"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label: string;
    required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label,
    required = false,
}) => {
    const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(value);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET || ""
            );

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                onChange(data.secure_url);
                setPreviewUrl(data.secure_url);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (url: string) => {
        onChange(url);
        setPreviewUrl(url);
    };

    const clearImage = () => {
        onChange("");
        setPreviewUrl("");
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">
                {label} {required && "*"}
            </label>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 px-3 py-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${uploadMode === "url"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <LinkIcon className="h-4 w-4" />
                    URL
                </button>
                <button
                    type="button"
                    onClick={() => setUploadMode("upload")}
                    className={`flex-1 px-3 py-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${uploadMode === "upload"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Upload className="h-4 w-4" />
                    Upload
                </button>
            </div>

            {/* URL Input Mode */}
            {uploadMode === "url" && (
                <input
                    type="url"
                    value={value}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    required={required}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            )}

            {/* File Upload Mode */}
            {uploadMode === "upload" && (
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                        </div>
                    )}
                </div>
            )}

            {/* Image Preview */}
            {previewUrl && (
                <div className="relative inline-block">
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="object-cover rounded-lg border border-gray-300"
                    />
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
