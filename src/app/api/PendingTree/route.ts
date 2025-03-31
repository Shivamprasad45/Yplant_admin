import DbConnect from "@/lib/mongodbconnect";

import Plants_coordinates from "@/models/Treecoords";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  try {
    await DbConnect();
    console.log(id, "id");
    const All_order = await Plants_coordinates.find(
      { UserId: id },
      { subscription: 0 },
      { lastWeatherState: 0 }
    );
    console.log(All_order, "order");
    return NextResponse.json(All_order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing 'id' query parameter" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await DbConnect();

    // Update the document
    const result = await Plants_coordinates.updateOne(
      { find_id: id },
      { $set: { verifed: true } } // Corrected update syntax with `$set`
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No matching record found or already verified" },
        { status: 404 }
      );
    }
    console.log(result, "result");
    return NextResponse.json({ message: "Verification updated successfully" });
  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json(
      { error: "An error occurred while updating verification" },
      { status: 500 }
    );
  }
}
