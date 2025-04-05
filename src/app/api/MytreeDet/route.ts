import DbConnect from "@/lib/mongodbconnect";
import Leader from "@/models/Leader";
import Mytree from "@/models/Mytree";
import Plants_coordinates from "@/models/Treecoords";
import { User } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const plantid = searchParams.get("plantid");
    const findid = searchParams.get("findid"); // Optional, if needed

    if (!plantid) {
      return NextResponse.json({ error: "Missing plantid" }, { status: 400 });
    }

    await DbConnect();
    console.log(
      `Fetching tree data for Plant ID: ${plantid}, Find ID: ${findid}`
    );

    const allOrders = await Mytree.findOne({
      findtree_id: findid,
      Plaintid: plantid,
    });
    ("");
    console.log(allOrders, "Pl");
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching tree data:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const plantid = searchParams.get("plantid");
    const findid = searchParams.get("findid"); // Optional, if needed
    const { status, plantLocation, userId, ImageURL, CommanName } =
      await req.json();

    if (!plantid) {
      return NextResponse.json({ error: "Missing plantid" }, { status: 400 });
    }
    await DbConnect();
    console.log(
      `Fetching tree data for Plant ID: ${plantid}, Find ID: ${findid}`
    );

    const allOrders = await Mytree.findOneAndUpdate(
      {
        findtree_id: findid,
        Plaintid: plantid,
      },
      { $set: { status: 3 } }, // Correct way to update the field
      { new: true } // Returns the updated document);
    );
    const UserName = await User.findById(userId);

    await Plants_coordinates.create({
      find_id: findid,
      UserId: userId,
      late: plantLocation.lat,
      long: plantLocation.lng,
      imageURL: ImageURL,
      name: UserName.firstName + " " + UserName.lastName,
      commonName: CommanName,
      Plant_Addresses: plantLocation.fullAddress,
    });

    const AllTrees = await Plants_coordinates.countDocuments({
      UserId: userId,
    });

    console.log(AllTrees, "Total");

    await Leader.findOneAndUpdate(
      { UserId: userId },
      { $set: { Trees: AllTrees } }
    );
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching tree data:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
