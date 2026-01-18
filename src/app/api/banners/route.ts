import { NextResponse } from "next/server";
import Banner from "@/models/BannerModel";
import DbConnect from "@/lib/mongodbconnect";



export async function GET() {
    await DbConnect();
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch banners" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    await DbConnect();
    try {
        const body = await req.json();
        console.log("Create Banner Payload:", body);
        const banner = await Banner.create(body);
        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        console.error("Create Banner Error:", error);
        return NextResponse.json(
            { error: "Failed to create banner" },
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
                { error: "Banner ID is required" },
                { status: 400 }
            );
        }

        const banner = await Banner.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update banner" },
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
                { error: "Banner ID is required" },
                { status: 400 }
            );
        }

        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Banner deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete banner" },
            { status: 500 }
        );
    }
}
