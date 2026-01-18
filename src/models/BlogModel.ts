import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    tags: string[];
    category: string;
    isPublished: boolean;
    publishedAt?: Date;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    readTime?: number; // in minutes
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema<IBlog> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the blog"],
            maxlength: [200, "Title cannot be more than 200 characters"],
        },
        slug: {
            type: String,
            required: [true, "Please provide a slug"],
            unique: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: [true, "Please provide blog content"],
        },
        excerpt: {
            type: String,
            required: [true, "Please provide an excerpt"],
            maxlength: [300, "Excerpt cannot be more than 300 characters"],
        },
        featuredImage: {
            type: String,
            required: [true, "Please provide a featured image"],
        },
        author: {
            type: String,
            required: [true, "Please provide author name"],
        },
        tags: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            required: [true, "Please provide a category"],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        seoTitle: {
            type: String,
            maxlength: [60, "SEO Title cannot be more than 60 characters"],
        },
        seoDescription: {
            type: String,
            maxlength: [160, "SEO Description cannot be more than 160 characters"],
        },
        seoKeywords: {
            type: [String],
            default: [],
        },
        readTime: {
            type: Number,
            default: 5,
        },
    },
    {
        timestamps: true,
    }
);

// Delete the cached model to ensure schema updates are applied
if (mongoose.models.Blog) {
    delete mongoose.models.Blog;
}

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
