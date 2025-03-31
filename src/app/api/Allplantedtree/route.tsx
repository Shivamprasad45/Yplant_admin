import DbConnect from "@/lib/mongodbconnect";

import Mytree from "@/models/Mytree";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    await DbConnect();

    const All_order = await Mytree.find();
    return NextResponse.json(All_order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
