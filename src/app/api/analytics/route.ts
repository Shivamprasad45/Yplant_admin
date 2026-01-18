// ... existing imports
import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/mongodbconnect";
import { Visit } from "@/models/VisitModel";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await DbConnect();
        const visits = await Visit.find().sort({ lastActiveAt: -1 }).lean();
        return NextResponse.json(visits);
    } catch (error) {
        console.error("Error fetching visits:", error);
        return NextResponse.json(
            { error: "Failed to fetch visits" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await DbConnect();

        // Check for existing active session (within last 30 minutes)
        const THIRTY_MINUTES_AGO = new Date(Date.now() - 30 * 60 * 1000);

        const existingSession = await Visit.findOne({
            ip: body.ip,
            lastActiveAt: { $gte: THIRTY_MINUTES_AGO }
        });

        if (existingSession) {
            // Add visit to existing session
            existingSession.visits.push({
                path: body.path,
                title: body.title,
                referrer: body.referrer,
                visitedAt: new Date(),
            });
            existingSession.lastActiveAt = new Date();
            // Update session metadata if provided (e.g. user logged in later)
            if (body.userId && !existingSession.userId) existingSession.userId = body.userId;
            if (body.email && !existingSession.email) existingSession.email = body.email;

            await existingSession.save();
            return NextResponse.json(existingSession, { status: 200 });
        } else {
            // Create new session
            const newSession = await Visit.create({
                ...body, // Session metadata
                visits: [{
                    path: body.path,
                    title: body.title,
                    referrer: body.referrer,
                    visitedAt: new Date(),
                }],
                lastActiveAt: new Date(),
            });
            return NextResponse.json(newSession, { status: 201 });
        }
    } catch (error) {
        console.error("Error recording visit:", error);
        return NextResponse.json(
            { error: "Failed to record visit" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Visit ID is required" },
                { status: 400 }
            );
        }

        await DbConnect();
        const deletedVisit = await Visit.findByIdAndDelete(id);

        if (!deletedVisit) {
            return NextResponse.json(
                { error: "Visit not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Visit deleted successfully" });
    } catch (error) {
        console.error("Error deleting visit:", error);
        return NextResponse.json(
            { error: "Failed to delete visit" },
            { status: 500 }
        );
    }
}
