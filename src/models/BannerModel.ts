
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBanner extends Document {
    title: string;
    imageURL: string;
    link?: string;
    isActive: boolean;
    type?: 'BANNER' | 'TESTIMONIAL';
    description?: string;
    role?: string;
    authorName?: string;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema: Schema<IBanner> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the banner"],
            maxlength: [60, "Title cannot be more than 60 characters"],
        },
        imageURL: {
            type: String,
            required: [true, "Please provide an image URL"],
        },
        link: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: ["BANNER", "TESTIMONIAL"],
            default: "BANNER",
        },
        description: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            required: false,
        },
        authorName: {
            type: String,
            required: false,
        },
        rating: {
            type: Number,
            required: false,
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

// Delete the cached model to ensure schema updates are applied
if (mongoose.models.Banner) {
    delete mongoose.models.Banner;
}

const Banner: Model<IBanner> = mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
