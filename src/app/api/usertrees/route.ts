import DbConnect from "@/lib/mongodbconnect";
import Mytree from "@/models/Mytree";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  await DbConnect();

  try {
    const Id = req.nextUrl.searchParams.get("_id");

    const All_order = await Mytree.find({ UserId: Id });
    return NextResponse.json(All_order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await DbConnect();

  try {
    const { findtree_id, status } = await req.json();

    console.log(findtree_id, status, "all");
    await Mytree.findOneAndUpdate(
      { findtree_id: findtree_id },
      { status: status }
    );
    return NextResponse.json({ message: "update successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
