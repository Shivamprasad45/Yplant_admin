import { NextResponse } from "next/server";
import Blog from "@/models/BlogModel";
import DbConnect from "@/lib/mongodbconnect";

export async function GET() {
    await DbConnect();
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    await DbConnect();
    try {
        const body = await req.json();

        // Auto-generate slug from title if not provided
        if (!body.slug && body.title) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Set publishedAt if isPublished is true
        if (body.isPublished && !body.publishedAt) {
            body.publishedAt = new Date();
        }

        const blog = await Blog.create(body);
        return NextResponse.json(blog, { status: 201 });
    } catch (error: any) {
        console.error("Create Blog Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create blog" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    await DbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Blog ID is required" },
                { status: 400 }
            );
        }

        // Update publishedAt if changing from unpublished to published
        if (body.isPublished && !body.publishedAt) {
            body.publishedAt = new Date();
        }

        const blog = await Blog.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error: any) {
        console.error("Update Blog Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update blog" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    await DbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Blog ID is required" },
                { status: 400 }
            );
        }

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Blog deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete blog" },
            { status: 500 }
        );
    }
}
