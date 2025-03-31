import DbConnect from "@/lib/mongodbconnect";

import Mytree from "@/models/Mytree";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { plant_id } = await req.json();
    await DbConnect();
    console.log(plant_id, "created");
    const All_order = await Mytree.find({ findtree_id: plant_id });
    return NextResponse.json(All_order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
