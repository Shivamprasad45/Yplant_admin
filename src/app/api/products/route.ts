import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/mongodbconnect";
import Tree from "@/models/ProductModle";

export async function GET(req: NextRequest) {
    try {
        await DbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // Get single product by ID
            const product = await Tree.findOne({ id });
            if (!product) {
                return NextResponse.json(
                    { error: "Product not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(product);
        } else {
            // Get all products
            const products = await Tree.find({ deletedAt: { $exists: false } }).sort({
                createdAt: -1,
            });
            return NextResponse.json(products);
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch products", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await DbConnect();

        const body = await req.json();

        // Create new product
        const newProduct = new Tree({
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newProduct.save();

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to create product", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        await DbConnect();

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Update product
        const updatedProduct = await Tree.findOneAndUpdate(
            { id },
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to update product", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await DbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Soft delete - set deletedAt timestamp
        const deletedProduct = await Tree.findOneAndUpdate(
            { id },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!deletedProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to delete product", details: error.message },
            { status: 500 }
        );
    }
}
