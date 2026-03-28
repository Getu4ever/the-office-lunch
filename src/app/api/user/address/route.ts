import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

/**
 * NEW GET HANDLER: 
 * This is what the Menu page/Cart Context uses to recognize the 
 * logged-in user and their saved address after a refresh.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select("addresses");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Return the addresses array so the CartProvider can find the default one
    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { addressId, label, addressLine1, city, postcode, telephone } = body;

    if (!addressId) return NextResponse.json({ error: "Address ID required" }, { status: 400 });

    await dbConnect();

    // SCENARIO A: Switch Primary Address (Triggered when clicking the radio button)
    if (!addressLine1) {
      await User.updateOne(
        { email: session.user.email },
        { $set: { "addresses.$[].isDefault": false } }
      );

      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email, "addresses._id": addressId },
        { $set: { "addresses.$.isDefault": true } },
        { new: true }
      );

      return NextResponse.json(updatedUser.addresses.find((a: any) => String(a._id) === String(addressId)));
    }

    // SCENARIO B: Full Update (Editing telephone, etc., from the Modal)
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email, "addresses._id": addressId },
      { 
        $set: { 
          "addresses.$.label": label,
          "addresses.$.addressLine1": addressLine1,
          "addresses.$.city": city,
          "addresses.$.postcode": postcode,
          "addresses.$.telephone": telephone
        } 
      },
      { new: true }
    );

    if (!updatedUser) return NextResponse.json({ error: "User or Address not found" }, { status: 404 });

    const updatedAddress = updatedUser.addresses.find((a: any) => String(a._id) === String(addressId));
    return NextResponse.json(updatedAddress);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { label, addressLine1, city, postcode, telephone } = body;
    
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    const isFirstAddress = !user.addresses || user.addresses.length === 0;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $push: { 
          addresses: { label, addressLine1, city, postcode, telephone, isDefault: isFirstAddress } 
        } 
      },
      { new: true }
    );

    const newAddress = updatedUser.addresses[updatedUser.addresses.length - 1];
    return NextResponse.json(newAddress);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('addressId');

    if (!addressId) return NextResponse.json({ error: "Address ID required" }, { status: 400 });

    await dbConnect();
    await User.updateOne({ email: session.user.email }, { $pull: { addresses: { _id: addressId } } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}